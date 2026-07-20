import { NextResponse } from "next/server"

import { CUSTOMER_SESSION_COOKIE, createCustomerSessionToken, isValidDummyLogin } from "@/lib/auth/customer"

const TWENTY_FOUR_HOURS_SECONDS = 24 * 60 * 60

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  const { email, password, name } = body as Record<string, unknown>

  if (typeof email !== "string" || typeof password !== "string" || !isValidDummyLogin(email, password)) {
    return NextResponse.json({ error: "Enter a valid email and a password." }, { status: 400 })
  }

  const trimmedName = typeof name === "string" ? name.trim() : ""
  const displayName = trimmedName.length > 0 ? trimmedName : email.split("@")[0]

  const response = NextResponse.json({ ok: true, email: email.trim(), name: displayName })
  response.cookies.set(
    CUSTOMER_SESSION_COOKIE,
    await createCustomerSessionToken({ email: email.trim(), name: displayName }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: TWENTY_FOUR_HOURS_SECONDS,
      path: "/",
    },
  )

  return response
}
