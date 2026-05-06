# reCAPTCHA Integration Setup

This document explains the reCAPTCHA v2 integration added to the signup process.

## Overview

Google reCAPTCHA v2 has been integrated into the signup form to prevent automated bot registrations. The captcha is required on the first step of signup (account information) and is verified both client-side and server-side.

## Implementation Details

### Client-Side Changes

1. **SignUpInfo.js**: 
   - Added `ReCAPTCHA` component import
   - Added `captchaToken` state management
   - Added captcha validation in `validate()` function
   - Added reCAPTCHA widget to the form
   - Included `captchaToken` in API requests

2. **SignUpForm.js**:
   - Added `captchaToken` field to form data structure (both preset and empty data)

### Server-Side Changes

1. **check-availability/route.js**:
   - Added captcha token verification using Google's reCAPTCHA API
   - Returns error if captcha is missing or invalid

2. **signup/route.js**:
   - Added captcha token verification for final signup submission
   - Ensures captcha is validated before user creation

## Current Configuration

**Note**: The integration is currently using Google's test keys for development:

- **Site Key**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEbQjYyB8CR2Kw`
- **Secret Key**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

These are Google's official test keys that always return a successful verification. **For production, you must replace these with your own reCAPTCHA keys.**

## Production Setup

1. **Get reCAPTCHA Keys**:
   - Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
   - Register your site and choose "reCAPTCHA v2"
   - Get your Site Key and Secret Key

2. **Update Configuration**:
   - Replace the test keys in:
     - `src/app/components/auth/SignUpInfo.js` (site key)
     - `src/app/api/auth/signup/check-availability/route.js` (secret key)
     - `src/app/api/auth/signup/route.js` (secret key)

3. **Environment Variables (Recommended)**:
   - Add to your `.env.local`:
     ```
     NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
     RECAPTCHA_SECRET_KEY=your_secret_key_here
     ```
   - Update the code to use these environment variables

## Testing

The captcha integration can be tested by:

1. **Manual Testing**:
   - Navigate to `/home/signup`
   - Fill out the first form step
   - Verify the reCAPTCHA widget appears
   - Try submitting without completing captcha (should show error)
   - Complete captcha and submit (should proceed to next step)

2. **API Testing**:
   - Make POST requests to `/api/auth/signup/check-availability`
   - Requests without `captchaToken` should return 400 error
   - Requests with invalid tokens should return 400 error

## Security Features

- **Dual Verification**: Captcha is verified at both the availability check and final signup
- **Token Expiration**: Captcha tokens are cleared when they expire
- **Server-Side Validation**: All verification happens server-side using Google's API
- **Error Handling**: Clear error messages for captcha failures

## Files Modified

- `src/app/components/auth/SignUpInfo.js` - Added reCAPTCHA component and validation
- `src/app/components/auth/SignUpForm.js` - Added captchaToken to form data
- `src/app/api/auth/signup/check-availability/route.js` - Added server verification
- `src/app/api/auth/signup/route.js` - Added server verification
- `package.json` - Added react-google-recaptcha dependency

## Next Steps

1. Replace test keys with production reCAPTCHA keys
2. Consider using environment variables for key management
3. Test the complete signup flow with captcha
4. Monitor captcha success/failure rates in production
