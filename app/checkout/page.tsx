"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart/cart-context"
import { formatCents } from "@/lib/format"
import { FAILING_TEST_CARD_NUMBER } from "@/lib/payments/simulate"

const DELIVERY_FEE_CENTS = 50000

type FormState = {
  fullName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  postalCode: string
  cardNumber: string
  expiry: string
  cvv: string
}

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotalCents, clear } = useCart()
  const [form, setForm] = React.useState<FormState>(initialState)
  const [submitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<string[]>([])

  React.useEffect(() => {
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((session: { email: string | null; name: string | null }) => {
        if (!session.email) return
        setForm((current) => ({
          ...current,
          fullName: current.fullName || session.name || "",
          email: current.email || session.email || "",
        }))
      })
      .catch(() => {})
  }, [])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setErrors([])
    setSubmitting(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { fullName: form.fullName, email: form.email, phone: form.phone },
          delivery: {
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2 || undefined,
            city: form.city,
            postalCode: form.postalCode || undefined,
          },
          payment: { cardNumber: form.cardNumber, expiry: form.expiry, cvv: form.cvv },
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      })

      const payload = await response.json()

      if (response.status === 402) {
        setErrors([payload.payment?.reason ?? "Payment was declined. Please try a different card."])
        return
      }

      if (!response.ok) {
        setErrors(payload.details ?? [payload.error ?? "Something went wrong."])
        return
      }

      clear()
      router.push(`/order/${payload.orderNumber}`)
    } catch {
      setErrors(["Could not reach the server. Please try again."])
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
        <h1 className="font-heading text-xl font-semibold">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground">Add something to your cart before checking out.</p>
        <Button render={<Link href="/">Continue shopping</Link>} />
      </div>
    )
  }

  const totalCents = subtotalCents + DELIVERY_FEE_CENTS

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-semibold">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold">Customer details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="fullName">
              <Input
                id="fullName"
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold">Delivery address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Address line 1" htmlFor="addressLine1" className="sm:col-span-2">
              <Input
                id="addressLine1"
                required
                value={form.addressLine1}
                onChange={(e) => update("addressLine1", e.target.value)}
              />
            </Field>
            <Field label="Address line 2 (optional)" htmlFor="addressLine2" className="sm:col-span-2">
              <Input
                id="addressLine2"
                value={form.addressLine2}
                onChange={(e) => update("addressLine2", e.target.value)}
              />
            </Field>
            <Field label="City" htmlFor="city">
              <Input id="city" required value={form.city} onChange={(e) => update("city", e.target.value)} />
            </Field>
            <Field label="Postal code (optional)" htmlFor="postalCode">
              <Input
                id="postalCode"
                value={form.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold">Payment (simulated)</h2>
          <p className="text-xs text-muted-foreground">
            This is a dummy payment gateway for demonstration only. No real card details are processed
            or stored. Use any 16-digit number to succeed, or{" "}
            <code className="rounded bg-muted px-1 py-0.5">{FAILING_TEST_CARD_NUMBER}</code> to see a
            simulated decline.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Card number" htmlFor="cardNumber" className="sm:col-span-2">
              <Input
                id="cardNumber"
                required
                inputMode="numeric"
                maxLength={16}
                placeholder="4242424242424242"
                value={form.cardNumber}
                onChange={(e) => update("cardNumber", e.target.value.replace(/\D/g, ""))}
              />
            </Field>
            <Field label="CVV" htmlFor="cvv">
              <Input
                id="cvv"
                required
                inputMode="numeric"
                maxLength={4}
                placeholder="123"
                value={form.cvv}
                onChange={(e) => update("cvv", e.target.value.replace(/\D/g, ""))}
              />
            </Field>
            <Field label="Expiry (MM/YY)" htmlFor="expiry">
              <Input
                id="expiry"
                required
                placeholder="12/29"
                maxLength={5}
                value={form.expiry}
                onChange={(e) => update("expiry", e.target.value)}
              />
            </Field>
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCents(subtotalCents)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span>{formatCents(DELIVERY_FEE_CENTS)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatCents(totalCents)}</span>
          </div>
        </section>

        {errors.length > 0 ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <ul className="list-inside list-disc">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Processing payment..." : `Pay ${formatCents(totalCents)}`}
          </Button>
          <Button variant="outline" render={<Link href="/cart">Back to cart</Link>} />
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}
