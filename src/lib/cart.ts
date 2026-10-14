import type { ColorVariant, FrameSize, Product } from '../types/product';

/*
 * Lógica de la cesta (sin React).
 *
 * Decisión importante: la cesta guarda SOLO identificadores y cantidades, nunca precios.
 * El precio se lee siempre del catálogo, y en el checkout lo recalculará el servidor:
 * así nadie puede cambiar un precio editando localStorage.
 */

export const MAX_QUANTITY = 10;
export const STORAGE_KEY = 'lumina.cart.v1';

export interface CartLine {
  productId: string;
  colorId: string;
  size: FrameSize;
  quantity: number;
}

export type CartAction =
  | { type: 'add'; line: Omit<CartLine, 'quantity'>; quantity?: number }
  | { type: 'setQuantity'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'replace'; lines: CartLine[] };

/** Una misma montura en otro color o talla es una línea distinta. */
export const lineKey = (l: Pick<CartLine, 'productId' | 'colorId' | 'size'>) => `${l.productId}:${l.colorId}:${l.size}`;

const clamp = (n: number) => Math.max(1, Math.min(MAX_QUANTITY, Math.floor(n)));

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line);
      const qty = action.quantity ?? 1;
      const existing = state.find((l) => lineKey(l) === key);
      if (existing) {
        return state.map((l) => (l === existing ? { ...l, quantity: clamp(l.quantity + qty) } : l));
      }
      return [...state, { ...action.line, quantity: clamp(qty) }];
    }
    case 'setQuantity':
      if (action.quantity < 1) return state.filter((l) => lineKey(l) !== action.key);
      return state.map((l) => (lineKey(l) === action.key ? { ...l, quantity: clamp(action.quantity) } : l));
    case 'remove':
      return state.filter((l) => lineKey(l) !== action.key);
    case 'clear':
      return [];
    case 'replace':
      return action.lines;
  }
}

/* — Unir líneas con el catálogo — */

export interface ResolvedLine extends CartLine {
  key: string;
  product: Product;
  color: ColorVariant;
  lineTotal: number;
}

/** Descarta líneas cuyo producto, color o talla ya no existen en el catálogo. */
export function resolveLines(lines: CartLine[], catalog: Product[]): ResolvedLine[] {
  return lines.flatMap((l) => {
    const product = catalog.find((p) => p.id === l.productId);
    const color = product?.colors.find((c) => c.id === l.colorId);
    if (!product || !color || !product.sizes.includes(l.size)) return [];
    return [{ ...l, key: lineKey(l), product, color, lineTotal: product.price * l.quantity }];
  });
}

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.quantity, 0);
export const cartSubtotal = (lines: ResolvedLine[]) => lines.reduce((n, l) => n + l.lineTotal, 0);

/* — Persistencia — */

/**
 * Lee la cesta guardada sin confiar en ella: localStorage puede estar vacío,
 * bloqueado (modo privado) o contener datos viejos o manipulados.
 */
export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (l): l is CartLine =>
          typeof l === 'object' &&
          l !== null &&
          typeof l.productId === 'string' &&
          typeof l.colorId === 'string' &&
          typeof l.size === 'string' &&
          Number.isFinite(l.quantity) &&
          l.quantity >= 1,
      )
      .map((l) => ({ productId: l.productId, colorId: l.colorId, size: l.size, quantity: clamp(l.quantity) }));
  } catch {
    return [];
  }
}
