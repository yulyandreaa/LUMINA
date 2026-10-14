import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { products } from '../data/products';
import {
  STORAGE_KEY,
  cartCount,
  cartReducer,
  cartSubtotal,
  parseStoredCart,
  resolveLines,
  type CartLine,
} from '../lib/cart';
import { CartContext, type CartContextValue } from './CartContext';

/*
 * Proveedor de la cesta:
 * - useReducer con el reducer puro de lib/cart.ts
 * - carga inicial desde localStorage y guardado en cada cambio
 * - sincroniza entre pestañas abiertas (evento "storage")
 */
function readStorage(): CartLine[] {
  try {
    return parseStoredCart(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return []; // localStorage bloqueado (p. ej. algunos modos privados)
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // El tercer argumento inicializa el estado una sola vez (lazy init).
  const [state, dispatch] = useReducer(cartReducer, undefined, readStorage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* sin persistencia: la cesta sigue funcionando en memoria */
    }
  }, [state]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) dispatch({ type: 'replace', lines: parseStoredCart(e.newValue) });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback<CartContextValue['add']>(
    (line, quantity) => dispatch({ type: 'add', line, quantity }),
    [],
  );
  const setQuantity = useCallback((key: string, quantity: number) => dispatch({ type: 'setQuantity', key, quantity }), []);
  const remove = useCallback((key: string) => dispatch({ type: 'remove', key }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = resolveLines(state, products);
    return {
      lines,
      count: cartCount(lines),
      subtotal: cartSubtotal(lines),
      add,
      setQuantity,
      remove,
      clear,
      isOpen,
      open,
      close,
    };
  }, [state, isOpen, add, setQuantity, remove, clear, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
