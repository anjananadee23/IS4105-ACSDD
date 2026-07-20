import { Badge } from "@/components/ui/badge"
import { listOrders } from "@/lib/db/order-repository"
import { formatCents } from "@/lib/format"
import type { Order } from "@/lib/db/schema"

const STATUS_LABEL: Record<Order["status"], string> = {
  confirmed: "Confirmed",
  payment_failed: "Payment failed",
  pending_payment: "Pending payment",
}

const STATUS_VARIANT: Record<Order["status"], "default" | "destructive" | "secondary"> = {
  confirmed: "default",
  payment_failed: "destructive",
  pending_payment: "secondary",
}

export default async function AdminOrdersPage() {
  const orders = await listOrders()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-semibold">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">
                  Order number
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Customer
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Total
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2 font-medium">{order.orderNumber}</td>
                  <td className="px-3 py-2">{order.customerName}</td>
                  <td className="px-3 py-2">
                    <Badge variant={STATUS_VARIANT[order.status]}>{STATUS_LABEL[order.status]}</Badge>
                  </td>
                  <td className="px-3 py-2">{formatCents(order.totalCents)}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
