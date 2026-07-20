export type CheckoutItemInput = {
  productId: string
  quantity: number
}

export type CheckoutInput = {
  customer: {
    fullName: string
    email: string
    phone: string
  }
  delivery: {
    addressLine1: string
    addressLine2?: string
    city: string
    postalCode?: string
  }
  payment: {
    cardNumber: string
    expiry: string
    cvv: string
  }
  items: CheckoutItemInput[]
}

export type ValidationResult =
  | { success: true; data: CheckoutInput }
  | { success: false; errors: string[] }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CARD_RE = /^\d{16}$/
const EXPIRY_RE = /^(0[1-9]|1[0-2])\/\d{2}$/
const CVV_RE = /^\d{3,4}$/

function isNonEmptyString(value: unknown, max = 200): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max
}

export function parseCheckoutInput(body: unknown): ValidationResult {
  const errors: string[] = []

  if (typeof body !== "object" || body === null) {
    return { success: false, errors: ["Request body must be an object."] }
  }
  const b = body as Record<string, unknown>

  const customer = (b.customer ?? {}) as Record<string, unknown>
  if (!isNonEmptyString(customer.fullName, 100)) errors.push("Full name is required.")
  if (typeof customer.email !== "string" || !EMAIL_RE.test(customer.email)) {
    errors.push("A valid email address is required.")
  }
  if (!isNonEmptyString(customer.phone, 20)) errors.push("Phone number is required.")

  const delivery = (b.delivery ?? {}) as Record<string, unknown>
  if (!isNonEmptyString(delivery.addressLine1, 200)) errors.push("Delivery address is required.")
  if (delivery.addressLine2 !== undefined && typeof delivery.addressLine2 !== "string") {
    errors.push("Delivery address line 2 must be text.")
  }
  if (!isNonEmptyString(delivery.city, 100)) errors.push("City is required.")
  if (delivery.postalCode !== undefined && typeof delivery.postalCode !== "string") {
    errors.push("Postal code must be text.")
  }

  const payment = (b.payment ?? {}) as Record<string, unknown>
  if (typeof payment.cardNumber !== "string" || !CARD_RE.test(payment.cardNumber)) {
    errors.push("Card number must be 16 digits.")
  }
  if (typeof payment.expiry !== "string" || !EXPIRY_RE.test(payment.expiry)) {
    errors.push("Expiry must be in MM/YY format.")
  }
  if (typeof payment.cvv !== "string" || !CVV_RE.test(payment.cvv)) {
    errors.push("CVV must be 3 or 4 digits.")
  }

  const items = b.items
  const parsedItems: CheckoutItemInput[] = []
  if (!Array.isArray(items) || items.length === 0) {
    errors.push("Cart must contain at least one item.")
  } else {
    for (const raw of items) {
      const item = raw as Record<string, unknown>
      if (
        typeof item.productId !== "string" ||
        item.productId.length === 0 ||
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        errors.push("Each cart item needs a valid productId and a positive integer quantity.")
        break
      }
      parsedItems.push({ productId: item.productId, quantity: item.quantity })
    }
  }

  if (errors.length > 0) {
    return { success: false, errors }
  }

  return {
    success: true,
    data: {
      customer: {
        fullName: (customer.fullName as string).trim(),
        email: (customer.email as string).trim(),
        phone: (customer.phone as string).trim(),
      },
      delivery: {
        addressLine1: (delivery.addressLine1 as string).trim(),
        addressLine2:
          typeof delivery.addressLine2 === "string" && delivery.addressLine2.trim().length > 0
            ? delivery.addressLine2.trim()
            : undefined,
        city: (delivery.city as string).trim(),
        postalCode:
          typeof delivery.postalCode === "string" && delivery.postalCode.trim().length > 0
            ? delivery.postalCode.trim()
            : undefined,
      },
      payment: {
        cardNumber: payment.cardNumber as string,
        expiry: payment.expiry as string,
        cvv: payment.cvv as string,
      },
      items: parsedItems,
    },
  }
}
