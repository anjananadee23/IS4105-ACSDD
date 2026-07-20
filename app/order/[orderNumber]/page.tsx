import Link from "next/link"
import { notFound } from "next/navigation"
import { RiCheckboxCircleFill, RiCloseCircleFill } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { findOrderByNumber, findOrderItems } from "@/lib/db/order-repository"
import { formatCents } from "@/lib/format"

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params
  const order = await findOrderByNumber(orderNumber)
  if (!order) {
    notFound()
  }

  const items = await findOrderItems(order.id)
  const succeeded = order.status === "confirmed"

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        {succeeded ? (
          <RiCheckboxCircleFill className="size-12 text-primary" aria-hidden="true" />
        ) : (
          <RiCloseCircleFill className="size-12 text-destructive" aria-hidden="true" />
        )}
        <h1 className="font-heading text-2xl font-semibold">
          {succeeded ? "Order confirmed" : "Payment failed"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Order <span className="font-medium text-foreground">{order.orderNumber}</span>
          {order.paymentReference ? <> &middot; ref {order.paymentReference}</> : null}
        </p>
      </div>

      <Separator className="my-6" />

      <section className="flex flex-col gap-1 text-sm">
        <h2 className="font-heading text-base font-semibold">Deliver to</h2>
        <p>{order.customerName}</p>
        <p>{order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}</p>
        <p>
          {order.city}
          {order.postalCode ? ` ${order.postalCode}` : ""}
        </p>
        <p>{order.email} &middot; {order.phone}</p>
      </section>

      <Separator className="my-6" />

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-base font-semibold">Order summary</h2>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 text-sm">
              <span>
                {item.productName} &times; {item.quantity}
              </span>
              <span className="font-medium">{formatCents(item.lineTotalCents)}</span>
            </li>
          ))}
        </ul>

        <Separator />

        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCents(order.subtotalCents)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span>{formatCents(order.deliveryCents)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatCents(order.totalCents)}</span>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        {succeeded ? (
          <Button render={<Link href="/">Continue shopping</Link>} />
        ) : (
          <Button render={<Link href="/cart">Try a different card</Link>} />
        )}
      </div>
    </div>
  )
}
