import { createContext, useContext } from 'react';
import type { CartLine, ResolvedLine } from '../lib/cart';

/*
 * Contrato de la cesta para toda la app.
 * Cualquier componente la usa con: const cart = useCart();
 */
export interface CartContextValue {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
