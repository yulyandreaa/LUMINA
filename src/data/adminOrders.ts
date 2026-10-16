import type { CartLine } from '../lib/cart';

/*
 * Pedidos del panel de administración.
 * Cuando se conecte la base de datos, vendrán de los pagos aprobados en Wompi.
 */
export type AdminOrderStatus = 'pagado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';
export type PaymentMethod = 'Tarjeta' | 'PSE' | 'Nequi' | 'Botón Bancolombia';

export type Delivery = { type: 'envio'; city: string; address: string } | { type: 'tienda'; storeId: string };

export interface AdminOrder {
  id: string;
  /** Fecha y hora del pago (ISO). */
  createdAt: string;
  status: AdminOrderStatus;
  customer: { name: string; email: string; phone: string; document: string };
  delivery: Delivery;
  payment: PaymentMethod;
  lines: CartLine[];
  /** Número de guía de la transportadora (solo envíos). */
  tracking?: string;
  history: { status: AdminOrderStatus; at: string }[];
}

/** Flujo normal de un pedido; "cancelado" queda fuera del flujo. */
export const statusFlow: AdminOrderStatus[] = ['pagado', 'preparando', 'enviado', 'entregado'];

export const statusLabels: Record<AdminOrderStatus, string> = {
  pagado: 'Por preparar',
  preparando: 'En preparación',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

/** En recogida en tienda, "enviado" significa que ya está listo en la tienda. */
export const statusLabel = (status: AdminOrderStatus, delivery: Delivery) =>
  status === 'enviado' && delivery.type === 'tienda' ? 'Listo en tienda' : statusLabels[status];

/** Sin pedidos de ejemplo: el panel empieza vacío hasta que entren ventas reales. */
export const seedAdminOrders: AdminOrder[] = [];
