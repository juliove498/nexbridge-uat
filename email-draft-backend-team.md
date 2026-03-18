Subject: nexbridge.finance Frontend Integration — API Access & Security Notes

Hi team,

We're building a new, modern frontend at nexbridge.finance to gradually replace the current nexbridge.io/otc UI. To move forward, we need a few things configured on the backend side. I've also flagged some security observations from our review.

---

## What We Need

### 1. CORS Configuration on api.nexbridge.io
Currently the API returns no `Access-Control-Allow-Origin` headers at all (I understand requests are proxied server-side via Next.js). For the new frontend, we need one of:

- **Option A (preferred):** Add CORS support to the API Gateway with `https://nexbridge.finance` as an allowed origin. This lets us call the API directly from the browser.
- **Option B:** We build our own server-side proxy on nexbridge.finance (adds infrastructure complexity).

### 2. Cognito Configuration Update
Add `https://nexbridge.finance` (and `http://localhost:3000` for dev) as allowed callback/logout URLs in the Cognito User Pool App Client settings (`us-east-1_ZEiX52RK1` / client `oevrijkan154prgpfqimck9vm`).

### 3. API Documentation
We've mapped the following endpoints from the JS bundles. Can you confirm these are complete and share any additional ones (especially POST/PUT for OTC trade submission)?

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/v1/otc/users/me` | Current user profile |
| GET | `/v1/otc/addresses` | User addresses |
| GET | `/v1/otc/requests` | List OTC requests |
| GET | `/v1/otc/requests/{id}` | Request details |
| GET | `/v1/otc/requests/{id}/pdf` | Download PDF |
| GET | `/v1/otc/settings` | Platform settings |
| POST | `/v1/otc/users/{id}/createKycUrl` | Generate KYC URL |
| ??? | ??? | **Create/submit OTC order?** |
| ??? | ??? | **Update user profile?** |
| ??? | ??? | **Address management (POST/PUT/DELETE)?** |

### 4. KYC Flow Details
The `createKycUrl` endpoint generates a URL — what provider is this (Sumsub, Onfido, etc.)? We'll need to understand the flow to embed it in the new UI.

---

## Security Observations

While reviewing the current nexbridge.io frontend, we flagged a few items worth checking:

### Cognito Credentials in Client Bundles
The User Pool ID and App Client ID are exposed in the JS bundle at `/_next/static/chunks/app/[lang]/(landing-page)/layout-9ae1505fbd2d748b.js`. This is standard for Cognito SPAs, but please verify:
- **Self-signup policy**: Is self-registration open, or does it require admin approval/invitation? If open, anyone could create accounts.
- **Password policy**: Confirm complexity requirements are enforced at the pool level, not just client-side.
- **MFA enforcement**: TOTP is supported — is it required or optional?

### Inconsistent HTTP Method Handling
- `HEAD /v1/otc/settings` returns `404`
- `GET /v1/otc/settings` returns `401` (correct)
- HEAD should mirror GET's status code. This suggests the API Gateway route configuration doesn't handle all HTTP methods uniformly. Minor, but worth fixing for spec compliance.

### No Rate Limiting Headers
API responses don't include rate-limiting headers (`X-RateLimit-*`). If there's no rate limiting on auth endpoints, the Cognito login could be targeted for credential stuffing. Cognito has built-in throttling, but an API-level rate limit adds defense in depth.

### S3 Bucket
`nexbridge-website-assets.s3.us-east-2.amazonaws.com` properly returns 403 — no issues there.

### Overall
API auth enforcement is solid — all endpoints correctly return 401 without a valid Bearer token. No data leaks found on unauthenticated requests.

---

## Proposed Timeline

1. **You configure**: CORS + Cognito callback URLs (should be quick)
2. **We build**: Auth forms (sign-in, sign-up, password reset) on nexbridge.finance
3. **We build**: OTC dashboard (profile, requests, trade submission)
4. **We coordinate**: Testing on staging before cutover

Let me know if you have questions or want to jump on a call to align.

Best,
Xevi
