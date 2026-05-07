import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Create different rate limiters for different types of endpoints
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'), // 5 requests per minute for auth
  analytics: true,
});

export const generalRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60 s'), // 100 requests per minute for general APIs
  analytics: true,
});

export const adminRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(200, '60 s'), // 200 requests per minute for admin APIs
  analytics: true,
});

export const uploadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 uploads per minute
  analytics: true,
});

// Main rate limiting middleware function
export async function applyRateLimit(request, rateLimiter, identifier = null) {
  try {
    // Get identifier from request (IP address or user ID)
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Use provided identifier or fall back to IP
    const key = identifier || ip;
    
    const { success, limit, remaining, reset } = await rateLimiter.limit(key);
    
    return {
      success,
      limit,
      remaining,
      reset,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      }
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // If rate limiting fails, allow the request to proceed
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
      headers: {}
    };
  }
}

// Helper function to get user ID from token for user-specific rate limiting
export async function getUserIdFromRequest(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id?.toString() || null;
  } catch (error) {
    return null;
  }
}
