import { useCallback, useState } from 'react';
import type { AccountData } from '../auth/useAccountData';
import type { AdminOrder } from '../data/adminOrders';
import type { Booking } from './adminAppointments';

/*
 * Clientes del panel (DEMOSTRACIÓN): no hay una lista aparte, se arma juntando por correo
 * las cuentas creadas en la tienda, los pedidos y las citas de examen de este navegador.
 * Las notas internas del equipo sí se guardan aparte (el cliente nunca las ve).
 * Con una base de datos real, esto será una consulta al servidor.
 */
export interface Customer {
  email: string;
  name: string;
  phone?: string;
  document?: string;
  city?: string;
  hasAccount: boolean;
  account?: AccountData;
  orders: AdminOrder[];
  bookings: Booking[];
  /** Fecha ISO de la última compra, cita o solicitud. */
  lastActivity?: string;
}

const ACCOUNT_PREFIX = 'lumina.account.v1:';
const NOTES_KEY = 'lumina.admin-customer-notes.v1';

/** Todas las cuentas de cliente guardadas en este navegador. */
function readAccounts(): Map<string, AccountData> {
  const accounts = new Map<string, AccountData>();
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key?.startsWith(ACCOUNT_PREFIX)) continue;
      const data = JSON.parse(window.localStorage.getItem(key) ?? 'null') as AccountData | null;
      if (data) accounts.set(key.slice(ACCOUNT_PREFIX.length), data);
    }
  } catch {
    /* sin acceso al almacenamiento */
  }
  return accounts;
}

export function buildCustomers(orders: AdminOrder[], bookings: Booking[]): Customer[] {
  const map = new Map<string, Customer>();
  const get = (email: string, name: string) => {
    const key = email.trim().toLowerCase();
    let c = map.get(key);
    if (!c) {
      c = { email: key, name, hasAccount: false, orders: [], bookings: [] };
      map.set(key, c);
    }
    return c;
  };
  const touch = (c: Customer, iso: string) => {
    if (!c.lastActivity || iso > c.lastActivity) c.lastActivity = iso;
  };

  readAccounts().forEach((account, email) => {
    const p = account.profile;
    const c = get(email, [p.firstName, p.lastName].filter(Boolean).join(' '));
    c.hasAccount = true;
    c.account = account;
    c.phone = p.phone;
    c.document = p.legalId ? `${p.legalIdType ?? ''} ${p.legalId}`.trim() : undefined;
    c.city = (account.addresses.find((a) => a.isDefault) ?? account.addresses[0])?.city;
  });

  orders.forEach((o) => {
    const c = get(o.customer.email, o.customer.name);
    c.orders.push(o);
    c.name ||= o.customer.name;
    c.phone ||= o.customer.phone;
    c.document ||= o.customer.document;
    if (o.delivery.type === 'envio') c.city ||= o.delivery.city;
    touch(c, o.createdAt);
  });

  bookings.forEach((b) => {
    const c = get(b.email, b.fullName);
    c.bookings.push(b);
    c.name ||= b.fullName;
    c.phone ||= b.phone;
    touch(c, b.createdAt);
  });

  return [...map.values()].map((c) => ({ ...c, name: c.name || c.email }));
}

function readNotes(): Record<string, string> {
  try {
    return JSON.parse(window.localStorage.getItem(NOTES_KEY) ?? '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

export function useCustomerNotes() {
  const [notes, setNotes] = useState<Record<string, string>>(readNotes);

  const saveNote = useCallback((email: string, text: string) => {
    setNotes((prev) => {
      const next = { ...prev };
      if (text.trim()) next[email] = text.trim();
      else delete next[email];
      try {
        window.localStorage.setItem(NOTES_KEY, JSON.stringify(next));
      } catch {
        /* sin persistencia */
      }
      return next;
    });
  }, []);

  return { notes, saveNote };
}
