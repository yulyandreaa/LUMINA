import { useMemo, useState, type FormEvent } from 'react';
import {
  bookingLabels,
  takenSlots,
  useAdminAppointments,
  type Booking,
  type BookingStatus,
} from '../../admin/adminAppointments';
import { stores } from '../../data/stores';
import { dateRange, examReasons, timeSlots, toISODate } from '../../lib/examSchema';
import { normalize } from '../../lib/catalog';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { controlClass } from '../../components/ui/fieldStyles';
import { AdminHead } from './AdminLayout';
import styles from './Admin.module.css';

/*
 * Citas de examen: resumen · filtros (periodo, tienda, búsqueda) · agenda agrupada por día.
 * Al abrir una cita: datos de contacto (llamar, WhatsApp, correo) y acciones según el estado:
 * confirmar, reprogramar (sin chocar con otra cita de la misma tienda), cancelar,
 * y después de la hora: atendida / no asistió.
 */
type Period = 'proximas' | 'hoy' | 'anteriores';

const periods: { id: Period; label: string }[] = [
  { id: 'proximas', label: 'Próximas' },
  { id: 'hoy', label: 'Hoy' },
  { id: 'anteriores', label: 'Anteriores' },
];

const dayFormat = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});
const createdFormat = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
});
const formatDay = (iso: string) => dayFormat.format(new Date(`${iso}T12:00:00`));
const formatTime = (t: string) => {
  const h = Number(t.slice(0, 2));
  return `${h > 12 ? h - 12 : h}:00 ${h < 12 ? 'a. m.' : 'p. m.'}`;
};
const storeName = (id: string) => stores.find((s) => s.id === id)?.name.replace('Tienda LUMINA ', '') ?? id;
const reasonLabel = (r?: string) => examReasons.find((x) => x.value === r)?.label;
const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return toISODate(d);
};

export function AdminAppointmentsPage() {
  usePageTitle('Citas · Administración');
  const { bookings, change } = useAdminAppointments();
  const [period, setPeriod] = useState<Period>('proximas');
  const [store, setStore] = useState<string>('todas');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const today = toISODate(new Date());

  const active = bookings.filter((b) => b.status !== 'cancelada');
  const kpis = [
    { label: 'Hoy', value: active.filter((b) => b.date === today).length },
    {
      label: 'Por confirmar',
      value: bookings.filter((b) => b.status === 'pendiente' && b.date >= today).length,
    },
    {
      label: 'Próximos 7 días',
      value: active.filter((b) => b.date >= today && b.date <= addDays(today, 7)).length,
    },
    {
      label: 'Atendidas este mes',
      value: bookings.filter((b) => b.status === 'atendida' && b.date.slice(0, 7) === today.slice(0, 7)).length,
    },
  ];

  // Agenda filtrada y agrupada por día (próximas en orden; anteriores de la más reciente a la más antigua).
  const days = useMemo(() => {
    const q = normalize(query.trim());
    const list = bookings
      .filter((b) => (period === 'hoy' ? b.date === today : period === 'proximas' ? b.date >= today : b.date < today))
      .filter((b) => store === 'todas' || b.store === store)
      .filter((b) => !q || [b.fullName, b.email, b.phone].some((v) => normalize(v).includes(q)))
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
    if (period === 'anteriores') list.reverse();
    const groups = new Map<string, Booking[]>();
    list.forEach((b) => groups.set(b.date, [...(groups.get(b.date) ?? []), b]));
    return [...groups.entries()];
  }, [bookings, period, store, query, today]);

  const open = bookings.find((b) => b.id === openId) ?? null;

  return (
    <>
      <AdminHead title="Citas de examen" />

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
        <div className={styles.chips} role="group" aria-label="Periodo">
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.chip}
              aria-pressed={period === p.id}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className={styles.filterRow}>
          <select
            className={`${controlClass} ${styles.select}`}
            value={store}
            onChange={(e) => setStore(e.target.value)}
            aria-label="Tienda"
          >
            <option value="todas">Todas las tiendas</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {storeName(s.id)}
              </option>
            ))}
          </select>
          <input
            type="search"
            className={`${controlClass} ${styles.search}`}
            placeholder="Buscar por nombre, correo o celular"
            aria-label="Buscar citas"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {days.length === 0 ? (
        <p className={styles.soon}>
          {bookings.length === 0
            ? 'Aún no hay citas. Aquí aparecerán las que pidan en la página de examen visual.'
            : 'No hay citas con estos filtros.'}
        </p>
      ) : (
        <div className={styles.agenda}>
          {days.map(([date, list]) => (
            <section key={date} className={styles.day}>
              <h2 className={styles.dayTitle}>
                {date === today ? 'Hoy · ' : ''}
                {formatDay(date)}
                <span className={styles.chipCount}>{list.length}</span>
              </h2>
              <ul className={styles.slots}>
                {list.map((b) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      className={styles.slot}
                      data-status={b.status}
                      onClick={() => setOpenId(b.id)}
                    >
                      <span className={styles.slotTime}>{formatTime(b.time)}</span>
                      <span className={styles.slotWho}>
                        <strong>{b.fullName}</strong>
                        <span className={styles.muted}>{reasonLabel(b.reason) ?? 'Sin motivo indicado'}</span>
                      </span>
                      <span className={styles.muted}>{storeName(b.store)}</span>
                      <BookingBadge status={b.status} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <Drawer open={!!open} onClose={() => setOpenId(null)} title="Cita de examen">
        {open && (
          <BookingDetail
            key={`${open.id}-${open.status}-${open.date}-${open.time}`}
            booking={open}
            all={bookings}
            today={today}
            onChange={change}
          />
        )}
      </Drawer>
    </>
  );
}

function BookingBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={styles.badge} data-booking={status}>
      {bookingLabels[status]}
    </span>
  );
}

function BookingDetail({
  booking: b,
  all,
  today,
  onChange,
}: {
  booking: Booking;
  all: Booking[];
  today: string;
  onChange: (id: string, patch: Partial<Booking>) => void;
}) {
  const [moving, setMoving] = useState(false);
  const isPast = b.date < today || (b.date === today && Number(b.time.slice(0, 2)) <= new Date().getHours());
  const isOpen = b.status === 'pendiente' || b.status === 'confirmada';
  const phone = b.phone.replace(/\D/g, '');

  const cancel = () => {
    if (window.confirm(`¿Cancelar la cita de ${b.fullName}? Avísale por teléfono o WhatsApp.`)) {
      onChange(b.id, { status: 'cancelada', cancelledBy: 'tienda' });
    }
  };

  return (
    <div className={styles.detail}>
      <div className={styles.detailTop}>
        <BookingBadge status={b.status} />
        {b.status === 'cancelada' && b.cancelledBy && (
          <span className={styles.muted}>Cancelada por {b.cancelledBy === 'cliente' ? 'el cliente' : 'la tienda'}</span>
        )}
      </div>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Cita</h2>
        <p className={styles.firstUpper}>
          {formatDay(b.date)} · {formatTime(b.time)}
        </p>
        <p className={styles.muted}>Tienda {storeName(b.store)}</p>
        {b.previous && (
          <p className={styles.muted}>
            Reprogramada · antes: {formatDay(b.previous.date)} · {formatTime(b.previous.time)}
          </p>
        )}
        <p className={styles.muted}>Motivo: {reasonLabel(b.reason) ?? 'no indicado'}</p>
        <p className={styles.muted}>Solicitada el {createdFormat.format(new Date(b.createdAt))}</p>
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Cliente</h2>
        <p>{b.fullName}</p>
        <div className={styles.contactLinks}>
          <a href={`tel:+57${phone}`} className={styles.link}>
            {b.phone}
          </a>
          <a href={`https://wa.me/57${phone}`} target="_blank" rel="noreferrer" className={styles.link}>
            WhatsApp
          </a>
          <a href={`mailto:${b.email}`} className={styles.link}>
            {b.email}
          </a>
        </div>
      </section>

      {moving ? (
        <Reschedule booking={b} all={all} onCancel={() => setMoving(false)} onSave={(patch) => onChange(b.id, patch)} />
      ) : (
        isOpen && (
          <div className={styles.actions}>
            {b.status === 'pendiente' && (
              <Button onClick={() => onChange(b.id, { status: 'confirmada' })}>Confirmar cita</Button>
            )}
            {isPast && (
              <div className={styles.actionRow}>
                <Button variant="secondary" onClick={() => onChange(b.id, { status: 'atendida' })}>
                  Marcar atendida
                </Button>
                <button
                  type="button"
                  className={styles.textButton}
                  onClick={() => onChange(b.id, { status: 'no-asistio' })}
                >
                  No asistió
                </button>
              </div>
            )}
            <div className={styles.actionRow}>
              <button type="button" className={styles.textButton} onClick={() => setMoving(true)}>
                Reprogramar
              </button>
              <button type="button" className={styles.textButton} onClick={cancel}>
                Cancelar cita
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* Mover la cita: misma tienda u otra; las horas ya ocupadas aparecen deshabilitadas. */
function Reschedule({
  booking: b,
  all,
  onCancel,
  onSave,
}: {
  booking: Booking;
  all: Booking[];
  onCancel: () => void;
  onSave: (patch: Partial<Booking>) => void;
}) {
  const { min, max } = dateRange();
  const [store, setStore] = useState(b.store);
  const [date, setDate] = useState(b.date >= min ? b.date : min);
  const [time, setTime] = useState(b.time);
  const [error, setError] = useState('');
  const taken = takenSlots(all, store, date, b.id);

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!date || date < min || date > max) return setError('Elige un día entre mañana y los próximos 60 días.');
    if (taken.has(time)) return setError('Esa hora ya está ocupada en esta tienda.');
    // Al mover la cita vuelve a "por confirmar" hasta avisarle al cliente.
    const moved = store !== b.store || date !== b.date || time !== b.time;
    onSave({ store, date, time, status: 'pendiente', ...(moved && { previous: { store: b.store, date: b.date, time: b.time } }) });
  };

  return (
    <form className={styles.actions} onSubmit={save} noValidate>
      <h2 className={styles.detailTitle}>Reprogramar</h2>
      <label className={styles.trackingField}>
        <span className={styles.muted}>Tienda</span>
        <select className={controlClass} value={store} onChange={(e) => setStore(e.target.value)}>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {storeName(s.id)}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.trackingField}>
        <span className={styles.muted}>Día</span>
        <input
          type="date"
          className={controlClass}
          min={min}
          max={max}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label className={styles.trackingField}>
        <span className={styles.muted}>Hora</span>
        <select className={controlClass} value={time} onChange={(e) => setTime(e.target.value)}>
          {timeSlots.map((t) => (
            <option key={t} value={t} disabled={taken.has(t)}>
              {formatTime(t)}
              {taken.has(t) ? ' · ocupada' : ''}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.actionRow}>
        <Button type="submit">Guardar nueva fecha</Button>
        <button type="button" className={styles.textButton} onClick={onCancel}>
          Volver
        </button>
      </div>
    </form>
  );
}
