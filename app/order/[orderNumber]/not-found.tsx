import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function OrderNotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
      <h1 className="font-heading text-xl font-semibold">Order not found</h1>
      <p className="text-sm text-muted-foreground">
        We couldn&apos;t find an order with that number. Check the link or start a new order.
      </p>
      <Button render={<Link href="/">Continue shopping</Link>} />
    </div>
  )
}
