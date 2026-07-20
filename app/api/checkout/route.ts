import { NextResponse } from "next/server"

import { placeOrder } from "@/lib/db/order-repository"
import { parseCheckoutInput } from "@/lib/validation/checkout"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  const parsed = parseCheckoutInput(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout details.", details: parsed.errors }, { status: 422 })
  }

  const result = await placeOrder(parsed.data)
  if (!result.ok) {
    return NextResponse.json({ error: "Unable to place order.", details: result.errors }, { status: 409 })
  }

  return NextResponse.json(
    {
      orderNumber: result.order.orderNumber,
      status: result.order.status,
      payment: result.payment,
    },
    { status: result.payment.success ? 201 : 402 },
  )
}
