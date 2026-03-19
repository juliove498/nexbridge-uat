/**
 * PBKDF2-SHA256 password hashing via Web Crypto API.
 * Works in Node 18+, Edge, and any Web Crypto environment.
 *
 * Stored format: "<16-byte saltHex>:<64-byte derivedKeyHex>"
 */

const ITERATIONS = 100_000
const KEY_BYTES = 64

function enc(s: string) { return new TextEncoder().encode(s) }
function toHex(b: ArrayBuffer) {
  return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('')
}
function fromHex(h: string): Uint8Array {
  const pairs = h.match(/.{2}/g)
  if (!pairs) throw new Error('Invalid hex')
  return new Uint8Array(pairs.map(b => parseInt(b, 16)))
}

async function derive(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey('raw', enc(password), 'PBKDF2', false, ['deriveBits'])
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations: ITERATIONS },
    key,
    KEY_BYTES * 8,
  )
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const derived = await derive(password, salt)
  return `${toHex(salt.buffer as ArrayBuffer)}:${toHex(derived)}`
}

/** Constant-time comparison to prevent timing oracle attacks. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const colon = stored.indexOf(':')
  if (colon === -1) return false
  let salt: Uint8Array
  try { salt = fromHex(stored.slice(0, colon)) } catch { return false }
  const derived = toHex(await derive(password, salt))
  const expected = stored.slice(colon + 1)
  if (derived.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < derived.length; i++) diff |= derived.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}
