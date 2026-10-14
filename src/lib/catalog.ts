import type { Audience, FrameShape, FrameSize, Product } from '../types/product';

/*
 * Lógica del catálogo: filtrar, ordenar, contar y buscar.
 * Son funciones PURAS (mismo input → mismo output, sin React ni URL),
 * por eso se pueden probar con tests unitarios (catalog.test.ts).
 */

export interface Filters {
  colors: string[];
  shapes: FrameShape[];
  sizes: FrameSize[];
  audience?: Exclude<Audience, 'unisex'>;
}

export const emptyFilters: Filters = { colors: [], shapes: [], sizes: [] };

export type SortKey =
  | 'destacados'
  | 'relevancia'
  | 'mas-vendidos'
  | 'novedades'
  | 'antiguos'
  | 'a-z'
  | 'z-a'
  | 'precio-asc'
  | 'precio-desc';

export const sortOptions: { value: SortKey; label: string; searchOnly?: boolean }[] = [
  { value: 'destacados', label: 'Destacados' },
  { value: 'relevancia', label: 'Más relevantes', searchOnly: true },
  { value: 'mas-vendidos', label: 'Más vendidos' },
  { value: 'novedades', label: 'Fecha: más reciente' },
  { value: 'antiguos', label: 'Fecha: más antiguo' },
  { value: 'a-z', label: 'Alfabéticamente, A-Z' },
  { value: 'z-a', label: 'Alfabéticamente, Z-A' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
];

export const shapeLabels: Record<FrameShape, string> = {
  redonda: 'Redonda',
  cuadrada: 'Cuadrada',
  aviador: 'Aviador',
  'cat-eye': 'Cat-eye',
  geometrica: 'Geométrica',
};

export const sizeLabels: Record<FrameSize, string> = {
  estrecha: 'Estrecha',
  media: 'Media',
  ancha: 'Ancha',
  'extra-ancha': 'Extra ancha',
};

/* — Filtrar — */

type Group = 'colors' | 'shapes' | 'sizes';

function matchesGroup(p: Product, f: Filters, group: Group): boolean {
  if (group === 'colors') return f.colors.length === 0 || p.colors.some((c) => f.colors.includes(c.id));
  if (group === 'shapes') return f.shapes.length === 0 || f.shapes.includes(p.shape);
  return f.sizes.length === 0 || p.sizes.some((s) => f.sizes.includes(s));
}

function matchesAudience(p: Product, f: Filters): boolean {
  return !f.audience || p.audience === f.audience || p.audience === 'unisex';
}

/** Dentro de un grupo las opciones se suman (O); entre grupos se combinan (Y). */
export function filterProducts(list: Product[], f: Filters, except?: Group): Product[] {
  return list.filter(
    (p) =>
      matchesAudience(p, f) &&
      (['colors', 'shapes', 'sizes'] as Group[]).every((g) => g === except || matchesGroup(p, f, g)),
  );
}

/* — Contar (el número entre paréntesis de cada opción) — */

export interface FacetOption {
  value: string;
  label: string;
  count: number;
  hex?: string;
}

/**
 * Cada grupo cuenta teniendo en cuenta los OTROS grupos ya filtrados,
 * así el número indica cuántos resultados verías si marcas esa opción.
 */
export function getFacets(list: Product[], f: Filters) {
  const colorMap = new Map<string, FacetOption>();
  for (const p of filterProducts(list, f, 'colors')) {
    for (const c of p.colors) {
      const prev = colorMap.get(c.id);
      colorMap.set(c.id, { value: c.id, label: c.name, hex: c.hex, count: (prev?.count ?? 0) + 1 });
    }
  }

  const count = <K extends string>(items: Product[], keysOf: (p: Product) => K[], labels: Record<K, string>) =>
    (Object.keys(labels) as K[])
      .map((k) => ({ value: k, label: labels[k], count: items.filter((p) => keysOf(p).includes(k)).length }))
      .filter((o) => o.count > 0);

  return {
    colors: [...colorMap.values()].sort((a, b) => b.count - a.count),
    shapes: count(filterProducts(list, f, 'shapes'), (p) => [p.shape], shapeLabels),
    sizes: count(filterProducts(list, f, 'sizes'), (p) => p.sizes, sizeLabels),
  };
}

/* — Ordenar — */

export function sortProducts(list: Product[], key: SortKey): Product[] {
  const sorted = [...list]; // nunca mutar el array original
  const byDate = (a: Product, b: Product) => a.releasedAt.localeCompare(b.releasedAt);
  switch (key) {
    case 'mas-vendidos':
      return sorted.sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller));
    case 'novedades':
      return sorted.sort((a, b) => byDate(b, a));
    case 'antiguos':
      return sorted.sort(byDate);
    case 'a-z':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    case 'z-a':
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'es'));
    case 'precio-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'precio-desc':
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted; // destacados / relevancia: orden de origen
  }
}

/* — Buscar — */

/** Minúsculas y sin tildes: "Geométrica" → "geometrica". */
export const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

const searchText = (p: Product) =>
  normalize(
    [
      p.name,
      p.description,
      shapeLabels[p.shape],
      p.category === 'gafas-de-sol' ? 'gafas de sol' : 'monturas gafas',
      ...p.colors.map((c) => c.name),
    ].join(' '),
  );

/** Todas las palabras de la consulta deben aparecer; el nombre puntúa más. */
export function searchProducts(list: Product[], query: string): Product[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return list
    .map((p) => {
      const text = searchText(p);
      const name = normalize(p.name);
      if (!words.every((w) => text.includes(w))) return null;
      const score = words.reduce((acc, w) => acc + (name.includes(w) ? 3 : 1), 0);
      return { p, score };
    })
    .filter((r): r is { p: Product; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}

/* — URL ⇄ filtros — */

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

export function filtersFromParams(params: URLSearchParams): Filters {
  const audience = params.get('para');
  return {
    colors: list(params.get('color')),
    shapes: list(params.get('forma')).filter((s): s is FrameShape => s in shapeLabels),
    sizes: list(params.get('talla')).filter((s): s is FrameSize => s in sizeLabels),
    audience: audience === 'mujer' || audience === 'hombre' ? audience : undefined,
  };
}

export function sortFromParams(params: URLSearchParams, fallback: SortKey): SortKey {
  const v = params.get('orden');
  return sortOptions.some((o) => o.value === v) ? (v as SortKey) : fallback;
}

export const activeFilterCount = (f: Filters) =>
  f.colors.length + f.shapes.length + f.sizes.length + (f.audience ? 1 : 0);
