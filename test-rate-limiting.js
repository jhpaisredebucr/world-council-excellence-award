// Test script to verify rate limiting functionality
// Run this with: node test-rate-limiting.js

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Node.js fetch polyfill for older Node versions
if (typeof fetch === 'undefined') {
  global.fetch = async (url, options) => {
    const https = require('https');
    const http = require('http');
    const { URL } = require('url');
    
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const isHttps = parsedUrl.protocol === 'https:';
      const lib = isHttps ? https : http;
      
      const postData = options.body ? Buffer.from(options.body) : null;
      
      const req = lib.request({
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: {
              get: (name) => res.headers[name.toLowerCase()]
            },
            json: async () => JSON.parse(data),
            text: async () => data
          });
        });
      });
      
      req.on('error', reject);
      if (postData) {
        req.write(postData);
      }
      req.end();
    });
  };
}

async function testRateLimit(endpoint, method = 'POST', body = {}) {
  console.log(`\n=== Testing rate limiting for ${endpoint} ===`);
  
  for (let i = 1; i <= 7; i++) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'POST' ? JSON.stringify(body) : undefined,
      });
      
      const data = await response.json();
      
      console.log(`Request ${i}: Status ${response.status}`);
      console.log(`Rate Limit Headers:`, {
        'X-RateLimit-Limit': response.headers.get('X-RateLimit-Limit'),
        'X-RateLimit-Remaining': response.headers.get('X-RateLimit-Remaining'),
        'X-RateLimit-Reset': response.headers.get('X-RateLimit-Reset'),
      });
      
      if (response.status === 429) {
        console.log(`✅ Rate limiting activated on request ${i}: ${data.message}`);
        break;
      } else if (i <= 5) {
        console.log(`✅ Request ${i} allowed`);
      } else {
        console.log(`⚠️  Request ${i} was allowed (unexpected)`);
      }
      
    } catch (error) {
      console.error(`Request ${i} failed:`, error.message);
    }
  }
}

async function main() {
  console.log('Rate Limiting Test Suite');
  console.log('========================');
  
  // Test authentication endpoints (5 requests per minute)
  await testRateLimit('/api/auth/signin', 'POST', {
    username: 'test',
    password: 'test'
  });
  
  // Test upload endpoint (10 requests per minute)
  await testRateLimit('/api/cloudinary/upload', 'POST', {
    // This will fail due to no file, but should still test rate limiting
  });
  
  console.log('\n=== Test Complete ===');
  console.log('Make sure to:');
  console.log('1. Set up Upstash Redis environment variables');
  console.log('2. Start your Next.js server');
  console.log('3. Run this test script');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testRateLimit };
