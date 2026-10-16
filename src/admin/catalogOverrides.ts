import type { FrameSize, Product } from '../types/product';

/*
 * Cambios del panel sobre el catálogo (DEMOSTRACIÓN): precio, visibilidad, etiquetas e inventario.
 * Se guardan en este navegador y se aplican encima del catálogo base (data/products.ts).
 * El servidor de pagos sigue usando el catálogo base hasta que exista una base de datos.
 */
export interface ProductOverride {
  price?: number;
  hidden?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  /** Unidades por variante "color:talla". Sin clave = inventario sin registrar (no se limita la venta). */
  stock?: Record<string, number>;
}

export type Overrides = Record<string, ProductOverride>;

const STORAGE_KEY = 'lumina.catalog-overrides.v1';

/* Este archivo también lo carga el servidor de pagos (sin navegador): ahí no hay localStorage. */
type KeyValueStore = { getItem(key: string): string | null; setItem(key: string, value: string): void };
const storage = () => (globalThis as { localStorage?: KeyValueStore }).localStorage;

export const variantKey = (colorId: string, size: FrameSize) => `${colorId}:${size}`;

export function readOverrides(): Overrides {
  const store = storage();
  if (!store) return {}; // en el servidor: catálogo base
  try {
    const raw = store.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Overrides) : {};
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

export function writeOverrides(data: Overrides) {
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* sin persistencia en este navegador */
  }
}

export function applyOverrides(base: Product[], overrides: Overrides = readOverrides()): Product[] {
  return base.map((p) => (overrides[p.id] ? { ...p, ...overrides[p.id] } : p));
}

/** Unidades de una variante; undefined = sin registrar. */
export const stockOf = (product: Product, colorId: string, size: FrameSize) =>
  product.stock?.[variantKey(colorId, size)];

export const isSoldOut = (product: Product, colorId: string, size: FrameSize) => stockOf(product, colorId, size) === 0;
