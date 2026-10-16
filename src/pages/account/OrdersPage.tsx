import { useAuth } from '../../auth/AuthContext';
import { useAdminOrders } from '../../admin/useAdminOrders';
import type { AdminOrder, AdminOrderStatus } from '../../data/adminOrders';
import { allProducts as products } from '../../data/products';
import { Button } from '../../components/ui/Button';
import { sizeGuide } from '../../data/sizes';
import { cartSubtotal, resolveLines } from '../../lib/cart';
import { formatPrice } from '../../lib/format';
import { usePageTitle } from '../../hooks/usePageTitle';
import { SectionHead } from './AccountLayout';
import styles from './Account.module.css';

/*
 * Mis pedidos: lista compacta, una fila por pedido (número · fecha · estado · total).
 * Al tocar una fila se despliega el detalle: línea de tiempo, productos y dirección de envío.
 * Son los mismos pedidos que gestiona el panel (por correo), así el cliente ve el estado al día.
 */
const orderSteps: { id: AdminOrderStatus; label: string }[] = [
  { id: 'pagado', label: 'Pagado' },
  { id: 'preparando', label: 'En preparación' },
  { id: 'enviado', label: 'Enviado' },
  { id: 'entregado', label: 'Entregado' },
];

const shipText = (o: AdminOrder) =>
  o.delivery.type === 'envio' ? `Envío a ${o.delivery.address}, ${o.delivery.city}` : 'Recoges en la tienda';
const dateFormat = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T12:00:00`));

export function OrdersPage() {
  usePageTitle('Mis pedidos');
  const { customer } = useAuth();
  const { orders } = useAdminOrders();
  const mine = orders
    .filter((o) => o.customer.email === customer?.email.trim().toLowerCase())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <SectionHead title="Mis pedidos" />

      {mine.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Aún no tienes pedidos.</p>
          <p className={styles.muted}>Cuando compres, aquí verás el estado de tu pedido.</p>
          <Button to="/monturas" variant="secondary" withArrow>
            Ver monturas
          </Button>
        </div>
      ) : (
      <div>
        <div className={styles.ordersHead} aria-hidden="true">
          <span>Pedido</span>
          <span>Fecha</span>
          <span>Estado</span>
          <span>Total</span>
        </div>

        {mine.map((order) => {
          const lines = resolveLines(order.lines, products);
          const cancelled = order.status === 'cancelado';
          const reached = cancelled ? -1 : orderSteps.findIndex((s) => s.id === order.status);
          const label = cancelled ? 'Cancelado' : orderSteps[reached].label;
          return (
            <details key={order.id} className={styles.order}>
              <summary className={styles.orderRow}>
                <span className={styles.orderId}>{order.id}</span>
                <span className={styles.orderDate}>{formatDate(order.createdAt.slice(0, 10))}</span>
                <span className={styles.orderStatus}>
                  <span className={styles.badge} data-status={order.status}>
                    {label}
                  </span>
                </span>
                <span className={styles.orderTotal}>{formatPrice(cartSubtotal(lines))}</span>
                <span className={styles.orderToggle} aria-hidden="true" />
              </summary>

              <div className={styles.orderDetail}>
                {cancelled ? (
                  <p className={styles.muted}>Este pedido fue cancelado. Si ya pagaste, el reembolso va al mismo medio de pago.</p>
                ) : (
                  <ol className={styles.timeline} aria-label={`Estado: ${label}`}>
                    {orderSteps.map((step, i) => (
                      <li key={step.id} data-done={i <= reached}>
                        {step.label}
                      </li>
                    ))}
                  </ol>
                )}

                <ul className={styles.items}>
                  {lines.map((l) => (
                    <li key={l.key} className={styles.item}>
                      <img src={l.color.image} alt="" className={styles.thumb} />
                      <div>
                        <p className={styles.itemName}>{l.product.name}</p>
                        <p className={styles.muted}>
                          {l.color.name} · Talla {sizeGuide[l.size].label.toLowerCase()} · {l.quantity} ud.
                        </p>
                      </div>
                      <p className={styles.itemPrice}>{formatPrice(l.lineTotal)}</p>
                    </li>
                  ))}
                </ul>

                <p className={styles.muted}>
                  {shipText(order)}
                  {order.tracking && ` · Guía ${order.tracking}`}
                </p>
              </div>
            </details>
          );
        })}
      </div>
      )}
    </>
  );
}
