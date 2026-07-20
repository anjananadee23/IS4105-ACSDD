// Server-only module: dummy-account customer auth for the MVP, per the
// assignment brief's optional "simple user login/registration (dummy accounts
// acceptable)" extension. Not a real auth system — any email and non-empty
// password succeeds. No user table, no password hashing, no verification.
//
// Uses Web Crypto (globalThis.crypto.subtle) rather than node:crypto for
// consistency with lib/auth/admin.ts, even though this session is never
// checked from middleware.ts (there is no gated customer route in this MVP).

// Reuse the same session secret as the admin session for simplicity — this is
// a dummy demo system, not real authentication, so a single secret is fine.
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-me"

export const CUSTOMER_SESSION_COOKIE = "ceyloncart_customer_session"

export type CustomerSessionPayload = {
  email: string
  name: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

function base64UrlEncode(value: string): string {
  const base64 =
    typeof globalThis.btoa === "function"
      ? globalThis.btoa(unescape(encodeURIComponent(value)))
      : Buffer.from(value, "utf-8").toString("base64")
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(value: string): string | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=")
    const decoded =
      typeof globalThis.atob === "function"
        ? decodeURIComponent(escape(globalThis.atob(padded)))
        : Buffer.from(padded, "base64").toString("utf-8")
    return decoded
  } catch {
    return null
  }
}

export async function createCustomerSessionToken(payload: CustomerSessionPayload): Promise<string> {
  const base64Payload = base64UrlEncode(JSON.stringify(payload))
  const key = await getKey()
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(base64Payload))
  return `${base64Payload}.${toHex(signature)}`
}

export async function verifyCustomerSessionToken(
  token: string | undefined,
): Promise<CustomerSessionPayload | null> {
  if (!token) return null

  const separatorIndex = token.indexOf(".")
  if (separatorIndex === -1) return null

  const base64Payload = token.slice(0, separatorIndex)
  const signatureHex = token.slice(separatorIndex + 1)
  if (!base64Payload || !signatureHex) return null

  const signatureBytes = hexToBytes(signatureHex)
  if (!signatureBytes) return null

  const key = await getKey()
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes.buffer as ArrayBuffer,
    encoder.encode(base64Payload),
  )
  if (!valid) return null

  const json = base64UrlDecode(base64Payload)
  if (!json) return null

  try {
    const parsed = JSON.parse(json)
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as Record<string, unknown>).email !== "string" ||
      typeof (parsed as Record<string, unknown>).name !== "string"
    ) {
      return null
    }
    return parsed as CustomerSessionPayload
  } catch {
    return null
  }
}

export function isValidDummyLogin(email: string, password: string): boolean {
  if (typeof email !== "string" || typeof password !== "string") return false
  if (email.trim().length === 0 || password.trim().length === 0) return false
  return EMAIL_PATTERN.test(email.trim())
}
