import { useMemo, useState, type FormEvent } from 'react';
import { useAdminOrders } from '../../admin/useAdminOrders';
import { statusFlow, statusLabel, statusLabels, type AdminOrder, type AdminOrderStatus } from '../../data/adminOrders';
import { allProducts as products } from '../../data/products';
import { sizeGuide } from '../../data/sizes';
import { stores } from '../../data/stores';
import { cartSubtotal, resolveLines } from '../../lib/cart';
import { normalize } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { controlClass } from '../../components/ui/fieldStyles';
import { AdminHead } from './AdminLayout';
import styles from './Admin.module.css';

/*
 * Pedidos: resumen (tarjetas que también filtran) · buscador · filtros por estado · tabla.
 * Al abrir un pedido, panel lateral con productos, cliente, entrega, historial
 * y el botón para avanzar al siguiente estado (o cancelar antes del envío).
 */
type Filter = AdminOrderStatus | 'todos';

const dateTime = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
});
const dateShort = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' });
const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

const orderTotal = (o: AdminOrder) => cartSubtotal(resolveLines(o.lines, products));
const storeName = (id: string) => stores.find((s) => s.id === id)?.name.replace('Tienda LUMINA ', '') ?? id;
const deliveryText = (o: AdminOrder) =>
  o.delivery.type === 'envio' ? o.delivery.city : `Recoge en ${storeName(o.delivery.storeId)}`;

export function AdminOrdersPage() {
  usePageTitle('Pedidos · Administración');
  const { orders, setStatus } = useAdminOrders();
  const [filter, setFilter] = useState<Filter>('todos');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const count = (s: AdminOrderStatus) => orders.filter((o) => o.status === s).length;

  // Ventas del mes en curso: pedidos no cancelados.
  const monthSales = useMemo(() => {
    const now = new Date();
    return orders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return o.status !== 'cancelado' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, o) => sum + orderTotal(o), 0);
  }, [orders]);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return orders
      .filter((o) => filter === 'todos' || o.status === filter)
      .filter((o) => !q || [o.id, o.customer.name, o.customer.email].some((v) => normalize(v).includes(q)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, filter, query]);

  const open = orders.find((o) => o.id === openId) ?? null;

  const kpis: { label: string; value: string; filter?: AdminOrderStatus }[] = [
    { label: 'Por preparar', value: String(count('pagado')), filter: 'pagado' },
    { label: 'En preparación', value: String(count('preparando')), filter: 'preparando' },
    { label: 'Enviados', value: String(count('enviado')), filter: 'enviado' },
    { label: 'Ventas del mes', value: formatPrice(monthSales) },
  ];

  return (
    <>
      <AdminHead title="Pedidos" />

      <ul className={styles.kpis}>
        {kpis.map((k) => (
          <li key={k.label}>
            {k.filter ? (
              <button
                type="button"
                className={styles.kpi}
                data-active={filter === k.filter}
                onClick={() => setFilter(filter === k.filter ? 'todos' : k.filter!)}
              >
                <span className={styles.kpiLabel}>{k.label}</span>
                <span className={styles.kpiValue}>{k.value}</span>
              </button>
            ) : (
              <div className={styles.kpi}>
                <span className={styles.kpiLabel}>{k.label}</span>
                <span className={styles.kpiValue}>{k.value}</span>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className={styles.toolbar}>
        <input
          type="search"
          className={`${controlClass} ${styles.search}`}
          placeholder="Buscar por número, nombre o correo"
          aria-label="Buscar pedidos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.chips} role="group" aria-label="Filtrar por estado">
          {(['todos', ...statusFlow, 'cancelado'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              className={styles.chip}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f === 'todos' ? 'Todos' : statusLabels[f]}
              <span className={styles.chipCount}>{f === 'todos' ? orders.length : count(f)}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className={styles.soon}>
          {orders.length === 0
            ? 'Aún no hay pedidos. Aquí aparecerán las ventas de la tienda.'
            : 'No hay pedidos con estos filtros.'}
        </p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Pedido</th>
                <th scope="col">Fecha</th>
                <th scope="col">Cliente</th>
                <th scope="col">Entrega</th>
                <th scope="col">Estado</th>
                <th scope="col" className={styles.num}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => (
                <tr key={o.id}>
                  <td>
                    <button type="button" className={styles.rowLink} onClick={() => setOpenId(o.id)}>
                      {o.id}
                    </button>
                  </td>
                  <td className={styles.muted}>{dateShort.format(new Date(o.createdAt))}</td>
                  <td>{o.customer.name}</td>
                  <td className={styles.muted}>{deliveryText(o)}</td>
                  <td>
                    <StatusSelect order={o} onStatus={setStatus} />
                  </td>
                  <td className={styles.num}>{formatPrice(orderTotal(o))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open ? `Pedido ${open.id}` : 'Pedido'}>
        {open && <OrderDetail key={open.id} order={open} onStatus={setStatus} />}
      </Drawer>
    </>
  );
}

/*
 * Cambiar el estado desde la tabla, sin abrir el pedido.
 * Pasar a "Enviado" en un envío pide el número de guía; cancelar pide confirmación.
 * También permite corregir un estado puesto por error (queda registrado en el historial).
 */
function StatusSelect({
  order,
  onStatus,
}: {
  order: AdminOrder;
  onStatus: (id: string, status: AdminOrderStatus, tracking?: string) => void;
}) {
  const change = (next: AdminOrderStatus) => {
    if (next === order.status) return;
    if (next === 'enviado' && order.delivery.type === 'envio') {
      const tracking = window.prompt(`Número de guía del pedido ${order.id}:`, order.tracking ?? '')?.trim();
      if (!tracking) return;
      return onStatus(order.id, next, tracking);
    }
    if (next === 'cancelado' && !window.confirm(`¿Cancelar el pedido ${order.id}? Recuerda reembolsar el pago.`)) return;
    onStatus(order.id, next);
  };

  return (
    <select
      className={styles.statusSelect}
      data-status={order.status}
      value={order.status}
      onChange={(e) => change(e.target.value as AdminOrderStatus)}
      aria-label={`Estado del pedido ${order.id}`}
    >
      {[...statusFlow, 'cancelado' as const].map((st) => (
        <option key={st} value={st}>
          {statusLabel(st, order.delivery)}
        </option>
      ))}
    </select>
  );
}

function StatusBadge({ order }: { order: AdminOrder }) {
  return (
    <span className={styles.badge} data-status={order.status}>
      {statusLabel(order.status, order.delivery)}
    </span>
  );
}

function OrderDetail({
  order,
  onStatus,
}: {
  order: AdminOrder;
  onStatus: (id: string, status: AdminOrderStatus, tracking?: string) => void;
}) {
  const lines = resolveLines(order.lines, products);
  const [tracking, setTracking] = useState(order.tracking ?? '');
  const [error, setError] = useState('');

  const index = statusFlow.indexOf(order.status);
  const next = order.status === 'cancelado' ? undefined : statusFlow[index + 1];
  const isShipping = order.delivery.type === 'envio';
  const needsTracking = next === 'enviado' && isShipping;
  const canCancel = order.status === 'pagado' || order.status === 'preparando';

  const nextLabel: Partial<Record<AdminOrderStatus, string>> = {
    preparando: 'Empezar a preparar',
    enviado: isShipping ? 'Marcar como enviado' : 'Marcar listo en tienda',
    entregado: 'Marcar como entregado',
  };

  const advance = (e: FormEvent) => {
    e.preventDefault();
    if (!next) return;
    if (needsTracking && !tracking.trim()) return setError('Escribe el número de guía antes de marcarlo como enviado.');
    setError('');
    onStatus(order.id, next, needsTracking ? tracking.trim() : undefined);
  };

  const cancel = () => {
    if (window.confirm(`¿Cancelar el pedido ${order.id}? Recuerda reembolsar el pago en Wompi.`))
      onStatus(order.id, 'cancelado');
  };

  return (
    <div className={styles.detail}>
      <div className={styles.detailTop}>
        <StatusBadge order={order} />
        <span className={styles.muted}>
          Pagado el {formatDateTime(order.createdAt)} · {order.payment}
        </span>
      </div>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Productos</h2>
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
              <p>{formatPrice(l.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <p className={styles.totalRow}>
          <span>Total (envío gratis)</span>
          <strong>{formatPrice(cartSubtotal(lines))}</strong>
        </p>
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Cliente</h2>
        <p>{order.customer.name}</p>
        <p className={styles.muted}>
          {order.customer.document} · {order.customer.phone}
        </p>
        <a href={`mailto:${order.customer.email}`} className={styles.link}>
          {order.customer.email}
        </a>
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Entrega</h2>
        {order.delivery.type === 'envio' ? (
          <>
            <p>{order.delivery.address}</p>
            <p className={styles.muted}>{order.delivery.city}</p>
            {order.tracking && <p className={styles.muted}>Guía: {order.tracking}</p>}
          </>
        ) : (
          <p>Recoge en la tienda {storeName(order.delivery.storeId)}</p>
        )}
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Historial</h2>
        <ol className={styles.history}>
          {order.history.map((h, i) => (
            <li key={`${h.status}-${i}`} data-status={h.status}>
              <span>{statusLabel(h.status, order.delivery)}</span>
              <span className={styles.muted}>{formatDateTime(h.at)}</span>
            </li>
          ))}
        </ol>
      </section>

      {(next || canCancel) && (
        <form className={styles.actions} onSubmit={advance} noValidate>
          {needsTracking && (
            <label className={styles.trackingField}>
              <span className={styles.detailTitle}>Número de guía</span>
              <input
                className={controlClass}
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                aria-invalid={!!error}
                placeholder="Ej. GUIA-000000006"
              />
              {error && <span className={styles.error}>{error}</span>}
            </label>
          )}
          {next && <Button type="submit">{nextLabel[next]}</Button>}
          {canCancel && (
            <button type="button" className={styles.textButton} onClick={cancel}>
              Cancelar pedido
            </button>
          )}
        </form>
      )}
    </div>
  );
}
