import { products } from '../src/data/products';
import { resolveLines } from '../src/lib/cart';
import type { CheckoutRequest } from '../src/lib/checkoutSchema';

/*
 * El SERVIDOR calcula el importe a cobrar a partir de su propio catálogo.
 * Lo que diga el navegador sobre precios se ignora por completo.
 */
export const SHIPPING_COP: number | null = null; // ⚠️ Pendiente de definir por LUMINA.

export interface PricedOrder {
  subtotal: number;
  shipping: number;
  total: number;
  amountInCents: number;
}

export class PricingError extends Error {}

export function priceOrder(lines: CheckoutRequest['lines']): PricedOrder {
  const resolved = resolveLines(lines, products);
  if (resolved.length !== lines.length) {
    throw new PricingError('Algún producto de la cesta ya no está disponible.');
  }
  const subtotal = resolved.reduce((sum, l) => sum + l.lineTotal, 0);
  const shipping = SHIPPING_COP ?? 0;
  const total = subtotal + shipping;
  // Wompi trabaja en centavos: $ 420.000 COP → 42000000.
  return { subtotal, shipping, total, amountInCents: total * 100 };
}
