import { NextResponse } from "next/server"

import { CUSTOMER_SESSION_COOKIE, verifyCustomerSessionToken } from "@/lib/auth/customer"
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth/admin"

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? ""
  
  const getCookie = (name: string) => {
    const match = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
    return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined
  }

  // 1. Check Admin Session first
  const adminToken = getCookie(ADMIN_SESSION_COOKIE)
  const isAdmin = await verifyAdminSessionToken(adminToken)
  if (isAdmin) {
    return NextResponse.json({ email: "admin@ceyloncart.com", name: "Admin", role: "admin" })
  }

  // 2. Check Customer Session
  const customerToken = getCookie(CUSTOMER_SESSION_COOKIE)
  const customerSession = await verifyCustomerSessionToken(customerToken)
  if (customerSession) {
    return NextResponse.json({ email: customerSession.email, name: customerSession.name, role: "customer" })
  }

  return NextResponse.json({ email: null, name: null, role: null })
}
