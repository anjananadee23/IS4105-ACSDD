"use client"

import * as React from "react"
import Link from "next/link"

type SessionState = {
  email: string | null
  name: string | null
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
        if (!cancelled) setSession({ email: null, name: null })
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.reload()
  }

  if (!session || !session.email) {
    return (
      <Link href="/login" className="text-sm font-medium hover:underline">
        Sign in
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Hi, {session.name}</span>
      <button
        type="button"
        onClick={handleLogout}
        className="font-medium underline-offset-2 hover:underline"
      >
        Log out
      </button>
    </div>
  )
}
