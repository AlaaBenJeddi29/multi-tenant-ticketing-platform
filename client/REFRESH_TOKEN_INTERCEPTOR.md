# Refresh Token Interceptor - Frontend Implementation

## Overview

Implemented a transparent axios response interceptor that automatically refreshes expired access tokens on 401 responses. This provides seamless authentication without any changes to the AuthContext or component code.

## How It Works

### The Problem

Previously:
- Access token expires after 1 hour
- User gets 401 error on next API request
- User is redirected to login page
- Poor user experience

### The Solution

With the interceptor:
- Access token expires after 1 hour
- User makes an API request → 401 response
- **Interceptor automatically calls `/auth/refresh`**
- New access token issued via cookie
- **Original request automatically retried**
- User never sees the 401 error
- Seamless experience for 30 days (refresh token lifetime)

## Implementation Details

### Key Features

1. **Automatic Refresh** - 401 errors trigger refresh attempt
2. **Transparent** - No changes needed to AuthContext or components
3. **Single In-Flight Promise** - Multiple concurrent 401s share one refresh call
4. **Smart Retry Logic** - Original request retried after successful refresh
5. **Graceful Degradation** - Failed refresh allows normal error handling

### Code Flow

```typescript
User Request → API Call → 401 Response
                              ↓
                    Is this a 401? ───No──→ Return error
                              ↓ Yes
                    Is this an auth endpoint? ───Yes──→ Return error
                              ↓ No
                    Already retried? ───Yes──→ Return error
                              ↓ No
                    Is refresh in progress?
                         ↓ Yes          ↓ No
                    Wait for it    Start refresh
                              ↓
                    Refresh successful?
                         ↓ Yes          ↓ No
                    Retry request   Return original error
```

### Race Condition Prevention

**Problem:** If 5 API requests fail with 401 simultaneously, we don't want 5 separate refresh calls.

**Solution:** Single shared promise

```typescript
let refreshPromise: Promise<void> | null = null;

// Request 1 triggers refresh
if (!refreshPromise) {
  refreshPromise = api.post("/auth/refresh").then(...);
}

// Requests 2-5 wait for the same promise
await refreshPromise;

// All 5 requests retry with the new token
```

**Result:** Only 1 refresh call, all requests wait and retry together.

### Excluded Endpoints

The interceptor does NOT attempt refresh for:

1. **`/auth/login`** - Login creates tokens, no refresh needed
2. **`/auth/register`** - Registration flow, no tokens yet
3. **`/auth/refresh`** - The refresh endpoint itself (prevent infinite loop)

All other 401 responses trigger the refresh logic.

### Retry Protection

Each request can only be retried once:

```typescript
originalRequest._retry = true;

// If we get another 401 after refresh, don't try again
if (originalRequest._retry) {
  return Promise.reject(error);
}
```

This prevents infinite loops if refresh succeeds but the original request still fails (e.g., authorization issue, not authentication).

## No Changes to AuthContext

**Important:** The AuthContext remains unchanged from Phase 1:

```typescript
type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => Promise<void>;
};
```

The interceptor is **completely transparent** to:
- ✅ AuthContext
- ✅ useAuth hook
- ✅ RequireAuth component
- ✅ All application components

**Why?** The interceptor operates at the axios layer, below the application logic. Components never see the 401 errors because they're handled and resolved transparently.

## User Experience

### Without Interceptor

```
User logged in at 9:00 AM
User browsing app...
10:00 AM - Access token expires
User clicks "View Tickets"
❌ 401 Error
❌ Redirected to login page
😞 User must log in again
```

### With Interceptor

```
User logged in at 9:00 AM
User browsing app...
10:00 AM - Access token expires
User clicks "View Tickets"
→ 401 caught by interceptor
→ POST /auth/refresh (silent)
→ New token issued
→ Retry "View Tickets"
✅ Tickets displayed
😊 User never notices
```

The user stays logged in for 30 days as long as they're active!

## Testing

### Manual Testing

**1. Verify Interceptor is Active**

```typescript
// In browser console
console.log(window.axios.interceptors.response.handlers.length);
// Should be > 0
```

**2. Test Automatic Refresh**

```typescript
// Simulate token expiry (backend) or wait 1 hour
// Then make any API request
fetch('/api/tickets', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log);

// Check Network tab:
// 1. GET /api/tickets → 401
// 2. POST /auth/refresh → 200
// 3. GET /api/tickets → 200 (retry)
```

**3. Test Multiple Concurrent Requests**

```typescript
// Fire 5 requests simultaneously
Promise.all([
  api.get('/api/tickets'),
  api.get('/api/categories'),
  api.get('/api/priorities'),
  api.get('/api/users'),
  api.get('/api/assets'),
]).then(console.log);

// Check Network tab:
// - All 5 requests fail with 401
// - Only 1 POST /auth/refresh
// - All 5 requests retry and succeed
```

**4. Test Refresh Failure**

```typescript
// Logout to invalidate refresh token
await api.post('/auth/logout');

// Try to make a request (should fail gracefully)
api.get('/api/tickets')
  .catch(err => {
    console.log('Expected error:', err);
    // Should redirect to login via RequireAuth
  });

// Check Network tab:
// 1. GET /api/tickets → 401
// 2. POST /auth/refresh → 401
// 3. GET /api/tickets NOT retried
// 4. Normal error handling takes over
```

### Browser DevTools

**Network Tab - Successful Refresh:**

```
GET /api/tickets         401 Unauthorized
POST /auth/refresh       200 OK
GET /api/tickets         200 OK  ← Automatic retry
```

**Network Tab - Failed Refresh:**

```
GET /api/tickets         401 Unauthorized
POST /auth/refresh       401 Unauthorized
(No retry, error bubbles up)
```

**Application Tab - Cookies:**

After refresh, you should see updated cookies:
- `accessToken` - New value (path="/")
- `refreshToken` - New value (path="/api/auth")

## Integration with Existing Code

### No Changes Required!

The interceptor works with all existing code:

**1. AuthContext - No Changes**

```typescript
// Existing code continues to work
const { user, isAuthenticated, logout } = useAuth();
```

**2. API Calls - No Changes**

```typescript
// Existing code continues to work
const { data } = useQuery({
  queryKey: ['tickets'],
  queryFn: () => api.get('/api/tickets'),
});
```

**3. RequireAuth - No Changes**

```typescript
// Existing protection continues to work
<RequireAuth>
  <Dashboard />
</RequireAuth>
```

The only difference: **Users stay logged in much longer!**

## Edge Cases Handled

### 1. Refresh Already In Progress

**Scenario:** 5 API calls fail with 401 at the same time

**Handling:**
- First request starts refresh
- Other 4 wait for the same promise
- All 5 retry after refresh completes
- **Result:** Only 1 refresh call

### 2. Refresh Fails

**Scenario:** Refresh token expired or revoked

**Handling:**
- Refresh returns 401
- Original error rejected
- RequireAuth's next `/auth/me` fails
- User redirected to login
- **Result:** Graceful logout

### 3. Authorization Error (Not Authentication)

**Scenario:** Token is valid but user lacks permission

**Handling:**
- Request fails with 401
- Refresh succeeds (token refreshed)
- Retry still fails with 401 (permission issue)
- `_retry` flag prevents infinite loop
- Error returned to caller
- **Result:** Proper authorization error handling

### 4. Network Error During Refresh

**Scenario:** `/auth/refresh` times out or network fails

**Handling:**
- Refresh promise rejects
- `refreshPromise` set back to null
- Original error rejected
- Next request can try again
- **Result:** Retry on next user action

### 5. Concurrent Refresh and New Requests

**Scenario:** Refresh in progress, new request comes in

**Handling:**
- New request gets 401 (old token still active)
- Waits for existing `refreshPromise`
- Retries with new token
- **Result:** All requests succeed

## Performance Considerations

### Request Overhead

**Without Interceptor:**
- 1 request → 401 → redirect to login

**With Interceptor (successful refresh):**
- Original request → 401
- Refresh request → 200
- Retry request → 200
- **Total:** 3 requests instead of 1

**With Interceptor (multiple concurrent 401s):**
- 5 requests → 401
- 1 refresh request → 200
- 5 retry requests → 200
- **Total:** 11 requests instead of 10

**Mitigation:** Happens only once per hour (when token expires), negligible overhead.

### Memory

- Single promise reference: ~negligible
- Request retry tracking: `_retry` flag per request
- **Total:** Minimal memory footprint

### Latency

- Refresh request: ~100-200ms
- User never waits for refresh (happens transparently)
- **Perceived latency:** None (requests complete normally)

## Security Considerations

### ✅ Secure Practices

1. **Credentials Always Included**
   ```typescript
   withCredentials: true
   ```
   Ensures cookies are sent with every request

2. **HttpOnly Cookies**
   - Access token not accessible to JavaScript
   - Refresh token not accessible to JavaScript
   - XSS protection maintained

3. **No Token Exposure**
   - Interceptor never reads or stores tokens
   - Tokens remain in httpOnly cookies
   - No localStorage/sessionStorage usage

4. **Graceful Logout on Failure**
   - Failed refresh triggers normal logout flow
   - No orphaned sessions

### 🚫 What This Doesn't Protect Against

1. **CSRF** - Server must handle (SameSite cookies help)
2. **XSS** - HttpOnly cookies help, but app-level XSS still dangerous
3. **Token Theft** - If attacker steals cookies, they have access
4. **Man-in-the-Middle** - HTTPS required (enforced by secure flag)

## Debugging

### Enable Detailed Logging

Add this for debugging:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    console.log('[Interceptor] Received error:', {
      status: error.response?.status,
      url: originalRequest?.url,
      retry: originalRequest?._retry,
    });

    if (error.response?.status !== 401) {
      console.log('[Interceptor] Not a 401, passing through');
      return Promise.reject(error);
    }

    const url = originalRequest?.url || "";
    const isAuthEndpoint = 
      url.includes("/auth/login") || 
      url.includes("/auth/register") || 
      url.includes("/auth/refresh");

    if (isAuthEndpoint) {
      console.log('[Interceptor] Auth endpoint, not refreshing');
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      console.log('[Interceptor] Already retried, giving up');
      return Promise.reject(error);
    }

    console.log('[Interceptor] Attempting token refresh');
    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        console.log('[Interceptor] Starting new refresh');
        refreshPromise = api
          .post("/auth/refresh")
          .then(() => {
            console.log('[Interceptor] Refresh succeeded');
            refreshPromise = null;
          })
          .catch((refreshError) => {
            console.log('[Interceptor] Refresh failed', refreshError);
            refreshPromise = null;
            throw refreshError;
          });
      } else {
        console.log('[Interceptor] Waiting for in-flight refresh');
      }

      await refreshPromise;
      console.log('[Interceptor] Retrying original request');
      return api(originalRequest);
    } catch (refreshError) {
      console.log('[Interceptor] Refresh failed, rejecting');
      return Promise.reject(error);
    }
  }
);
```

### Common Issues

**Issue:** Interceptor not firing

**Check:**
1. Is `withCredentials: true` set on axios instance?
2. Are cookies being sent? (Check Network tab)
3. Is backend setting cookies with correct domain/path?

**Issue:** Infinite refresh loop

**Check:**
1. Is `/auth/refresh` excluded from interception?
2. Is `_retry` flag being set correctly?
3. Check backend - is refresh endpoint working?

**Issue:** Refresh succeeds but retry still fails

**Likely:** Authorization issue, not authentication
- User authenticated but lacks permission
- Original request requires different role/scope
- This is expected behavior - let error bubble up

## TypeScript Types

### Extended Request Config

```typescript
import { InternalAxiosRequestConfig } from "axios";

// Extend config to track retry state
type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};
```

### Full Interceptor Types

```typescript
import axios, { 
  AxiosError, 
  AxiosResponse, 
  InternalAxiosRequestConfig 
} from "axios";

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Implementation
  }
);
```

## Migration Notes

### From Old System

**Before:** Single access token (1 hour), hard logout at expiry

**After:** Access token (1 hour) + refresh token (30 days), seamless refresh

**Breaking Changes:** None! All existing code works as-is.

**New Behavior:**
- Users stay logged in 30x longer
- No interruption at 1-hour mark
- Better user experience

### Testing Checklist

After deploying:

- [ ] User can log in
- [ ] User can make API requests
- [ ] After 1 hour (or manual token expiry), requests still work
- [ ] Multiple simultaneous requests after expiry all succeed
- [ ] Logout invalidates session completely
- [ ] After logout, refresh attempts fail correctly
- [ ] User is redirected to login when refresh fails

## Monitoring

### Metrics to Track

1. **Refresh Success Rate**
   - Track `/auth/refresh` success vs failure
   - High failure rate indicates issues

2. **Refresh Frequency**
   - Should roughly align with token expiry (1 hour)
   - Too frequent might indicate clock skew

3. **Concurrent Refresh Efficiency**
   - Monitor if shared promise is working
   - Should see 1 refresh for N concurrent 401s

4. **User Session Duration**
   - Should increase from ~1 hour to ~30 days
   - For active users

### Error Monitoring

Watch for:
- High rate of 401s on `/auth/refresh`
- Infinite retry loops (shouldn't happen)
- Users being logged out unexpectedly

## Future Enhancements

Possible improvements:

1. **Proactive Refresh**
   - Refresh token before it expires
   - Check expiry from JWT payload
   - Refresh at 50 minutes instead of waiting for 401

2. **User Notification**
   - Toast message on successful background refresh
   - "Session extended" notification

3. **Retry with Exponential Backoff**
   - If refresh fails due to network, retry
   - Exponential backoff for subsequent attempts

4. **Session Extension Analytics**
   - Track how often sessions are extended
   - Measure impact on user engagement

## Conclusion

The refresh token interceptor provides:

- ✅ **Seamless UX** - Users never see token expiration
- ✅ **Transparent** - No code changes needed in components
- ✅ **Efficient** - Single refresh for concurrent requests
- ✅ **Secure** - Maintains all security guarantees
- ✅ **Resilient** - Graceful fallback on failures

**Users stay logged in 30x longer with zero friction! 🚀**
