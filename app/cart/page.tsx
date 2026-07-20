"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart/cart-context"
import { formatCents } from "@/lib/format"

export default function CartPage() {
  const { items, removeItem, setQuantity, subtotalCents } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
        <h1 className="font-heading text-xl font-semibold">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground">
          Browse the catalogue and add a few things you like.
        </p>
        <Button render={<Link href="/">Continue shopping</Link>} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-semibold">Your cart</h1>

      <ul className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 rounded-lg border p-3">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- locally generated SVG placeholders don't need the image optimizer */}
              <img src={item.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Link href={`/products/${item.slug}`} className="truncate font-medium hover:underline">
                {item.name}
              </Link>
              <span className="text-sm text-muted-foreground">{formatCents(item.unitPriceCents)} each</span>
            </div>

            <div className="flex flex-col items-end gap-2">
              <label className="sr-only" htmlFor={`quantity-${item.productId}`}>
                Quantity for {item.name}
              </label>
              <Input
                id={`quantity-${item.productId}`}
                type="number"
                inputMode="numeric"
                min={1}
                max={item.stock}
                step={1}
                value={item.quantity}
                onChange={(event) => {
                  const value = Number.parseInt(event.target.value, 10)
                  if (!Number.isNaN(value)) {
                    setQuantity(item.productId, value)
                  }
                }}
                className="w-20"
              />
              <span className="text-sm font-medium">
                {formatCents(item.unitPriceCents * item.quantity)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.productId)}
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Separator className="my-6" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Estimated subtotal</span>
        <span className="text-lg font-semibold">{formatCents(subtotalCents)}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Delivery fees and final totals are calculated at checkout.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" render={<Link href="/">Continue shopping</Link>} />
        <Button disabled title="Checkout is not built yet">
          Proceed to checkout
        </Button>
      </div>
    </div>
  )
}
