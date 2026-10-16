import { useMemo, useState } from 'react';
import { buildCustomers, useCustomerNotes, type Customer } from '../../admin/adminCustomers';
import { bookingLabels, useAdminAppointments } from '../../admin/adminAppointments';
import { useAdminOrders } from '../../admin/useAdminOrders';
import { statusLabel, type AdminOrder } from '../../data/adminOrders';
import { allProducts } from '../../data/products';
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
 * Clientes: resumen · filtros (segmento, búsqueda, orden) · tabla.
 * Al abrir un cliente: contacto (llamar, WhatsApp, correo), datos, pedidos, citas,
 * favoritos y notas internas del equipo.
 */
type Segment = 'todos' | 'cuenta' | 'compraron' | 'citas';
type Sort = 'recientes' | 'compras' | 'nombre';

const segments: { id: Segment; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'cuenta', label: 'Con cuenta' },
  { id: 'compraron', label: 'Compraron' },
  { id: 'citas', label: 'Solo citas' },
];

const dateFormat = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
const formatDate = (iso: string) => dateFormat.format(new Date(iso.length === 10 ? `${iso}T12:00:00` : iso));
const orderTotal = (o: AdminOrder) => cartSubtotal(resolveLines(o.lines, allProducts));
const spent = (c: Customer) => c.orders.filter((o) => o.status !== 'cancelado').reduce((n, o) => n + orderTotal(o), 0);
const paidOrders = (c: Customer) => c.orders.filter((o) => o.status !== 'cancelado').length;
const storeName = (id: string) => stores.find((s) => s.id === id)?.name.replace('Tienda LUMINA ', '') ?? id;

export function AdminCustomersPage() {
  usePageTitle('Clientes · Administración');
  const { orders } = useAdminOrders();
  const { bookings } = useAdminAppointments();
  const { notes, saveNote } = useCustomerNotes();
  const [segment, setSegment] = useState<Segment>('todos');
  const [sort, setSort] = useState<Sort>('recientes');
  const [query, setQuery] = useState('');
  const [openEmail, setOpenEmail] = useState<string | null>(null);

  const customers = useMemo(() => buildCustomers(orders, bookings), [orders, bookings]);

  const buyers = customers.filter((c) => paidOrders(c) > 0);
  const kpis = [
    { label: 'Clientes', value: String(customers.length) },
    { label: 'Con cuenta', value: String(customers.filter((c) => c.hasAccount).length) },
    { label: 'Recurrentes (2+ compras)', value: String(customers.filter((c) => paidOrders(c) >= 2).length) },
    {
      label: 'Compra promedio',
      value: buyers.length ? formatPrice(Math.round(buyers.reduce((n, c) => n + spent(c), 0) / buyers.length)) : '—',
    },
  ];

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    const list = customers
      .filter((c) =>
        segment === 'cuenta'
          ? c.hasAccount
          : segment === 'compraron'
            ? paidOrders(c) > 0
            : segment === 'citas'
              ? c.orders.length === 0 && c.bookings.length > 0
              : true,
      )
      .filter((c) => !q || [c.name, c.email, c.phone ?? ''].some((v) => normalize(v).includes(q)));
    return list.sort((a, b) =>
      sort === 'nombre'
        ? a.name.localeCompare(b.name, 'es')
        : sort === 'compras'
          ? spent(b) - spent(a)
          : (b.lastActivity ?? '').localeCompare(a.lastActivity ?? ''),
    );
  }, [customers, segment, sort, query]);

  const open = customers.find((c) => c.email === openEmail) ?? null;

  return (
    <>
      <AdminHead title="Clientes" />

      <ul className={styles.kpis}>
        {kpis.map((k) => (
          <li key={k.label}>
            <div className={styles.kpi}>
              <span className={styles.kpiLabel}>{k.label}</span>
              <span className={styles.kpiValue}>{k.value}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.filters}>
        <div className={styles.chips} role="group" aria-label="Segmento">
          {segments.map((s) => (
            <button key={s.id} type="button" className={styles.chip} aria-pressed={segment === s.id} onClick={() => setSegment(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className={styles.filterRow}>
          <input
            type="search"
            className={`${controlClass} ${styles.search}`}
            placeholder="Buscar por nombre, correo o celular"
            aria-label="Buscar clientes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className={`${controlClass} ${styles.select}`} value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Ordenar">
            <option value="recientes">Actividad más reciente</option>
            <option value="compras">Más compras</option>
            <option value="nombre">Nombre (A–Z)</option>
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className={styles.soon}>
          {customers.length === 0
            ? 'Aún no hay clientes. Aparecerán cuando alguien cree una cuenta, compre o pida una cita.'
            : 'No hay clientes con estos filtros.'}
        </p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Cliente</th>
                <th scope="col">Celular</th>
                <th scope="col" className={styles.num}>
                  Pedidos
                </th>
                <th scope="col" className={styles.num}>
                  Total comprado
                </th>
                <th scope="col" className={styles.num}>
                  Citas
                </th>
                <th scope="col">Última actividad</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c.email}>
                  <td>
                    <button type="button" className={styles.customerCell} onClick={() => setOpenEmail(c.email)}>
                      <span className={styles.rowLink}>{c.name}</span>
                      <span className={styles.muted}>
                        {c.email}
                        {c.hasAccount && <span className={styles.accountTag}>Cuenta</span>}
                      </span>
                    </button>
                  </td>
                  <td className={styles.muted}>{c.phone ?? '—'}</td>
                  <td className={styles.num}>{paidOrders(c)}</td>
                  <td className={styles.num}>{formatPrice(spent(c))}</td>
                  <td className={styles.num}>{c.bookings.length}</td>
                  <td className={styles.muted}>{c.lastActivity ? formatDate(c.lastActivity) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer open={!!open} onClose={() => setOpenEmail(null)} title={open?.name ?? 'Cliente'}>
        {open && <CustomerDetail key={open.email} customer={open} note={notes[open.email] ?? ''} onSaveNote={(t) => saveNote(open.email, t)} />}
      </Drawer>
    </>
  );
}

function CustomerDetail({ customer: c, note, onSaveNote }: { customer: Customer; note: string; onSaveNote: (text: string) => void }) {
  const [draft, setDraft] = useState(note);
  const [saved, setSaved] = useState(false);
  const phone = c.phone?.replace(/\D/g, '');
  const favorites = (c.account?.favorites ?? []).flatMap((f) => {
    const p = allProducts.find((x) => x.id === f.productId);
    const color = p?.colors.find((x) => x.id === f.colorId);
    return p ? [`${p.name}${color ? ` · ${color.name}` : ''}`] : [];
  });
  const orders = [...c.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const bookings = [...c.bookings].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  return (
    <div className={styles.detail}>
      <div className={styles.detailTop}>
        {c.hasAccount ? <span className={styles.accountTag}>Tiene cuenta</span> : <span className={styles.muted}>Sin cuenta en la tienda</span>}
      </div>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Contacto</h2>
        <div className={styles.contactLinks}>
          {phone && (
            <>
              <a href={`tel:+57${phone}`} className={styles.link}>
                {c.phone}
              </a>
              <a href={`https://wa.me/57${phone}`} target="_blank" rel="noreferrer" className={styles.link}>
                WhatsApp
              </a>
            </>
          )}
          <a href={`mailto:${c.email}`} className={styles.link}>
            {c.email}
          </a>
        </div>
        {c.document && <p className={styles.muted}>Documento: {c.document}</p>}
        {c.city && <p className={styles.muted}>Ciudad: {c.city}</p>}
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Resumen</h2>
        <p>
          {paidOrders(c)} pedido{paidOrders(c) === 1 ? '' : 's'} · {formatPrice(spent(c))} · {c.bookings.length} cita
          {c.bookings.length === 1 ? '' : 's'}
        </p>
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Pedidos</h2>
        {orders.length === 0 ? (
          <p className={styles.muted}>Sin pedidos.</p>
        ) : (
          <ul className={styles.miniList}>
            {orders.map((o) => (
              <li key={o.id}>
                <strong>{o.id}</strong>
                <span className={styles.muted}>{formatDate(o.createdAt)}</span>
                <span className={styles.badge} data-status={o.status}>
                  {statusLabel(o.status, o.delivery)}
                </span>
                <span className={styles.miniEnd}>{formatPrice(orderTotal(o))}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Citas de examen</h2>
        {bookings.length === 0 ? (
          <p className={styles.muted}>Sin citas.</p>
        ) : (
          <ul className={styles.miniList}>
            {bookings.map((b) => (
              <li key={b.id}>
                <strong>{formatDate(b.date)}</strong>
                <span className={styles.muted}>
                  {b.time} · {storeName(b.store)}
                </span>
                <span className={`${styles.badge} ${styles.miniEnd}`} data-booking={b.status}>
                  {bookingLabels[b.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {favorites.length > 0 && (
        <section className={styles.detailBlock}>
          <h2 className={styles.detailTitle}>Favoritos</h2>
          <p>{favorites.join(', ')}</p>
        </section>
      )}

      <section className={styles.actions}>
        <label className={styles.trackingField}>
          <span className={styles.detailTitle}>Notas internas</span>
          <textarea
            className={`${controlClass} ${styles.notes}`}
            rows={4}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setSaved(false);
            }}
            placeholder="Ej. Prefiere monturas pequeñas; llamar después de las 5 p. m."
          />
          <span className={styles.muted}>Solo las ve el equipo de LUMINA.</span>
        </label>
        <div className={styles.actionRow}>
          <Button
            variant="secondary"
            onClick={() => {
              onSaveNote(draft);
              setSaved(true);
            }}
          >
            Guardar nota
          </Button>
          {saved && <span className={styles.savedNote}>Guardada</span>}
        </div>
      </section>
    </div>
  );
}
