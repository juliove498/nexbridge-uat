/**
 * Password hashing and verification using PBKDF2-SHA256 via Web Crypto API.
 * Works in Node.js 18+, Edge, and any Web Crypto-compatible environment.
 *
 * Stored format: "<saltHex>:<derivedKeyHex>"
 */

const ITERATIONS = 100_000
const KEY_LENGTH_BYTES = 64  // 512 bits
const HASH_ALG = 'SHA-256'

function encode(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function fromHex(hex: string): Uint8Array {
  const pairs = hex.match(/.{2}/g)
  if (!pairs) throw new Error('Invalid hex string')
  return new Uint8Array(pairs.map(b => parseInt(b, 16)))
}

async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: HASH_ALG, salt, iterations: ITERATIONS },
    keyMaterial,
    KEY_LENGTH_BYTES * 8
  )
}

/**
 * Hash a plaintext password. Returns "saltHex:derivedKeyHex".
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const derived = await deriveKey(password, salt)
  return `${toHex(salt.buffer as ArrayBuffer)}:${toHex(derived)}`
}

/**
 * Verify a plaintext password against a stored "saltHex:derivedKeyHex" hash.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const colonIdx = stored.indexOf(':')
  if (colonIdx === -1) return false

  const saltHex = stored.slice(0, colonIdx)
  const storedHashHex = stored.slice(colonIdx + 1)

  let salt: Uint8Array
  try {
    salt = fromHex(saltHex)
  } catch {
    return false
  }

  const derived = await deriveKey(password, salt)
  const derivedHex = toHex(derived)

  // Constant-time string comparison
  if (derivedHex.length !== storedHashHex.length) return false
  let diff = 0
  for (let i = 0; i < derivedHex.length; i++) {
    diff |= derivedHex.charCodeAt(i) ^ storedHashHex.charCodeAt(i)
  }
  return diff === 0
}
