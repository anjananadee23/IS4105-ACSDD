import { ProductCard } from "@/components/product-card"
import { listProducts } from "@/lib/db/product-repository"

export default async function CataloguePage() {
  let products: Awaited<ReturnType<typeof listProducts>> = []
  let failed = false

  try {
    products = await listProducts()
  } catch {
    failed = true
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold">Sri Lankan-made, delivered island-wide</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse spices, tea, coffee, crafts, and home goods from local makers.
        </p>
      </div>

      {failed ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          We couldn&apos;t load the catalogue right now. Please refresh the page.
        </p>
      ) : products.length === 0 ? (
        <p className="rounded-md border p-8 text-center text-sm text-muted-foreground">
          No products are available yet. Check back soon.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
