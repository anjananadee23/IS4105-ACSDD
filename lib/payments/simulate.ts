import { randomUUID } from "node:crypto"

/**
 * Documented test input for a reliably reproducible failure demo (AGENTS.md "Payment simulation").
 * Any other syntactically valid 16-digit dummy card number succeeds.
 */
export const FAILING_TEST_CARD_NUMBER = "4000000000000002"

export type PaymentResult =
  | { success: true; reference: string }
  | { success: false; reference: null; reason: string }

export function simulatePayment(cardNumber: string): PaymentResult {
  if (cardNumber === FAILING_TEST_CARD_NUMBER) {
    return {
      success: false,
      reference: null,
      reason: "Payment declined by the issuing bank. Try a different card.",
    }
  }

  return {
    success: true,
    reference: `TXN-${randomUUID().slice(0, 8).toUpperCase()}`,
  }
}
