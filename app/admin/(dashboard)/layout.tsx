import Link from "next/link"

import { AdminLogoutButton } from "@/components/admin-logout-button"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin/orders" className="font-heading text-lg font-semibold">
              CeylonCart Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/admin/orders" className="text-muted-foreground hover:text-foreground">
                Orders
              </Link>
              <Link href="/admin/products" className="text-muted-foreground hover:text-foreground">
                Products
              </Link>
            </nav>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      {children}
    </div>
  )
}
