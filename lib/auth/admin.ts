// Server-only module: dummy-account admin auth for the MVP, per the assignment
// brief ("simple login, dummy accounts acceptable"). Not a real auth system.
//
// Uses Web Crypto (globalThis.crypto.subtle) rather than node:crypto because
// this module is loaded from middleware.ts, which runs in the Edge Runtime —
// node:crypto is not available there, but Web Crypto is supported in both
// the Edge Runtime and Node.js (Node 20+), so one implementation covers both.

// These fallbacks are safe only for local demo use. Set ADMIN_PASSWORD and
// ADMIN_SESSION_SECRET via `.env` for anything beyond a local demo.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-me"

export const ADMIN_SESSION_COOKIE = "ceyloncart_admin_session"

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

const encoder = new TextEncoder()

let keyPromise: Promise<CryptoKey> | undefined

function getKey(): Promise<CryptoKey> {
  keyPromise ??= crypto.subtle.importKey(
    "raw",
    encoder.encode(ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
  return keyPromise
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) return null
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

export async function createAdminSessionToken(): Promise<string> {
  const timestamp = Date.now().toString()
  const key = await getKey()
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp))
  return `${timestamp}.${toHex(signature)}`
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false

  const separatorIndex = token.indexOf(".")
  if (separatorIndex === -1) return false

  const timestamp = token.slice(0, separatorIndex)
  const signatureHex = token.slice(separatorIndex + 1)
  if (!timestamp || !signatureHex) return false

  const parsedTimestamp = Number(timestamp)
  if (!Number.isFinite(parsedTimestamp)) return false
  if (Date.now() - parsedTimestamp > TWENTY_FOUR_HOURS_MS) return false

  const signatureBytes = hexToBytes(signatureHex)
  if (!signatureBytes) return false

  const key = await getKey()
  return crypto.subtle.verify("HMAC", key, signatureBytes.buffer as ArrayBuffer, encoder.encode(timestamp))
}

export function checkAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}
