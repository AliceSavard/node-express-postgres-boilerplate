# JWT Token Revocation

## Overview

This boilerplate implements token versioning for JWT revocation. Each user has a `token_version` field that is embedded in JWTs and verified on every request. Incrementing the version invalidates all existing tokens for that user.

## How It Works

1. User has `token_version` integer in database (defaults to 0)
2. Token version is included in JWT payload during login/registration
3. `isRevoked()` middleware checks JWT version against current database value
4. Version mismatch results in 401 Unauthorized
5. Incrementing version invalidates all user sessions instantly

## Database Schema

```sql
"token_version" integer NOT NULL DEFAULT 0
```

## JWT Payload

```typescript
{
  userId: number,
  tier: number,
  tokenVersion: number,
  exp: number
}
```

## Automatic Revocation

Tokens are automatically revoked when:
- User changes password
- User logs out via `POST /v1/auth/logout`

## Manual Revocation

```typescript
import { revokeAllUserTokens } from './services/tokenRevocation.service';

await revokeAllUserTokens(userId);
```

Use cases:
- Account compromise detected
- Permission/tier changes requiring re-authentication
- Security incident response
- Account deletion

## API Endpoints

**Login**
```bash
POST /v1/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Logout**
```bash
POST /v1/auth/logout
Authorization: Bearer <access_token>
```

**Update Password** (auto-revokes all sessions)
```bash
PATCH /v1/users/:userId
{
  "password": "NewSecurePass123!"
}
```

## Performance

The `isRevoked` function runs on every authenticated request:

```sql
SELECT token_version FROM "user" WHERE id = $1
```

This is a single indexed lookup returning one integer. Performance is acceptable for most MVPs. For high-scale applications, add Redis caching of `token_version` values.

## Security Coverage

**Protects against:**
- Stolen tokens after password change
- Session persistence after logout
- Remote session termination on compromise
- Privilege escalation requiring re-authentication

**Does not protect against:**
- Token theft before revocation (use short expiration times)
- XSS attacks (use httpOnly cookies)
- MITM attacks (enforce HTTPS)

## Production Recommendations

1. Set `JWT_ACCESS_EXPIRATION_MINUTES=15` for short-lived tokens
2. Keep `JWT_REFRESH_EXPIRATION_DAYS=30` for refresh tokens
3. Enforce HTTPS in production
4. Store tokens in httpOnly cookies instead of localStorage
5. Monitor and alert on failed authentication attempts
