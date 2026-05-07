# Rate Limiting Implementation

This document explains the rate limiting implementation added to your Next.js application.

## Overview

Rate limiting has been implemented using Upstash Redis with the `@upstash/ratelimit` library. This provides distributed rate limiting that works across multiple server instances.

## Rate Limiting Configuration

Different rate limits are applied based on endpoint types:

### Authentication Endpoints
- **Endpoints**: `/api/auth/signin`, `/api/auth/signup`
- **Limit**: 5 requests per minute
- **Strategy**: IP-based rate limiting

### General API Endpoints  
- **Endpoints**: Most user-facing APIs like `/api/users`
- **Limit**: 100 requests per minute
- **Strategy**: User-based (if authenticated) or IP-based

### Admin Endpoints
- **Endpoints**: `/api/portal/admin/*`
- **Limit**: 200 requests per minute
- **Strategy**: User-based rate limiting for admin users

### File Upload Endpoints
- **Endpoints**: `/api/cloudinary/upload`
- **Limit**: 10 uploads per minute
- **Strategy**: User-based rate limiting

## Setup Instructions

### 1. Environment Variables

Add these to your `.env` file:

```env
# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

### 2. Get Upstash Redis Credentials

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and Token from the database details
4. Add them to your environment variables

## Files Modified

### New Files
- `src/lib/rateLimit.js` - Rate limiting middleware and utilities
- `test-rate-limiting.js` - Test script for verification
- `RATE_LIMITING_SETUP.md` - This documentation

### Modified Files
- `src/app/api/auth/signin/route.js` - Added auth rate limiting
- `src/app/api/auth/signup/route.js` - Added auth rate limiting  
- `src/app/api/users/route.js` - Added general rate limiting
- `src/app/api/cloudinary/upload/route.js` - Added upload rate limiting
- `src/app/api/portal/admin/members/route.js` - Added admin rate limiting
- `env.example` - Added Upstash Redis environment variables

## Testing

Run the test script to verify rate limiting:

```bash
npm run dev
# In another terminal:
node test-rate-limiting.js
```

## Rate Limit Headers

All rate-limited responses include these headers:

- `X-RateLimit-Limit` - Total requests allowed in the window
- `X-RateLimit-Remaining` - Requests remaining in the current window
- `X-RateLimit-Reset` - Unix timestamp when the window resets

## Response Format

When rate limited, endpoints return:

```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

With HTTP status `429 Too Many Requests`.

## Adding Rate Limiting to New Endpoints

To add rate limiting to a new endpoint:

1. Import the required functions:
```javascript
import { applyRateLimit, generalRateLimit } from "@/lib/rateLimit";
```

2. Add rate limiting at the start of your handler:
```javascript
export async function POST(req) {
  const rateLimitResult = await applyRateLimit(req, generalRateLimit);
  
  if (!rateLimitResult.success) {
    const response = NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
    
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
  
  // Your existing code...
}
```

3. Add rate limit headers to successful responses:
```javascript
const response = NextResponse.json({ success: true, data: result });

Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
  response.headers.set(key, value);
});

return response;
```

## Custom Rate Limits

You can create custom rate limiters in `src/lib/rateLimit.js`:

```javascript
export const customRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '30 s'), // 50 requests per 30 seconds
  analytics: true,
});
```

## Security Considerations

- Rate limiting is applied before authentication checks to prevent brute force attacks
- IP-based fallback ensures unauthenticated requests are still rate limited
- User-based rate limiting provides fair limits per authenticated user
- Redis-based storage ensures rate limits persist across server restarts
