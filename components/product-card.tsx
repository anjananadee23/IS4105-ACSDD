import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatCents } from "@/lib/format"
import type { Product } from "@/lib/db/schema"

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0

  return (
    <Card className="overflow-hidden py-0 gap-0">
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="relative aspect-square w-full bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- locally generated SVG placeholders don't need the image optimizer */}
          <img
            src={product.imageUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          {outOfStock ? (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Out of stock
            </Badge>
          ) : null}
        </div>
      </Link>
      <CardHeader className="pt-4">
        <Badge variant="outline" className="w-fit text-xs">
          {product.category}
        </Badge>
      </CardHeader>
      <CardContent>
        <Link
          href={`/products/${product.slug}`}
          className="font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {product.name}
        </Link>
      </CardContent>
      <CardFooter className="pb-4">
        <span className="font-medium">{formatCents(product.priceCents)}</span>
      </CardFooter>
    </Card>
  )
}
