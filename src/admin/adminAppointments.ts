import { useCallback, useEffect, useState } from 'react';
import type { Appointment } from '../auth/useAccountData';

/*
 * Agenda de exámenes visuales del panel (DEMOSTRACIÓN): se guarda en este navegador.
 * Toda solicitud del formulario /examen-visual llega aquí (con o sin sesión de cliente);
 * si el cliente cancela desde "Mis citas", aquí queda como cancelada (mismo id).
 * Al conectar una base de datos o un software de agenda, solo cambia este archivo.
 */
export type BookingStatus = 'pendiente' | 'confirmada' | 'atendida' | 'no-asistio' | 'cancelada';

export interface Booking extends Appointment {
  status: BookingStatus;
  /** Quién canceló, para que el equipo (y el cliente) lo sepan. */
  cancelledBy?: 'cliente' | 'tienda';
  /** Fecha anterior si la tienda reprogramó la cita (el cliente lo ve en "Mis citas"). */
  previous?: { store: string; date: string; time: string };
}

export const bookingLabels: Record<BookingStatus, string> = {
  pendiente: 'Por confirmar',
  confirmada: 'Confirmada',
  atendida: 'Atendida',
  'no-asistio': 'No asistió',
  cancelada: 'Cancelada',
};

const STORAGE_KEY = 'lumina.admin-appointments.v1';
const EVENT = 'lumina:admin-appointments';

function read(): Booking[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Booking[]) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function write(list: Booking[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* sin persistencia en este navegador */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Lo llama el formulario de examen visual al recibir una solicitud válida. */
export function addBooking(appointment: Appointment) {
  write([...read(), { ...appointment, status: 'pendiente' }]);
}

/** Lo llama "Mis citas" cuando el cliente cancela. */
export function cancelBookingByCustomer(id: string) {
  write(read().map((b) => (b.id === id ? { ...b, status: 'cancelada', cancelledBy: 'cliente' } : b)));
}

/** Horas ya ocupadas en una tienda y día (sin contar canceladas ni la cita que se está moviendo). */
export function takenSlots(list: Booking[], store: string, date: string, exceptId?: string) {
  return new Set(
    list.filter((b) => b.store === store && b.date === date && b.status !== 'cancelada' && b.id !== exceptId).map((b) => b.time),
  );
}

export function useAdminAppointments() {
  const [bookings, setBookings] = useState<Booking[]>(read);

  // Si otra pestaña (o el formulario) agrega una cita, el panel se actualiza solo.
  useEffect(() => {
    const sync = () => setBookings(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const change = useCallback((id: string, patch: Partial<Booking>) => {
    write(read().map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }, []);

  return { bookings, change };
}
