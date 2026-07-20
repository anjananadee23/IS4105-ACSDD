import { NextResponse } from "next/server"

import { CUSTOMER_SESSION_COOKIE, verifyCustomerSessionToken } from "@/lib/auth/customer"

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? ""
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CUSTOMER_SESSION_COOKIE}=`))
  const token = match ? decodeURIComponent(match.slice(CUSTOMER_SESSION_COOKIE.length + 1)) : undefined

  const session = await verifyCustomerSessionToken(token)

  if (!session) {
    return NextResponse.json({ email: null, name: null })
  }

  return NextResponse.json({ email: session.email, name: session.name })
}
