import { useCallback, useEffect, useState } from 'react';
import { seedAdminOrders, type AdminOrder, type AdminOrderStatus } from '../data/adminOrders';

/*
 * Pedidos de la tienda (DEMOSTRACIÓN): se guardan en este navegador.
 * Los crea el pago simulado del checkout; el panel los gestiona y "Mis pedidos" del cliente
 * los lee filtrando por su correo, así ambos ven el mismo estado.
 * Al conectar la base de datos, solo cambia este archivo; las pantallas no.
 */
// v2: se borró el historial de ejemplo (v1 tenía 12 pedidos inventados).
const STORAGE_KEY = 'lumina.admin-orders.v2';
const EVENT = 'lumina:orders';

export function readOrders(): AdminOrder[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as AdminOrder[]) : null;
    return Array.isArray(data) ? data : seedAdminOrders;
  } catch {
    return seedAdminOrders;
  }
}

function writeOrders(list: AdminOrder[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* sin persistencia en este navegador */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Lo llama el checkout cuando el pago (simulado) se aprueba. */
export function addOrder(order: AdminOrder) {
  writeOrders([...readOrders(), order]);
}

/** Número consecutivo del próximo pedido: LUM-1001, LUM-1002… */
export function nextOrderId() {
  const max = readOrders().reduce((n, o) => Math.max(n, Number(o.id.replace(/\D/g, '')) || 0), 1000);
  return `LUM-${max + 1}`;
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>(readOrders);

  // Pedidos nuevos o cambios hechos en otra pestaña se ven sin recargar.
  useEffect(() => {
    const sync = () => setOrders(readOrders());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setStatus = useCallback((id: string, status: AdminOrderStatus, tracking?: string) => {
    writeOrders(
      readOrders().map((o) =>
        o.id === id
          ? {
              ...o,
              status,
              tracking: tracking ?? o.tracking,
              history: [...o.history, { status, at: new Date().toISOString() }],
            }
          : o,
      ),
    );
  }, []);

  return { orders, setStatus };
}

/* Borra lo que quedó guardado de la versión con pedidos de ejemplo. */
try {
  window.localStorage.removeItem('lumina.admin-orders.v1');
} catch {
  /* nada que borrar */
}
