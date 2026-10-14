import { describe, expect, it } from 'vitest';
import { products } from '../data/products';
import {
  emptyFilters,
  filterProducts,
  filtersFromParams,
  getFacets,
  normalize,
  searchProducts,
  sortProducts,
} from './catalog';

const names = (list: { name: string }[]) => list.map((p) => p.name);

describe('filterProducts', () => {
  it('sin filtros devuelve todo', () => {
    expect(filterProducts(products, emptyFilters)).toHaveLength(products.length);
  });

  it('dentro de un grupo suma opciones (O)', () => {
    const r = filterProducts(products, { ...emptyFilters, shapes: ['redonda', 'aviador'] });
    expect(names(r).sort()).toEqual(['AURA', 'FARO SOL', 'IRIS SOL']);
  });

  it('entre grupos combina (Y)', () => {
    const r = filterProducts(products, { ...emptyFilters, shapes: ['redonda'], colors: ['negro'] });
    expect(names(r)).toEqual(['AURA']);
  });

  it('"mujer" incluye unisex pero no hombre', () => {
    const r = filterProducts(products, { ...emptyFilters, audience: 'mujer' });
    expect(r.every((p) => p.audience !== 'hombre')).toBe(true);
    expect(r.some((p) => p.audience === 'unisex')).toBe(true);
  });
});

describe('getFacets', () => {
  it('el recuento de un grupo ignora su propio filtro', () => {
    const f = { ...emptyFilters, shapes: ['redonda' as const] };
    const shapes = getFacets(products, f).shapes;
    // Aunque "redonda" está marcada, el resto de formas siguen con su número.
    expect(shapes.find((s) => s.value === 'cuadrada')?.count).toBe(2);
  });
});

describe('sortProducts', () => {
  it('ordena por precio sin mutar el original', () => {
    const before = names(products);
    const sorted = sortProducts(products, 'precio-asc');
    expect(sorted[0].price).toBeLessThanOrEqual(sorted[1].price);
    expect(names(products)).toEqual(before);
  });

  it('novedades pone primero la fecha más reciente', () => {
    expect(sortProducts(products, 'novedades')[0].name).toBe('CORAL');
  });
});

describe('searchProducts', () => {
  it('ignora tildes y mayúsculas', () => {
    expect(normalize('Geométrica')).toBe('geometrica');
    expect(names(searchProducts(products, 'GEOMETRICA'))).toEqual(['DUNA']);
  });

  it('exige todas las palabras', () => {
    expect(names(searchProducts(products, 'sol aviador'))).toEqual(['FARO SOL']);
  });

  it('consulta vacía no devuelve nada', () => {
    expect(searchProducts(products, '   ')).toEqual([]);
  });
});

describe('filtersFromParams', () => {
  it('lee valores separados por coma y descarta los inválidos', () => {
    const f = filtersFromParams(new URLSearchParams('forma=redonda,triangulo&talla=media&para=otro'));
    expect(f.shapes).toEqual(['redonda']);
    expect(f.sizes).toEqual(['media']);
    expect(f.audience).toBeUndefined();
  });
});
