import { randomUUID } from "node:crypto"
import { eq, sql } from "drizzle-orm"

import { db } from "./client"
import { orderItems, orders, products, type Order, type OrderItem } from "./schema"
import { findProductsByIds } from "./product-repository"
import type { CheckoutInput } from "@/lib/validation/checkout"
import { simulatePayment, type PaymentResult } from "@/lib/payments/simulate"

export const DELIVERY_FEE_CENTS = 50000

export type PricedLine = {
  productId: string
  productName: string
  productSlug: string
  imageUrl: string
  unitPriceCents: number
  quantity: number
  lineTotalCents: number
}

export type PricingResult =
  | { ok: true; lines: PricedLine[]; subtotalCents: number; totalCents: number }
  | { ok: false; errors: string[] }

export async function priceCheckoutItems(items: CheckoutInput["items"]): Promise<PricingResult> {
  const dbProducts = await findProductsByIds(items.map((item) => item.productId))
  const byId = new Map(dbProducts.map((product) => [product.id, product]))

  const errors: string[] = []
  const lines: PricedLine[] = []

  for (const item of items) {
    const product = byId.get(item.productId)
    if (!product) {
      errors.push(`Product ${item.productId} no longer exists.`)
      continue
    }
    if (item.quantity > product.stock) {
      errors.push(`Only ${product.stock} of "${product.name}" left in stock.`)
      continue
    }
    const lineTotalCents = product.priceCents * item.quantity
    lines.push({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      imageUrl: product.imageUrl,
      unitPriceCents: product.priceCents,
      quantity: item.quantity,
      lineTotalCents,
    })
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0)
  return { ok: true, lines, subtotalCents, totalCents: subtotalCents + DELIVERY_FEE_CENTS }
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(100000 + Math.random() * 900000)
  return `CC-${year}-${random}`
}

export type PlaceOrderResult =
  | { ok: true; order: Order; items: OrderItem[]; payment: PaymentResult }
  | { ok: false; errors: string[] }

export async function placeOrder(input: CheckoutInput): Promise<PlaceOrderResult> {
  const pricing = await priceCheckoutItems(input.items)
  if (!pricing.ok) {
    return { ok: false, errors: pricing.errors }
  }

  const payment = simulatePayment(input.payment.cardNumber)
  const now = new Date().toISOString()
  const orderId = randomUUID()

  const orderRow: Order = {
    id: orderId,
    orderNumber: generateOrderNumber(),
    customerName: input.customer.fullName,
    email: input.customer.email,
    phone: input.customer.phone,
    addressLine1: input.delivery.addressLine1,
    addressLine2: input.delivery.addressLine2 ?? null,
    city: input.delivery.city,
    postalCode: input.delivery.postalCode ?? null,
    subtotalCents: pricing.subtotalCents,
    deliveryCents: DELIVERY_FEE_CENTS,
    totalCents: pricing.totalCents,
    status: payment.success ? "confirmed" : "payment_failed",
    paymentReference: payment.reference,
    createdAt: now,
    updatedAt: now,
  }

  const itemRows: OrderItem[] = pricing.lines.map((line) => ({
    id: randomUUID(),
    orderId,
    productId: line.productId,
    productName: line.productName,
    productSlug: line.productSlug,
    imageUrl: line.imageUrl,
    unitPriceCents: line.unitPriceCents,
    quantity: line.quantity,
    lineTotalCents: line.lineTotalCents,
  }))

  db.transaction((tx) => {
    tx.insert(orders).values(orderRow).run()
    tx.insert(orderItems).values(itemRows).run()
    if (payment.success) {
      for (const line of pricing.lines) {
        tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${line.quantity}` })
          .where(eq(products.id, line.productId))
          .run()
      }
    }
  })

  return { ok: true, order: orderRow, items: itemRows, payment }
}

export function findOrderByNumber(orderNumber: string) {
  return db.query.orders.findFirst({ where: eq(orders.orderNumber, orderNumber) })
}

export function findOrderItems(orderId: string) {
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId))
}
