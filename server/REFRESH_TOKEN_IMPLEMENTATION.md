# Refresh Token Implementation - Security Summary

## Overview

Implemented a secure, revocable refresh token system with automatic token rotation to replace the previous single-token authentication approach. This significantly enhances security by:

1. **Reducing token exposure** - Access tokens are short-lived (1 hour)
2. **Enabling token revocation** - Refresh tokens can be invalidated at logout
3. **Preventing token reuse** - Automatic rotation ensures one-time use
4. **Limiting attack surface** - Refresh tokens only sent to `/api/auth` endpoints

## Architecture

### Token Flow

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ├─► Access Token (1 hour) → Cookie: path="/"
       │
       └─► Refresh Token (30 days) → Cookie: path="/api/auth"
                                    → DB: Store SHA-256 hash

┌─────────────────┐
│ Access Expired  │
└────────┬────────┘
         │
         ├─► POST /api/auth/refresh
         │
         ├─► Validate Refresh Token (check hash, expiry, revocation)
         │
         ├─► Revoke Old Refresh Token (rotation)
         │
         ├─► Issue New Access Token (1 hour)
         │
         └─► Issue New Refresh Token (30 days)

┌─────────────┐
│   Logout    │
└──────┬──────┘
       │
       ├─► Revoke Refresh Token in DB
       │
       └─► Clear Both Cookies
```

## Implementation Details

### 1. Database Schema

**New Model: RefreshToken**
```prisma
model RefreshToken {
  id        String    @id @default(cuid())
  tokenHash String    @unique         // SHA-256 hash, never store raw token
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime                   // 30 days from creation
  revokedAt DateTime?                  // NULL = active, set on revocation
  createdAt DateTime  @default(now())

  @@index([userId])
}
```

**User Relation Added:**
```prisma
model User {
  // ... existing fields
  refreshTokens RefreshToken[]
}
```

### 2. Token Generation (`lib/refreshToken.ts`)

**Token Creation:**
- Uses `crypto.randomBytes(40)` for cryptographic randomness
- Generates 80-character hexadecimal token
- Stores only SHA-256 hash in database (never raw token)
- Sets expiry to 30 days from creation

**Key Functions:**

```typescript
generateRefreshToken()        // Creates random 80-char hex token
hashRefreshToken(token)        // SHA-256 hash for storage
storeRefreshToken(userId, token) // Stores hashed token with 30-day expiry
findValidRefreshToken(token)   // Validates: hash match, not expired, not revoked
revokeRefreshToken(token)      // Sets revokedAt timestamp
```

### 3. Cookie Configuration (`lib/cookies.ts`)

**Access Token Cookie:**
```typescript
{
  httpOnly: true,              // Not accessible via JavaScript
  secure: production only,     // HTTPS only in production
  sameSite: "lax",            // CSRF protection
  maxAge: 1 hour,
  path: "/"                   // Sent to all API requests
}
```

**Refresh Token Cookie:**
```typescript
{
  httpOnly: true,              // Not accessible via JavaScript
  secure: production only,     // HTTPS only in production
  sameSite: "lax",            // CSRF protection
  maxAge: 30 days,
  path: "/api/auth"           // ⚠️ CRITICAL: Only sent to auth endpoints
}
```

**Why `path: "/api/auth"` is Critical:**
- Prevents refresh token from being sent with every API request
- Reduces exposure in case of XSS vulnerabilities
- Limits the attack surface to authentication endpoints only
- Access token alone is sufficient for regular API operations

### 4. Authentication Flow

#### Login (`POST /api/auth/login`)

```typescript
1. Validate credentials
2. Generate access token (JWT, 1 hour)
3. Generate refresh token (random, 30 days)
4. Store refresh token hash in DB
5. Set both cookies on response
6. Return user data
```

#### Refresh (`POST /api/auth/refresh`)

**No authentication middleware required** - Works with expired access token

```typescript
1. Read refreshToken from cookie
2. Hash the token
3. Look up in DB:
   - Match tokenHash
   - Check revokedAt is NULL
   - Check expiresAt > now
4. If invalid: Clear both cookies, return 401
5. If valid:
   - Revoke old refresh token (set revokedAt)
   - Generate new access token
   - Generate and store new refresh token
   - Set both new cookies
   - Return full user data (same shape as /me)
```

**Token Rotation Benefits:**
- Old refresh token becomes invalid immediately
- If attacker steals a token, it's useless after one use
- Legitimate user automatically gets new token
- Suspicious activity easier to detect (multiple concurrent refreshes)

#### Logout (`POST /api/auth/logout`)

```typescript
1. Read refreshToken from cookie
2. If present: Revoke in DB (set revokedAt)
3. Clear both cookies
4. Return success message
```

**Security Note:** Even after logout, stolen refresh tokens cannot be replayed because they're revoked in the database.

## Security Features

### 1. Token Storage Security

| Token Type | Client Storage | Server Storage | Transmission |
|------------|----------------|----------------|--------------|
| Access Token | httpOnly Cookie (all paths) | Not stored | Every API request |
| Refresh Token | httpOnly Cookie (`/api/auth` only) | SHA-256 hash only | Auth endpoints only |

### 2. Attack Mitigation

**XSS (Cross-Site Scripting):**
- ✅ `httpOnly` cookies prevent JavaScript access
- ✅ Tokens not accessible to malicious scripts

**CSRF (Cross-Site Request Forgery):**
- ✅ `sameSite: "lax"` prevents cross-site cookie sending
- ✅ Additional CSRF protection at application level

**Token Theft:**
- ✅ Short-lived access tokens (1 hour) limit exposure window
- ✅ Token rotation invalidates stolen refresh tokens after one use
- ✅ Revocation at logout prevents replay attacks

**Man-in-the-Middle:**
- ✅ `secure: true` in production forces HTTPS
- ✅ Tokens never transmitted over unencrypted connections

**Database Breach:**
- ✅ Only SHA-256 hashes stored, not raw tokens
- ✅ Attackers cannot reconstruct original tokens from hashes
- ✅ Hash comparison prevents rainbow table attacks

### 3. Revocation Capabilities

**Individual Token Revocation:**
```typescript
// Logout revokes the specific refresh token
await revokeRefreshToken(token);
```

**User-Wide Revocation:**
```typescript
// Revoke all refresh tokens for a user (e.g., password change)
await revokeAllUserRefreshTokens(userId);
```

**Automatic Expiry:**
- Access tokens: JWT expiry (1 hour, cannot be revoked early)
- Refresh tokens: Database expiry check (30 days, can be revoked anytime)

## API Endpoints

### POST /api/auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "...",
    "firstName": "...",
    "lastName": "...",
    "role": "AGENT",
    "organizationId": "..."
  }
}
```

**Cookies Set:**
- `accessToken` (1 hour, path="/")
- `refreshToken` (30 days, path="/api/auth")

---

### POST /api/auth/refresh

**No request body required** - Reads from cookie

**Success Response (200):**
```json
{
  "id": "...",
  "email": "...",
  "firstName": "...",
  "lastName": "...",
  "role": "AGENT",
  "organizationId": "...",
  "isActive": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Cookies Set:**
- New `accessToken` (1 hour, path="/")
- New `refreshToken` (30 days, path="/api/auth")

**Error Response (401):**
```json
{
  "message": "Invalid or expired refresh token"
}
```

**Cookies Cleared:**
- `accessToken`
- `refreshToken`

---

### POST /api/auth/logout

**No request body required** - Reads from cookie

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Cookies Cleared:**
- `accessToken`
- `refreshToken`

**Database Action:**
- Refresh token revoked (revokedAt set to current timestamp)

## Frontend Integration

### Handling Token Refresh

**Automatic Refresh on 401:**
```typescript
// Axios interceptor example
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt token refresh
        await axios.post('/api/auth/refresh', {}, {
          withCredentials: true // Important: Send cookies
        });
        
        // Retry original request
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

**React Query Example:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useAuth() {
  const queryClient = useQueryClient();
  
  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Refresh failed');
      return response.json();
    },
    onSuccess: (user) => {
      // Update user data
      queryClient.setQueryData(['user'], user);
    },
    onError: () => {
      // Redirect to login
      window.location.href = '/login';
    },
  });
  
  return { refresh: refreshMutation.mutate };
}
```

**Fetch API with Credentials:**
```typescript
// Always include credentials to send cookies
fetch('/api/endpoint', {
  credentials: 'include', // Send cookies with request
});
```

### Login Flow

```typescript
async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important: Receive cookies
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) throw new Error('Login failed');
  
  const { user } = await response.json();
  // Cookies are automatically stored by browser
  return user;
}
```

### Logout Flow

```typescript
async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include', // Send refresh token cookie
  });
  
  // Cookies are automatically cleared by server
  // Redirect to login page
  window.location.href = '/login';
}
```

## Maintenance Tasks

### Cleanup Expired Tokens

Run periodically (e.g., daily cron job):

```typescript
import { cleanupExpiredRefreshTokens } from './lib/refreshToken';

// Delete expired refresh tokens from database
await cleanupExpiredRefreshTokens();
```

**Recommended Schedule:**
- Run daily at low-traffic time (e.g., 3 AM)
- Prevents database bloat
- Removes tokens that are past their 30-day expiry

### Force Logout All User Sessions

For security incidents or password changes:

```typescript
import { revokeAllUserRefreshTokens } from './lib/refreshToken';

// Revoke all refresh tokens for a user
await revokeAllUserRefreshTokens(userId);

// User will need to log in again on all devices
```

## Testing Scenarios

### 1. Normal Token Refresh

```bash
# Login
curl -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'

# Wait for access token to expire (or manually delete from DB)

# Refresh tokens
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/api/auth/refresh

# Use new access token for API request
curl -b cookies.txt http://localhost:3000/api/tickets
```

### 2. Token Rotation Verification

```bash
# Refresh token once
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/api/auth/refresh

# Try to use old refresh token again (should fail)
# This simulates an attacker trying to reuse a stolen token
curl -b old_cookies.txt -X POST http://localhost:3000/api/auth/refresh
# Expected: 401 Unauthorized
```

### 3. Logout Revocation

```bash
# Login
curl -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'

# Logout
curl -b cookies.txt -X POST http://localhost:3000/api/auth/logout

# Try to refresh with revoked token (should fail)
curl -b cookies.txt -X POST http://localhost:3000/api/auth/refresh
# Expected: 401 Unauthorized
```

## Migration from Old System

### Before (Single Token)
- Login sets one `accessToken` cookie (1 hour)
- After expiry, user must log in again
- No token revocation capability
- Token sent to all endpoints

### After (Refresh Token System)
- Login sets `accessToken` (1 hour) + `refreshToken` (30 days)
- Token automatically refreshed when access token expires
- Tokens can be revoked at logout
- Refresh token only sent to auth endpoints

### Frontend Breaking Changes

**None** - The authentication flow is backward compatible:

1. Login response body unchanged (still returns `{ user: {...} }`)
2. Access token cookie name unchanged (`accessToken`)
3. API requests work the same way (access token automatically sent)
4. Frontend just needs to add refresh logic for 401 responses

**New Frontend Capability:**
- Can now call `/api/auth/refresh` when receiving 401
- Automatic session extension without user re-login
- Better user experience (no interruption for re-authentication)

## Security Best Practices

### ✅ Implemented

1. **HttpOnly cookies** - Prevents XSS token theft
2. **Secure flag in production** - HTTPS-only transmission
3. **SameSite protection** - Mitigates CSRF attacks
4. **Token rotation** - One-time use prevents replay attacks
5. **Hash storage** - Database breach doesn't expose tokens
6. **Path restriction** - Refresh token not leaked to non-auth endpoints
7. **Explicit revocation** - Logout immediately invalidates tokens
8. **Short access token lifetime** - Limits damage if token stolen
9. **Database expiry check** - Prevents use of expired tokens
10. **Cascade deletion** - User deletion removes all their tokens

### 🔄 Recommended Additions

1. **Rate limiting** on `/api/auth/refresh` endpoint
2. **Monitoring** for suspicious refresh patterns
3. **User notification** of login from new device
4. **Admin capability** to view/revoke active sessions
5. **IP address logging** for security audits

## Troubleshooting

### Issue: Refresh token not found in cookie

**Cause:** Cookie `path` restriction or not including credentials

**Solution:**
```typescript
// Ensure credentials are included
fetch('/api/auth/refresh', {
  method: 'POST',
  credentials: 'include', // This is required!
});
```

### Issue: 401 on refresh endpoint

**Possible Causes:**
1. Refresh token expired (>30 days old)
2. Refresh token revoked (user logged out)
3. Token already used (rotation)
4. Token not found in database

**Solution:** Redirect user to login page

### Issue: Access token still valid but refresh fails

**Cause:** Race condition - token was revoked/expired between checks

**Solution:** Application should handle this gracefully and prompt re-login

## Performance Considerations

### Database Queries

**Login:** 1 INSERT (refresh token)
**Refresh:** 1 SELECT + 1 UPDATE + 1 INSERT (find, revoke old, create new)
**Logout:** 1 UPDATE (revoke)

**Optimization:**
- Index on `tokenHash` (unique) for fast lookups
- Index on `userId` for user-wide operations
- Periodic cleanup prevents table bloat

### Cookie Size

- Access Token: ~200-300 bytes (JWT)
- Refresh Token: 80 bytes (hex string)
- Total overhead per request: Minimal, cookies are compressed

## Conclusion

This implementation provides enterprise-grade security for the authentication system:

- ✅ **Secure** - Multiple layers of protection against common attacks
- ✅ **Revocable** - Tokens can be invalidated at any time
- ✅ **Rotated** - One-time use prevents replay attacks
- ✅ **Scoped** - Refresh tokens only sent where needed
- ✅ **Auditable** - All tokens tracked in database
- ✅ **User-friendly** - Automatic refresh provides seamless experience

The system balances security with usability, providing strong protection while maintaining a smooth user experience.
