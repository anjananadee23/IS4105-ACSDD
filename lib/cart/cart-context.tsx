"use client"

import * as React from "react"

import type { CartItem } from "./types"

const STORAGE_KEY = "ceyloncart:cart"

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
  subtotalCents: number
  itemCount: number
}

const CartContext = React.createContext<CartContextValue | null>(null)

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const hydrated = React.useRef(false)

  React.useEffect(() => {
    // Hydrate from localStorage on mount only; it isn't available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStoredCart())
    hydrated.current = true
  }, [])

  React.useEffect(() => {
    if (!hydrated.current) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = React.useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((line) => line.productId === item.productId)
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, item.stock)
        return current.map((line) =>
          line.productId === item.productId ? { ...line, quantity: nextQuantity } : line,
        )
      }
      return [...current, { ...item, quantity: Math.min(quantity, item.stock) }]
    })
  }, [])

  const removeItem = React.useCallback((productId: string) => {
    setItems((current) => current.filter((line) => line.productId !== productId))
  }, [])

  const setQuantity = React.useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: Math.max(1, Math.min(quantity, line.stock)) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }, [])

  const clear = React.useCallback(() => setItems([]), [])

  const subtotalCents = React.useMemo(
    () => items.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0),
    [items],
  )

  const itemCount = React.useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items],
  )

  const value = React.useMemo(
    () => ({ items, addItem, removeItem, setQuantity, clear, subtotalCents, itemCount }),
    [items, addItem, removeItem, setQuantity, clear, subtotalCents, itemCount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
