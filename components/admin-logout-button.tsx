"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export function AdminLogoutButton() {
  const router = useRouter()
  const [submitting, setSubmitting] = React.useState(false)

  async function handleLogout() {
    setSubmitting(true)
    try {
      await fetch("/api/admin/logout", { method: "POST" })
    } finally {
      router.push("/admin/login")
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} disabled={submitting}>
      {submitting ? "Logging out..." : "Log out"}
    </Button>
  )
}
