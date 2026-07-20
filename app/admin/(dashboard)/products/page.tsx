import { Badge } from "@/components/ui/badge"
import { listProducts } from "@/lib/db/product-repository"
import { formatCents } from "@/lib/format"

export default async function AdminProductsPage() {
  const products = await listProducts()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-semibold">Products</h1>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No products yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Category
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Price
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Stock
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Featured
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2 font-medium">{product.name}</td>
                  <td className="px-3 py-2">{product.category}</td>
                  <td className="px-3 py-2">{formatCents(product.priceCents)}</td>
                  <td className="px-3 py-2">
                    {product.stock === 0 ? (
                      <Badge variant="destructive">Out of stock</Badge>
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{product.featured ? "Yes" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
