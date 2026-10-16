import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useAccountData } from '../../auth/useAccountData';
import { cancelBookingByCustomer, useAdminAppointments, type Booking } from '../../admin/adminAppointments';
import { stores } from '../../data/stores';
import { examReasons, toISODate } from '../../lib/examSchema';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/ui/Button';
import { SectionHead } from './AccountLayout';
import styles from './Account.module.css';

/*
 * Mis citas: las citas de examen visual del cliente, con el estado que les da la tienda
 * desde el panel (por confirmar, confirmada, reprogramada, cancelada, atendida).
 * Se leen de la misma agenda del panel, por correo, así incluyen las pedidas sin sesión.
 * Próximas arriba (se pueden cancelar, con confirmación) y el historial abajo.
 */
const formatTime = (t: string) => {
  const h = Number(t.slice(0, 2));
  return `${h > 12 ? h - 12 : h}:00 ${h < 12 ? 'a. m.' : 'p. m.'}`;
};
const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
const storeName = (id: string) => stores.find((s) => s.id === id)?.name ?? id;

/** Lo que ve el cliente según el estado que puso la tienda. */
function statusText(b: Booking): { label: string; note?: string } {
  switch (b.status) {
    case 'pendiente':
      return b.previous
        ? { label: 'Reprogramada', note: 'La tienda cambió la fecha de tu cita. Te contactaremos para confirmarla.' }
        : { label: 'Por confirmar', note: 'Te contactaremos para confirmar tu cita.' };
    case 'confirmada':
      return { label: 'Confirmada', note: b.previous ? 'La tienda cambió la fecha y ya está confirmada.' : undefined };
    case 'atendida':
      return { label: 'Atendida' };
    case 'no-asistio':
      return { label: 'No asististe' };
    case 'cancelada':
      return { label: 'Cancelada', note: b.cancelledBy === 'tienda' ? 'La tienda canceló esta cita.' : 'Cancelaste esta cita.' };
  }
}

export function AppointmentsPage() {
  usePageTitle('Mis citas');
  const { customer } = useAuth();
  const { data, update } = useAccountData();
  const { bookings } = useAdminAppointments();
  const today = toISODate(new Date());
  const email = customer?.email.trim().toLowerCase();

  // Agenda de la tienda + citas guardadas antes en la cuenta que no estén en la agenda.
  const fromStore = bookings.filter((b) => b.email.trim().toLowerCase() === email);
  const legacy: Booking[] = data.appointments
    .filter((a) => !fromStore.some((b) => b.id === a.id))
    .map((a) => ({ ...a, status: 'pendiente' }));
  const all = [...fromStore, ...legacy];

  const isUpcoming = (b: Booking) => b.date >= today && (b.status === 'pendiente' || b.status === 'confirmada');
  const byDate = (a: Booking, b: Booking) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`);
  const upcoming = all.filter(isUpcoming).sort(byDate);
  const history = all.filter((b) => !isUpcoming(b)).sort((a, b) => byDate(b, a));

  const cancel = (id: string) => {
    update((d) => ({ ...d, appointments: d.appointments.filter((a) => a.id !== id) }));
    cancelBookingByCustomer(id); // la tienda la ve cancelada en el panel
  };

  return (
    <>
      <SectionHead title="Mis citas">
        <Button to="/examen-visual" variant="secondary" withArrow>
          Agendar examen visual
        </Button>
      </SectionHead>

      {all.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Aún no tienes citas.</p>
          <p className={styles.muted}>Agenda tu examen visual y aparecerá aquí.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <ul className={styles.list}>
              {upcoming.map((b) => (
                <AppointmentCard key={b.id} booking={b} onCancel={() => cancel(b.id)} />
              ))}
            </ul>
          )}
          {history.length > 0 && (
            <>
              <h2 className={styles.subTitle}>Historial</h2>
              <ul className={styles.list}>
                {history.map((b) => (
                  <AppointmentCard key={b.id} booking={b} />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </>
  );
}

function AppointmentCard({ booking: b, onCancel }: { booking: Booking; onCancel?: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const date = new Date(`${b.date}T12:00:00`);
  const reason = examReasons.find((r) => r.value === b.reason)?.label;
  const { label, note } = statusText(b);

  return (
    <li className={`${styles.card} ${styles.appointment}`} data-past={!onCancel}>
      <div className={styles.calendar} aria-hidden="true">
        <span>{date.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')}</span>
        <strong>{date.getDate()}</strong>
      </div>
      <div className={styles.appointmentInfo}>
        <p className={styles.cardTitle}>
          Examen visual
          <span className={styles.badge} data-booking={b.status} data-rescheduled={!!b.previous && b.status === 'pendiente'}>
            {label}
          </span>
        </p>
        <p className={b.status === 'cancelada' ? styles.struck : undefined}>
          {longDate(b.date)} · {formatTime(b.time)}
        </p>
        <p className={styles.muted}>
          {storeName(b.store)}
          {reason && ` · ${reason}`}
        </p>
        {b.previous && b.status !== 'cancelada' && (
          <p className={styles.muted}>
            Antes: {longDate(b.previous.date)} · {formatTime(b.previous.time)}
            {b.previous.store !== b.store && ` · ${storeName(b.previous.store)}`}
          </p>
        )}
        {note && <p className={styles.statusNote}>{note}</p>}
      </div>
      {onCancel && (
        <div className={styles.appointmentActions}>
          {confirming ? (
            <>
              <span className={styles.muted}>¿Cancelar la cita?</span>
              <button type="button" className={styles.danger} onClick={onCancel}>
                Sí, cancelar
              </button>
              <button type="button" className="text-link" onClick={() => setConfirming(false)}>
                No
              </button>
            </>
          ) : (
            <button type="button" className="text-link" onClick={() => setConfirming(true)}>
              Cancelar cita
            </button>
          )}
        </div>
      )}
    </li>
  );
}
