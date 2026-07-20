import { NextResponse, type NextRequest } from "next/server"

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth/admin"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (!(await verifyAdminSessionToken(token))) {
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
