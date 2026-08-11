# Refresh Token Implementation - Quick Summary

## What Changed

### Before
- Single `accessToken` cookie (1 hour lifetime)
- No token refresh mechanism
- Users logged out after 1 hour
- No token revocation capability

### After
- `accessToken` cookie (1 hour) + `refreshToken` cookie (30 days)
- Automatic token refresh via `/api/auth/refresh`
- Users stay logged in for 30 days (with active use)
- Tokens can be revoked at logout
- **Critical security improvement:** Refresh token only sent to `/api/auth/*` endpoints

## New API Endpoint

### POST /api/auth/refresh

**Purpose:** Exchange an expired access token for new tokens

**Authentication:** No middleware required (works with expired access token)

**Request:** No body needed (reads `refreshToken` from cookie)

**Success Response (200):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "AGENT",
  "organizationId": "org-id",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Sets Cookies:**
- New `accessToken` (1 hour)
- New `refreshToken` (30 days)

**Error Response (401):**
```json
{
  "message": "Invalid or expired refresh token"
}
```

**Clears Cookies:** Both `accessToken` and `refreshToken`

## Updated Endpoints

### POST /api/auth/login

**New Behavior:** Now sets TWO cookies instead of one

**Cookies Set:**
1. `accessToken` (path="/", 1 hour)
2. `refreshToken` (path="/api/auth", 30 days)

**Response:** Unchanged - still returns `{ user: {...} }`

---

### POST /api/auth/logout

**New Behavior:** Revokes refresh token in database before clearing cookies

**Process:**
1. Find refresh token in database
2. Set `revokedAt` timestamp (prevents replay)
3. Clear both cookies
4. Return success message

## Database Changes

### New Table: RefreshToken

```sql
CREATE TABLE "RefreshToken" (
  id         VARCHAR PRIMARY KEY,
  tokenHash  VARCHAR UNIQUE NOT NULL,  -- SHA-256 hash
  userId     VARCHAR NOT NULL,
  expiresAt  TIMESTAMP NOT NULL,       -- 30 days from creation
  revokedAt  TIMESTAMP,                -- NULL = active
  createdAt  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON "RefreshToken" (userId);
```

### User Table Update

Added relation: `refreshTokens RefreshToken[]`

## Security Features

### 1. Token Rotation
- Every refresh generates NEW tokens
- Old refresh token immediately revoked
- Prevents token reuse attacks

### 2. Hash Storage
- Only SHA-256 hashes stored in database
- Raw tokens never persisted
- Database breach doesn't expose tokens

### 3. Path Restriction
- Refresh token cookie: `path: "/api/auth"`
- **Not sent to non-auth endpoints**
- Reduces exposure in XSS scenarios

### 4. Revocation
- Logout revokes token in database
- Stolen tokens unusable after logout
- Can revoke all user tokens if needed

### 5. Expiry Checks
- Access token: JWT expiry (1 hour)
- Refresh token: Database check (30 days)
- Both must be valid for refresh to succeed

## Frontend Integration

### Automatic Refresh on 401

```typescript
// Axios interceptor
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      try {
        await axios.post('/api/auth/refresh', {}, {
          withCredentials: true
        });
        return axios(error.config);
      } catch {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### Important: Always Send Credentials

```typescript
// All requests must include credentials
fetch('/api/endpoint', {
  credentials: 'include', // Required for cookies!
});
```

## Testing

### Test Refresh Flow

```bash
# 1. Login
curl -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 2. Refresh tokens
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/api/auth/refresh

# 3. Use refreshed access token
curl -b cookies.txt http://localhost:3000/api/tickets
```

### Test Token Rotation

```bash
# Try to reuse old refresh token (should fail)
curl -b old_cookies.txt -X POST http://localhost:3000/api/auth/refresh
# Expected: 401 Unauthorized
```

### Test Logout Revocation

```bash
# Login, then logout
curl -c cookies.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

curl -b cookies.txt -X POST http://localhost:3000/api/auth/logout

# Try to refresh with revoked token (should fail)
curl -b cookies.txt -X POST http://localhost:3000/api/auth/refresh
# Expected: 401 Unauthorized
```

## Files Created/Modified

### Created
- ✅ `src/lib/refreshToken.ts` - Token generation, hashing, storage, validation
- ✅ `prisma/migrations/*` - RefreshToken table and User relation
- ✅ `REFRESH_TOKEN_IMPLEMENTATION.md` - Comprehensive documentation
- ✅ `REFRESH_TOKEN_SUMMARY.md` - This file

### Modified
- ✅ `prisma/schema.prisma` - Added RefreshToken model and User relation
- ✅ `src/lib/cookies.ts` - Added refreshTokenCookie config
- ✅ `src/modules/auth/controllers/auth.controller.ts` - Updated login, logout, added refresh
- ✅ `src/modules/auth/routes/auth.routes.ts` - Added POST /refresh route

## Migration Checklist

### Backend ✅
- [x] Add RefreshToken model to Prisma schema
- [x] Run database migration
- [x] Create refresh token utilities
- [x] Update cookie configuration
- [x] Modify login to set both tokens
- [x] Modify logout to revoke tokens
- [x] Create refresh endpoint
- [x] Add refresh route
- [x] Build and verify (no TypeScript errors)

### Frontend (TODO)
- [ ] Update API client to include `credentials: 'include'`
- [ ] Add 401 interceptor for automatic token refresh
- [ ] Handle refresh failures (redirect to login)
- [ ] Test login/logout flow
- [ ] Test automatic refresh on token expiry

## Maintenance

### Cleanup Expired Tokens (Cron Job)

```typescript
import { cleanupExpiredRefreshTokens } from './lib/refreshToken';

// Run daily at 3 AM
await cleanupExpiredRefreshTokens();
```

### Force User Logout (Security)

```typescript
import { revokeAllUserRefreshTokens } from './lib/refreshToken';

// Revoke all sessions for a user
await revokeAllUserRefreshTokens(userId);
```

## Benefits

1. **Better UX** - Users stay logged in longer without interruption
2. **Enhanced Security** - Token rotation prevents replay attacks
3. **Revocation** - Logout actually invalidates credentials
4. **Reduced Attack Surface** - Refresh token only sent to auth endpoints
5. **Auditable** - All tokens tracked in database with timestamps
6. **Scalable** - Works across multiple devices/sessions

## Breaking Changes

**None for frontend** - The existing login flow continues to work. Just add refresh logic for a better experience.

## Support

For questions or issues:
1. Check `REFRESH_TOKEN_IMPLEMENTATION.md` for detailed documentation
2. Review the "Troubleshooting" section for common problems
3. Test with curl commands to verify backend behavior
