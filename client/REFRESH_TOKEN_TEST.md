# Frontend Refresh Token Testing Guide

## Quick Test in Browser Console

### 1. Verify Interceptor is Loaded

Open browser console and run:

```javascript
// Check if axios instance exists
console.log('API client loaded:', !!window.api);

// Or check from React DevTools
// Should see the interceptor in the axios instance
```

### 2. Simulate Token Refresh

```javascript
// Make any authenticated API call
// If you've been logged in for over 1 hour, it will auto-refresh

// Watch the Network tab
fetch('/api/tickets', { 
  credentials: 'include' 
})
.then(r => r.json())
.then(console.log)
.catch(console.error);

// Expected in Network tab:
// 1. GET /api/tickets → 401
// 2. POST /auth/refresh → 200
// 3. GET /api/tickets → 200 (automatic retry)
```

### 3. Test Multiple Concurrent Requests

```javascript
// Fire 5 requests at once
Promise.all([
  fetch('/api/tickets', { credentials: 'include' }),
  fetch('/api/categories', { credentials: 'include' }),
  fetch('/api/priorities', { credentials: 'include' }),
  fetch('/api/users', { credentials: 'include' }),
  fetch('/api/assets', { credentials: 'include' }),
])
.then(responses => Promise.all(responses.map(r => r.json())))
.then(console.log)
.catch(console.error);

// Expected in Network tab:
// - All 5 requests → 401
// - Only 1 POST /auth/refresh → 200
// - All 5 requests retry → 200
```

## Manual Testing Scenarios

### Scenario 1: Normal Usage (Token Not Expired)

**Steps:**
1. Log in to the application
2. Navigate around the app
3. Make various API requests

**Expected:**
- All requests succeed normally
- No refresh endpoint called
- Smooth user experience

**Network Tab:**
```
GET /api/tickets → 200 OK
GET /api/categories → 200 OK
GET /api/users → 200 OK
```

---

### Scenario 2: Token Expiry (Automatic Refresh)

**Setup:**
For quick testing, temporarily modify backend JWT expiry to 30 seconds:

```typescript
// server/src/lib/jwt.ts
export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30s", // Temporarily changed from "1h"
  });
}
```

**Steps:**
1. Log in to the application
2. Wait 35 seconds (let token expire)
3. Click any button that makes an API request

**Expected:**
- Request succeeds seamlessly
- User doesn't notice anything
- Refresh happened transparently

**Network Tab:**
```
GET /api/tickets → 401 Unauthorized
POST /auth/refresh → 200 OK
GET /api/tickets → 200 OK  ← Automatic retry
```

**Console:**
- No errors visible to user
- Request resolves successfully

---

### Scenario 3: Multiple Simultaneous Expiries

**Setup:** Same as Scenario 2 (30s token expiry)

**Steps:**
1. Log in
2. Wait 35 seconds
3. Quickly navigate to a page that makes multiple API calls
   (e.g., Dashboard with tickets, categories, users)

**Expected:**
- All requests succeed
- Only 1 refresh call made
- All requests retry after refresh

**Network Tab:**
```
GET /api/tickets → 401
GET /api/categories → 401
GET /api/priorities → 401
POST /auth/refresh → 200  ← Only one!
GET /api/tickets → 200
GET /api/categories → 200
GET /api/priorities → 200
```

---

### Scenario 4: Logout and Refresh Failure

**Steps:**
1. Log in to the application
2. Open browser DevTools → Application → Cookies
3. Note the `refreshToken` cookie value
4. Click "Logout" button
5. Try to manually call refresh endpoint

**Expected:**
- Refresh fails (token revoked)
- User remains logged out
- Graceful error handling

**Test in Console:**
```javascript
fetch('/api/auth/refresh', {
  method: 'POST',
  credentials: 'include'
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(console.log)
.catch(console.error);

// Expected: 401 Unauthorized
// Message: "Invalid or expired refresh token"
```

---

### Scenario 5: Session Extension

**Setup:** Use normal 1-hour token expiry

**Steps:**
1. Log in at 9:00 AM
2. Use the app actively (make requests every 30 minutes)
3. Continue using at 10:30 AM (past original token expiry)
4. Check if still logged in

**Expected:**
- User stays logged in
- First request after 10:00 AM triggers refresh
- User never logs out
- Can continue for up to 30 days with activity

**Verification:**
Check cookies in DevTools:
- `accessToken` - Should have different value than at 9:00 AM
- `refreshToken` - Should have different value (rotated)

---

### Scenario 6: 30-Day Expiry

**Steps:**
1. Log in
2. Don't use the app for 30+ days
3. Return and try to use the app

**Expected:**
- Refresh token expired
- User redirected to login
- Must log in again

**Network Tab:**
```
GET /api/tickets → 401
POST /auth/refresh → 401  ← Refresh token expired
(RequireAuth redirects to /login)
```

---

### Scenario 7: Refresh During Active Request

**Steps:**
1. Log in with short token expiry (30s)
2. Wait 35 seconds
3. Start a slow API request (large dataset)
4. Quickly make another request

**Expected:**
- First request triggers refresh
- Second request waits for same refresh
- Both retry after refresh completes
- Both succeed

---

## Automated Testing

### React Testing Library

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { api } from '@/api/client';

const server = setupServer(
  // Mock ticket endpoint - returns 401 first time
  rest.get('/api/tickets', (req, res, ctx) => {
    const retry = req.headers.get('x-retry');
    
    if (!retry) {
      return res(ctx.status(401));
    }
    
    return res(
      ctx.status(200),
      ctx.json({ data: [], meta: {} })
    );
  }),
  
  // Mock refresh endpoint
  rest.post('/api/auth/refresh', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ id: '1', email: 'test@example.com' })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('automatically refreshes token on 401', async () => {
  // Make request that will 401
  const response = await api.get('/api/tickets');
  
  // Should have retried and succeeded
  expect(response.status).toBe(200);
  
  // Should have called refresh
  // Check mock server call history
});

test('shares refresh promise across concurrent requests', async () => {
  // Make multiple concurrent requests
  const requests = Promise.all([
    api.get('/api/tickets'),
    api.get('/api/categories'),
    api.get('/api/priorities'),
  ]);
  
  const responses = await requests;
  
  // All should succeed
  responses.forEach(r => {
    expect(r.status).toBe(200);
  });
  
  // Should have called refresh only once
  // Check mock server call history
});
```

### Cypress E2E Test

```typescript
describe('Token Refresh', () => {
  beforeEach(() => {
    cy.login(); // Custom command to log in
  });

  it('should refresh token automatically on expiry', () => {
    // Intercept API calls
    cy.intercept('GET', '/api/tickets').as('getTickets');
    cy.intercept('POST', '/api/auth/refresh').as('refresh');
    
    // Navigate to tickets page (assuming token expired)
    cy.visit('/tickets');
    
    // Should see refresh call
    cy.wait('@refresh').its('response.statusCode').should('eq', 200);
    
    // Should see successful tickets call after refresh
    cy.wait('@getTickets').its('response.statusCode').should('eq', 200);
    
    // Verify tickets are displayed
    cy.contains('Tickets').should('be.visible');
  });

  it('should handle refresh failure gracefully', () => {
    // Mock refresh failure
    cy.intercept('POST', '/api/auth/refresh', {
      statusCode: 401,
      body: { message: 'Refresh token expired' }
    }).as('refreshFail');
    
    // Force a 401 on any request
    cy.intercept('GET', '/api/tickets', {
      statusCode: 401,
    }).as('tickets401');
    
    // Try to access tickets
    cy.visit('/tickets');
    
    // Should attempt refresh
    cy.wait('@refreshFail');
    
    // Should redirect to login
    cy.url().should('include', '/login');
  });
});
```

## Troubleshooting

### Issue: Interceptor not triggering

**Symptoms:**
- 401 errors visible in console
- User gets logged out immediately
- No refresh call in Network tab

**Debug:**
1. Check if interceptor is registered:
   ```javascript
   import { api } from '@/api/client';
   console.log('Interceptors:', api.interceptors.response.handlers);
   ```

2. Verify `withCredentials: true`:
   ```javascript
   console.log('With credentials:', api.defaults.withCredentials);
   // Should be true
   ```

3. Check if cookies are being sent:
   - Open Network tab
   - Click on any API request
   - Check "Cookies" section
   - Should see `accessToken` cookie

**Fix:** Ensure `client.ts` is imported before any API calls are made.

---

### Issue: Infinite refresh loop

**Symptoms:**
- Continuous refresh calls in Network tab
- Browser becomes unresponsive
- Console floods with errors

**Debug:**
1. Check if `/auth/refresh` is excluded:
   ```typescript
   const isAuthEndpoint = 
     url.includes("/auth/login") || 
     url.includes("/auth/register") || 
     url.includes("/auth/refresh"); // Must be here!
   ```

2. Check if `_retry` flag is working:
   ```javascript
   console.log('Retry flag:', request._retry);
   ```

**Fix:** Ensure refresh endpoint is in exclusion list.

---

### Issue: Multiple refresh calls for concurrent requests

**Symptoms:**
- 5 requests → 5 refresh calls (should be 1)
- Network tab shows multiple `/auth/refresh`

**Debug:**
```typescript
console.log('Refresh promise:', refreshPromise);
// Should be same promise for all concurrent requests
```

**Fix:** Ensure `refreshPromise` is shared globally, not recreated.

---

### Issue: Refresh succeeds but retry fails

**Symptoms:**
- Refresh returns 200
- Original request still returns 401

**Possible Causes:**
1. **Authorization issue** (not authentication)
   - User authenticated but lacks permission
   - Different error message in response
   - Expected behavior - let it fail

2. **Cookie not updated**
   - Backend not setting new cookie properly
   - Check response headers for `Set-Cookie`

3. **Race condition**
   - New token not yet valid when retry happens
   - Unlikely with proper implementation

**Debug:**
```javascript
// Check cookies before and after refresh
console.log('Before:', document.cookie);
// Make refresh call
console.log('After:', document.cookie);
// Should see different accessToken
```

---

## Performance Testing

### Measure Refresh Overhead

```javascript
// Time a request without refresh
console.time('normal-request');
await api.get('/api/tickets');
console.timeEnd('normal-request');
// Typical: 100-200ms

// Time a request with refresh
// (after token expires)
console.time('with-refresh');
await api.get('/api/tickets');
console.timeEnd('with-refresh');
// Typical: 300-500ms (includes refresh + retry)
```

### Measure Concurrent Refresh Efficiency

```javascript
// Fire 10 requests simultaneously after token expiry
console.time('10-concurrent');
await Promise.all([
  api.get('/api/tickets'),
  api.get('/api/categories'),
  api.get('/api/priorities'),
  api.get('/api/users'),
  api.get('/api/assets'),
  api.get('/api/requesters'),
  api.get('/api/slas'),
  api.get('/api/notifications'),
  api.get('/api/automation'),
  api.get('/api/comments/ticket/1'),
]);
console.timeEnd('10-concurrent');

// Check Network tab:
// Should see only 1 /auth/refresh call
```

---

## Production Monitoring

### Metrics to Track

1. **Refresh Success Rate**
   ```javascript
   // In analytics/monitoring service
   api.interceptors.response.use(
     response => {
       if (response.config.url === '/auth/refresh') {
         analytics.track('token_refresh_success');
       }
       return response;
     },
     error => {
       if (error.config?.url === '/auth/refresh') {
         analytics.track('token_refresh_failure', {
           status: error.response?.status
         });
       }
       return Promise.reject(error);
     }
   );
   ```

2. **User Session Duration**
   ```javascript
   // Track login and logout events
   const loginTime = new Date();
   analytics.track('user_login');
   
   // On logout
   const sessionDuration = Date.now() - loginTime.getTime();
   analytics.track('user_logout', {
     duration_minutes: sessionDuration / 60000
   });
   ```

3. **Refresh Frequency**
   ```javascript
   let refreshCount = 0;
   
   api.interceptors.response.use(
     response => {
       if (response.config.url === '/auth/refresh') {
         refreshCount++;
         console.log('Total refreshes:', refreshCount);
       }
       return response;
     }
   );
   ```

---

## Summary Checklist

Before considering implementation complete:

- [ ] Interceptor registered in `client.ts`
- [ ] `withCredentials: true` set on axios instance
- [ ] Auth endpoints excluded from refresh logic
- [ ] Retry flag prevents infinite loops
- [ ] Single shared promise for concurrent requests
- [ ] Manual testing scenarios passed
- [ ] Network tab shows correct flow (401 → refresh → retry)
- [ ] Cookies updated after refresh
- [ ] Logout correctly invalidates refresh token
- [ ] AuthContext remains unchanged
- [ ] No breaking changes to existing components
- [ ] Documentation reviewed
- [ ] Ready for production deployment

---

## Need Help?

1. **Check Network Tab** - See exact request/response flow
2. **Check Console** - Look for interceptor logs (if enabled)
3. **Check Cookies** - Verify tokens are being set/updated
4. **Review Documentation** - `REFRESH_TOKEN_INTERCEPTOR.md`
5. **Test Backend** - Ensure `/auth/refresh` works standalone

The interceptor should be completely transparent. If users notice anything, something's wrong!
