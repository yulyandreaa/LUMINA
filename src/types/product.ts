/*
 * Modelo de datos del catálogo.
 * Pensado para que mañana los datos vengan de una API sin cambiar los componentes.
 */

export type Category = 'monturas' | 'gafas-de-sol';
export type FrameShape = 'redonda' | 'cuadrada' | 'aviador' | 'cat-eye' | 'geometrica';
export type FrameSize = 'estrecha' | 'media' | 'ancha' | 'extra-ancha';
export type Audience = 'unisex' | 'mujer' | 'hombre';

export interface ColorVariant {
  /** Identificador estable para URL y cesta, p. ej. "borgona". */
  id: string;
  name: string;
  /** Color del acetato para pintar muestras e ilustraciones. */
  hex: string;
  /** Foto real del producto en este color (si existe). */
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  shape: FrameShape;
  sizes: FrameSize[];
  colors: ColorVariant[];
  /** Precio en pesos colombianos, entero (COP no usa decimales). */
  price: number;
  description: string;
  audience: Audience;
  /** Fecha de lanzamiento (ISO) para ordenar por novedad. */
  releasedAt: string;
  isNew?: boolean;
  bestSeller?: boolean;
  /** true = producto de ejemplo, no existe en inventario real. */
  fictional: boolean;
}
