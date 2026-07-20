import Link from "next/link"

import { ProductCard } from "@/components/product-card"
import { SearchFilter } from "@/components/search-filter"
import { listCategories, listProducts } from "@/lib/db/product-repository"

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category } = await searchParams
  let products: Awaited<ReturnType<typeof listProducts>> = []
  let categories: string[] = []
  let failed = false

  try {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      listProducts({ q, category }),
      listCategories(),
    ])
    products = fetchedProducts
    categories = fetchedCategories
  } catch {
    failed = true
  }

  const isFiltered = !!q || (!!category && category !== "All")

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold">Sri Lankan-made, delivered island-wide</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse spices, tea, coffee, crafts, and home goods from local makers.
        </p>
      </div>

      {!failed && (
        <SearchFilter
          categories={categories}
          currentCategory={category}
          currentQuery={q}
        />
      )}

      {failed ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          We couldn&apos;t load the catalogue right now. Please refresh the page.
        </p>
      ) : products.length === 0 ? (
        <div className="rounded-md border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            {isFiltered
              ? "No products found matching your criteria. Try adjusting your search or filters."
              : "No products are available yet. Check back soon."}
          </p>
          {isFiltered && (
            <Link
              href="/"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Clear Search & Filters
            </Link>
          )}
        </div>
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
