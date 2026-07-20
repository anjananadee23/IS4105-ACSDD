"use client"

import Link from "next/link"
import { RiShoppingBag3Line } from "@remixicon/react"

import { AccountMenu } from "@/components/account-menu"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart/cart-context"

export function SiteHeader() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-heading text-lg font-semibold">
          CeylonCart
        </Link>
        <div className="flex items-center gap-4">
          <AccountMenu />
          <Link
            href="/cart"
            aria-label={`View cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <RiShoppingBag3Line className="size-5" aria-hidden="true" />
            {itemCount > 0 ? (
              <Badge className="absolute -top-2 -right-2 h-5 min-w-5 justify-center px-1 text-xs">
                {itemCount}
              </Badge>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  )
}
