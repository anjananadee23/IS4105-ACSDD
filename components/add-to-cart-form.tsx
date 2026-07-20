"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart/cart-context"
import type { Product } from "@/lib/db/schema"

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = React.useState(1)
  const outOfStock = product.stock <= 0

  function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number.parseInt(event.target.value, 10)
    if (Number.isNaN(value)) {
      setQuantity(1)
      return
    }
    setQuantity(Math.max(1, Math.min(value, product.stock)))
  }

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.imageUrl,
        unitPriceCents: product.priceCents,
        stock: product.stock,
      },
      quantity,
    )
    toast.success(`Added ${quantity} × ${product.name} to your cart`)
  }

  if (outOfStock) {
    return (
      <Button disabled className="w-fit">
        Out of stock
      </Button>
    )
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          inputMode="numeric"
          min={1}
          max={product.stock}
          step={1}
          value={quantity}
          onChange={handleQuantityChange}
          className="w-24"
        />
      </div>
      <Button onClick={handleAddToCart}>Add to cart</Button>
      <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
    </div>
  )
}
