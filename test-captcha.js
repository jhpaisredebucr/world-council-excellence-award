// Test script to verify captcha functionality
const testCaptcha = async () => {
  try {
    // Use the correct API URL based on current environment
    const apiUrl = window.location.origin === 'https://worldcouncilexcellenceaward.vercel.app' 
      ? 'https://worldcouncilexcellenceaward.vercel.app/api/auth/signup/check-availability'
      : 'http://localhost:3000/api/auth/signup/check-availability';
    
    console.log('Testing API URL:', apiUrl);
    
    // Test 1: Request without captcha token should fail
    console.log('Testing without captcha token...');
    const response1 = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser123',
        email: 'test@example.com',
        password: 'password123',
        referralCode: 'MEM-8WJOE4'
      })
    });
    
    const result1 = await response1.json();
    console.log('Without captcha:', result1);
    
    // Test 2: Request with invalid captcha token should fail
    console.log('\nTesting with invalid captcha token...');
    const response2 = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser456',
        email: 'test2@example.com',
        password: 'password123',
        referralCode: 'MEM-8WJOE4',
        captchaToken: 'invalid_token'
      })
    });
    
    const result2 = await response2.json();
    console.log('With invalid captcha:', result2);
    
  } catch (error) {
    console.error('Test error:', error);
  }
};

testCaptcha();
