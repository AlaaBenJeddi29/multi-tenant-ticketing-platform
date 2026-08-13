# Rate Limiting Implementation Summary

## Overview
Implemented two-tier rate limiting strategy using `express-rate-limit` to protect against brute-force attacks and API abuse.

## Implementation Details

### 1. Strict Authentication Rate Limiter
**Purpose**: Protect sensitive authentication endpoints from brute-force attacks

**Configuration**:
- **Endpoints**: 
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
- **Limit**: 10 requests per 15 minutes per IP
- **Response**: `429 Too Many Requests` with JSON body:
  ```json
  {
    "message": "Too many attempts, please try again later."
  }
  ```

**Location**: Applied directly in `auth.routes.ts` on specific routes

### 2. General API Rate Limiter
**Purpose**: Protect all API endpoints from runaway clients and general abuse

**Configuration**:
- **Endpoints**: All `/api/*` routes
- **Limit**: 300 requests per 15 minutes per IP
- **Response**: Same 429 JSON response as strict limiter

**Location**: Applied in `app.ts` as middleware before route mounts

## Files Modified

1. **`package.json`**
   - Added `express-rate-limit` dependency

2. **`src/middleware/rate-limit.middleware.ts`** (NEW)
   - Created `authRateLimiter` for authentication endpoints
   - Created `generalApiRateLimiter` for all API routes
   - Both limiters return consistent error format matching the application's error handling conventions

3. **`src/modules/auth/routes/auth.routes.ts`**
   - Imported `authRateLimiter`
   - Applied to: `/register`, `/login`, `/forgot-password`, `/reset-password`
   - Note: `/verify-reset-code` intentionally excluded (verification step, not credential submission)

4. **`src/app.ts`**
   - Imported `generalApiRateLimiter`
   - Applied to all `/api/*` routes after body parsers, before route mounts
   - Positioned correctly to ensure rate limiting happens early in the middleware chain

## Middleware Order in app.ts

1. Security & Logging (helmet, morgan, cors)
2. Body Parsers (express.json, cookieParser)
3. **General Rate Limiter** (new)
4. API Routes
5. 404 Handler
6. Error Handler

## Rate Limit Headers

Both limiters include standard rate limit headers in responses:
- `RateLimit-Limit`: Total number of requests allowed
- `RateLimit-Remaining`: Number of requests remaining
- `RateLimit-Reset`: Time when the rate limit window resets

## Testing Recommendations

1. **Strict Limiter Test**:
   - Make 10 consecutive login attempts
   - 11th request should return 429

2. **General Limiter Test**:
   - Make 300+ API requests within 15 minutes
   - Requests beyond 300 should return 429

3. **Rate Limit Reset Test**:
   - Wait 15 minutes after hitting limit
   - Verify requests are allowed again

## Security Considerations

- Rate limiting is per IP address
- Successful and failed requests both count toward the limit
- The strict limit applies on top of the general limit (authentication endpoints have both)
- In production behind a proxy, ensure `trust proxy` is enabled in Express to get real client IPs

## Future Enhancements

Consider adding:
- Redis store for distributed rate limiting across multiple server instances
- Different rate limits for authenticated vs unauthenticated users
- Custom key generators (e.g., by user ID instead of IP for authenticated routes)
- Whitelist for internal/trusted IPs
