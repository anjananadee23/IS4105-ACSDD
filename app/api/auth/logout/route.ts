import { NextResponse } from "next/server"

import { CUSTOMER_SESSION_COOKIE } from "@/lib/auth/customer"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(CUSTOMER_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })

  return response
}
