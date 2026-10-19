import type { Product } from '../types/product';

/*
 * Productos subidos desde el panel (DEMOSTRACIÓN): se guardan completos en este navegador,
 * fotos incluidas (comprimidas como imagen JPEG dentro del texto guardado).
 * Se suman al catálogo base; precio, visibilidad e inventario se editan igual que los demás (catalogOverrides).
 * El servidor de pagos (Wompi) no los conoce hasta que exista una base de datos.
 */
const STORAGE_KEY = 'lumina.custom-products.v1';

/* Este archivo también lo carga el servidor de pagos (sin navegador): ahí no hay localStorage. */
type KeyValueStore = { getItem(key: string): string | null; setItem(key: string, value: string): void };
const storage = () => (globalThis as { localStorage?: KeyValueStore }).localStorage;

export function readCustomProducts(): Product[] {
  const store = storage();
  if (!store) return [];
  try {
    const raw = store.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Product[]) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Devuelve false si el navegador no tiene espacio (las fotos ocupan bastante). */
export function writeCustomProducts(list: Product[]): boolean {
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

export const isCustomProduct = (id: string) => id.startsWith('c-');

/** "Montura Ámbar 2" → "montura-ambar-2" */
export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
