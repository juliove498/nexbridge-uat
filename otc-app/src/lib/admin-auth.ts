/**
 * Client-side admin authentication helpers for the Vite + React frontend.
 *
 * All requests use `credentials: 'include'` so the browser automatically attaches
 * the HttpOnly `admin_token` cookie. The client never touches the token directly.
 *
 * No tokens are stored in localStorage or sessionStorage.
 */

const BASE = '/api/admin'

export interface AdminUser {
  email: string
  role: string
  name: string | null
  sessionId: number
}

/**
 * Authenticate with email + password.
 * On success, the server sets the HttpOnly session cookie automatically.
 * Throws with a descriptive message on failure (including 429 rate-limit errors).
 */
export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw Object.assign(new Error(body.error ?? `Login failed (${res.status})`), {
      status: res.status,
      retryAfterSeconds: body.retryAfterSeconds,
    })
  }
  return body as AdminUser
}

/**
 * Verify the current session. Returns user data if the session cookie is valid,
 * or null if the session is missing, expired, or revoked.
 * Safe to call on every page load for auth-gating.
 */
export async function verifySession(): Promise<AdminUser | null> {
  try {
    const res = await fetch(`${BASE}/me`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!res.ok) return null
    return res.json() as Promise<AdminUser>
  } catch {
    return null
  }
}

/**
 * Revoke the current session on the server and clear the cookie,
 * then redirect to the login page.
 */
export async function logout(): Promise<void> {
  await fetch(`${BASE}/logout`, {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {})
  window.location.href = '/admin/login'
}

/**
 * Authenticated fetch wrapper. Automatically includes credentials and
 * sets Content-Type to application/json.
 * Callers can override any header or option as needed.
 */
export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}
