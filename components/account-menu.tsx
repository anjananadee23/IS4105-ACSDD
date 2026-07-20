"use client"

import * as React from "react"
import Link from "next/link"

type SessionState = {
  email: string | null
  name: string | null
  role?: string | null
}

export function AccountMenu() {
  const [session, setSession] = React.useState<SessionState | null>(null)

  React.useEffect(() => {
    let cancelled = false

    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((data: SessionState) => {
        if (!cancelled) setSession(data)
      })
      .catch(() => {
        if (!cancelled) setSession({ email: null, name: null, role: null })
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleLogout() {
    const logoutUrl = session?.role === "admin" ? "/api/admin/logout" : "/api/auth/logout"
    await fetch(logoutUrl, { method: "POST" })
    window.location.reload()
  }

  if (!session || !session.email) {
    return (
      <Link href="/login" className="text-sm font-medium hover:underline">
        Sign in
      </Link>
    )
  }

  const isAdmin = session.role === "admin"

  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-muted-foreground">Hi, {session.name}</span>
      {isAdmin && (
        <Link href="/admin/orders" className="font-medium underline-offset-2 hover:underline">
          Dashboard
        </Link>
      )}
      <button
        type="button"
        onClick={handleLogout}
        className="font-medium underline-offset-2 hover:underline cursor-pointer"
      >
        Log out
      </button>
    </div>
  )
}
