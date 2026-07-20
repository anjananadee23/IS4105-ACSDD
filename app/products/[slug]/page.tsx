import Link from "next/link"
import { notFound } from "next/navigation"

import { AddToCartForm } from "@/components/add-to-cart-form"
import { Badge } from "@/components/ui/badge"
import { findProductBySlug } from "@/lib/db/product-repository"
import { formatCents } from "@/lib/format"

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await findProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← Back to catalogue
      </Link>

      <div className="mt-4 grid gap-8 sm:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- locally generated SVG placeholders don't need the image optimizer */}
          <img src={product.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="font-heading text-2xl font-semibold">{product.name}</h1>
            <p className="mt-2 text-xl font-medium">{formatCents(product.priceCents)}</p>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <AddToCartForm product={product} />
        </div>
      </div>
    </div>
  )
}
