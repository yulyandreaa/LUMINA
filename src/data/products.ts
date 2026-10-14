import type { ColorVariant, Product } from '../types/product';

/*
 * ⚠️ CATÁLOGO FICTICIO.
 * Nombres, precios y colores son datos de ejemplo para diseñar.
 * NO representan productos, precios ni inventario reales de LUMINA.
 */

const C = {
  borgona: { id: 'borgona', name: 'Borgoña', hex: '#861f26' },
  vino: { id: 'vino', name: 'Vino', hex: '#4a1f24' },
  rosa: { id: 'rosa', name: 'Rosa empolvado', hex: '#d7a6a0' },
  carey: { id: 'carey', name: 'Carey', hex: '#7a4a2a' },
  negro: { id: 'negro', name: 'Negro', hex: '#1e1a1a' },
  cristal: { id: 'cristal', name: 'Cristal', hex: '#e9dfd6' },
  arena: { id: 'arena', name: 'Arena', hex: '#c9b8a6' },
  dorado: { id: 'dorado', name: 'Dorado', hex: '#b08d57' },
} satisfies Record<string, ColorVariant>;

/* Fotos de producto generadas con IA (Magnific), una por color: public/products/<slug>-<color>.jpg */
const photo = (color: ColorVariant, slug: string): ColorVariant => ({
  ...color,
  image: `/products/${slug}-${color.id}.jpg`,
});

export const products: Product[] = [
  {
    id: 'p-aura',
    slug: 'aura',
    name: 'AURA',
    category: 'monturas',
    shape: 'redonda',
    sizes: ['estrecha', 'media', 'ancha'],
    colors: [photo(C.borgona, 'aura'), photo(C.carey, 'aura'), photo(C.negro, 'aura'), photo(C.cristal, 'aura'), photo(C.rosa, 'aura')],
    price: 420000,
    description: 'Montura redonda de acetato con puente en ojo de cerradura.',
    audience: 'unisex',
    releasedAt: '2025-03-01',
    bestSeller: true,
    fictional: true,
  },
  {
    id: 'p-bruma',
    slug: 'bruma',
    name: 'BRUMA',
    category: 'monturas',
    shape: 'cuadrada',
    sizes: ['media', 'ancha', 'extra-ancha'],
    colors: [photo(C.vino, 'bruma'), photo(C.negro, 'bruma'), photo(C.arena, 'bruma')],
    price: 450000,
    description: 'Cuadrada y rotunda, para quien no pasa desapercibido.',
    audience: 'hombre',
    releasedAt: '2026-09-01',
    isNew: true,
    fictional: true,
  },
  {
    id: 'p-coral',
    slug: 'coral',
    name: 'CORAL',
    category: 'monturas',
    shape: 'cat-eye',
    sizes: ['estrecha', 'media'],
    colors: [photo(C.rosa, 'coral'), photo(C.borgona, 'coral'), photo(C.negro, 'coral')],
    price: 430000,
    description: 'Cat-eye suave con remaches de estrella en las bisagras.',
    audience: 'mujer',
    releasedAt: '2026-09-15',
    isNew: true,
    fictional: true,
  },
  {
    id: 'p-duna',
    slug: 'duna',
    name: 'DUNA',
    category: 'monturas',
    shape: 'geometrica',
    sizes: ['media', 'ancha'],
    colors: [photo(C.arena, 'duna'), photo(C.carey, 'duna'), photo(C.cristal, 'duna')],
    price: 410000,
    description: 'Geometría hexagonal en acetato translúcido.',
    audience: 'unisex',
    releasedAt: '2025-11-10',
    fictional: true,
  },
  {
    id: 'p-elia-sol',
    slug: 'elia-sol',
    name: 'ELIA SOL',
    category: 'gafas-de-sol',
    shape: 'cat-eye',
    sizes: ['estrecha', 'media'],
    colors: [photo(C.borgona, 'elia-sol'), photo(C.negro, 'elia-sol'), photo(C.carey, 'elia-sol')],
    price: 480000,
    description: 'Cat-eye de sol con lentes tintadas en degradado.',
    audience: 'mujer',
    releasedAt: '2026-02-01',
    bestSeller: true,
    fictional: true,
  },
  {
    id: 'p-faro-sol',
    slug: 'faro-sol',
    name: 'FARO SOL',
    category: 'gafas-de-sol',
    shape: 'aviador',
    sizes: ['media', 'ancha'],
    colors: [photo(C.dorado, 'faro-sol'), photo(C.negro, 'faro-sol')],
    price: 520000,
    description: 'Aviador de metal ligero con doble puente.',
    audience: 'unisex',
    releasedAt: '2026-08-20',
    isNew: true,
    fictional: true,
  },
  {
    id: 'p-gala-sol',
    slug: 'gala-sol',
    name: 'GALA SOL',
    category: 'gafas-de-sol',
    shape: 'cuadrada',
    sizes: ['media', 'ancha', 'extra-ancha'],
    colors: [photo(C.negro, 'gala-sol'), photo(C.vino, 'gala-sol'), photo(C.rosa, 'gala-sol')],
    price: 490000,
    description: 'Cuadrada de sol con acetato grueso y lente polarizada.',
    audience: 'hombre',
    releasedAt: '2025-06-01',
    fictional: true,
  },
  {
    id: 'p-iris-sol',
    slug: 'iris-sol',
    name: 'IRIS SOL',
    category: 'gafas-de-sol',
    shape: 'redonda',
    sizes: ['estrecha', 'media'],
    colors: [photo(C.carey, 'iris-sol'), photo(C.cristal, 'iris-sol'), photo(C.borgona, 'iris-sol'), photo(C.rosa, 'iris-sol')],
    price: 470000,
    description: 'La redonda de siempre, ahora para el sol.',
    audience: 'unisex',
    releasedAt: '2025-09-01',
    fictional: true,
  },
];

export const getProductsByCategory = (category: Product['category']) =>
  products.filter((p) => p.category === category);

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
