import { NextResponse } from "next/server"

import { ADMIN_SESSION_COOKIE, checkAdminPassword, createAdminSessionToken } from "@/lib/auth/admin"

const TWENTY_FOUR_HOURS_SECONDS = 24 * 60 * 60

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  if (typeof body !== "object" || body === null || typeof (body as Record<string, unknown>).password !== "string") {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  const { password } = body as { password: string }

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: TWENTY_FOUR_HOURS_SECONDS,
    path: "/",
  })

  return response
}
