import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
      <h1 className="font-heading text-xl font-semibold">Product not found</h1>
      <p className="text-sm text-muted-foreground">
        We couldn&apos;t find a product with that link. It may have been removed.
      </p>
      <Button render={<Link href="/">Back to catalogue</Link>} />
    </div>
  )
}
