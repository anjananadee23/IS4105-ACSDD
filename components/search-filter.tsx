"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { RiCloseLine, RiSearch2Line } from "@remixicon/react"
import { cn } from "@/lib/utils"

interface SearchFilterProps {
  categories: string[]
  currentCategory?: string
  currentQuery?: string
}

export function SearchFilter({
  categories,
  currentCategory = "All",
  currentQuery = "",
}: SearchFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(currentQuery)
  const [syncedQuery, setSyncedQuery] = useState(currentQuery)

  // Reset local state when the URL query changes externally (e.g. clearing
  // filters). Updating state during render (rather than in an effect) avoids
  // an extra render pass; see https://react.dev/learn/you-might-not-need-an-effect
  if (currentQuery !== syncedQuery) {
    setSyncedQuery(currentQuery)
    setQuery(currentQuery)
  }

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category && category !== "All") {
      params.set("category", category)
    } else {
      params.delete("category")
    }
    // Clear page if there was any pagination
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  // Debounced query update
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query !== currentQuery) {
        const params = new URLSearchParams(searchParams.toString())
        if (query) {
          params.set("q", query)
        } else {
          params.delete("q")
        }
        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`)
        })
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query, currentQuery, pathname, router, searchParams])

  return (
    <div className="mb-8 space-y-6">
      <div className="relative flex max-w-md items-center">
        <RiSearch2Line className="absolute left-3 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search spices, tea, coffee, home goods..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "h-10 w-full rounded-lg border border-input bg-background/50 pl-10 pr-10 text-sm outline-none transition-all placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 md:text-sm",
            isPending && "opacity-75"
          )}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 inline-flex size-6 items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <RiCloseLine className="size-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Filter by Category
        </span>
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((category) => {
            const isActive = currentCategory === category
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer",
                  isActive
                    ? "bg-foreground text-background shadow-sm hover:bg-foreground/90"
                    : "border bg-background/30 hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
