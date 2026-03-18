-- ============================================================
-- Migration 001: Admin authentication tables
-- Compatible with: PostgreSQL 14+ (Neon, Supabase, etc.)
-- ============================================================

-- Admin users
-- Passwords stored as "saltHex:derivedKeyHex" (PBKDF2-SHA256, 100k iterations)
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,  -- format: "<saltHex>:<derivedKeyHex>"
  role          TEXT        NOT NULL DEFAULT 'admin',
  name          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Opaque session store
-- Only the SHA-256 hash of the session token is persisted here.
-- Dual TTL: absolute (expires_at) + inactivity (last_seen_at checked in app layer).
CREATE TABLE IF NOT EXISTS admin_sessions (
  id            SERIAL      PRIMARY KEY,
  token_hash    TEXT        NOT NULL UNIQUE,        -- SHA-256 of the opaque token
  user_email    TEXT        NOT NULL,
  user_role     TEXT        NOT NULL DEFAULT 'admin',
  user_name     TEXT,
  ip            TEXT,
  user_agent    TEXT,
  ua_hash       TEXT        NOT NULL,               -- SHA-256 of User-Agent for fingerprinting
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL,               -- absolute TTL (2 hours from creation)
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(), -- used for inactivity check (15 min)
  revoked_at    TIMESTAMPTZ                         -- set on logout or forced revocation
);

-- Login audit log
-- All attempts (success + failure) are recorded. Failed attempts drive rate limiting.
-- attempted_password is stored only on failures to assist security investigations.
CREATE TABLE IF NOT EXISTS login_attempts (
  id                 SERIAL      PRIMARY KEY,
  email              TEXT        NOT NULL,
  ip                 TEXT        NOT NULL,
  success            BOOLEAN     NOT NULL DEFAULT false,
  attempted_password TEXT,                           -- nullable; only stored on failure
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================

-- Session lookup by token hash (primary auth path — must be O(1))
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash
  ON admin_sessions (token_hash);

-- Active session lookup (non-revoked, non-expired)
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active
  ON admin_sessions (user_email, revoked_at, expires_at);

-- Rate limit queries: failed attempts per email/IP within a time window
CREATE INDEX IF NOT EXISTS idx_login_attempts_email_created
  ON login_attempts (email, created_at);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_created
  ON login_attempts (ip, created_at);

-- ============================================================
-- updated_at trigger for admin_users
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON admin_users;
CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Example: create an admin user (replace values before running)
-- Use the hashPassword() function from api/lib/password.ts to
-- generate the correct "saltHex:derivedKeyHex" hash offline.
-- ============================================================
-- INSERT INTO admin_users (email, password_hash, role, name)
-- VALUES (
--   'admin@example.com',
--   '<saltHex>:<derivedKeyHex>',   -- output of hashPassword('your-secure-password')
--   'admin',
--   'Super Admin'
-- );
