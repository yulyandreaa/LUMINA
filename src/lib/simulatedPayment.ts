import { addOrder, nextOrderId } from '../admin/useAdminOrders';
import { readOverrides, variantKey, writeOverrides } from '../admin/catalogOverrides';
import type { AdminOrder, PaymentMethod } from '../data/adminOrders';
import type { CartLine } from './cart';
import type { CustomerInput } from './checkoutSchema';

/*
 * PAGO SIMULADO (mientras Wompi no esté configurado): no hay pasarela ni cobro.
 * Al aprobarlo se crea el pedido (estado "pagado") y se descuentan las unidades del inventario registrado.
 * Para usar Wompi sandbox: VITE_PAYMENT_MODE=wompi y las llaves de .env.example.
 */
export const PAYMENT_MODE: 'simulado' | 'wompi' = import.meta.env.VITE_PAYMENT_MODE === 'wompi' ? 'wompi' : 'simulado';

export const paymentMethods: PaymentMethod[] = ['Tarjeta', 'PSE', 'Nequi', 'Botón Bancolombia'];

export function placeSimulatedOrder(customer: CustomerInput, lines: CartLine[], payment: PaymentMethod): AdminOrder {
  const now = new Date().toISOString();
  const order: AdminOrder = {
    id: nextOrderId(),
    createdAt: now,
    status: 'pagado',
    customer: {
      name: customer.fullName,
      email: customer.email.trim().toLowerCase(),
      phone: customer.phone,
      document: `${customer.legalIdType} ${customer.legalId}`,
    },
    delivery: {
      type: 'envio',
      city: `${customer.city}, ${customer.region}`,
      address: [customer.address, customer.address2].filter(Boolean).join(' · '),
    },
    payment,
    lines: lines.map(({ productId, colorId, size, quantity }) => ({ productId, colorId, size, quantity })),
    history: [{ status: 'pagado', at: now }],
  };
  addOrder(order);

  // Descuenta del inventario solo las variantes que tienen unidades registradas.
  const overrides = readOverrides();
  for (const l of order.lines) {
    const key = variantKey(l.colorId, l.size);
    const units = overrides[l.productId]?.stock?.[key];
    if (units !== undefined) {
      overrides[l.productId] = {
        ...overrides[l.productId],
        stock: { ...overrides[l.productId].stock, [key]: Math.max(0, units - l.quantity) },
      };
    }
  }
  writeOverrides(overrides);

  return order;
}
