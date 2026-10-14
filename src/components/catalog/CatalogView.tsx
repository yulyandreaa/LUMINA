import { useCallback, useMemo, useState } from 'react';
import type { Product } from '../../types/product';
import {
  activeFilterCount,
  filterProducts,
  getFacets,
  shapeLabels,
  sizeLabels,
  sortOptions,
  sortProducts,
  type SortKey,
} from '../../lib/catalog';
import { useCatalogParams, type ParamKey } from '../../hooks/useCatalogParams';
import { ProductCard } from '../product/ProductCard';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { FilterPanel } from './FilterPanel';
import styles from './CatalogView.module.css';

/*
 * Vista de catálogo reutilizable (listados por categoría y resultados de búsqueda):
 * barra de herramientas · filtros (lateral o panel móvil) · etiquetas activas · rejilla.
 */
interface CatalogViewProps {
  products: Product[];
  defaultSort: SortKey;
  isSearch?: boolean;
}

export function CatalogView({ products, defaultSort, isSearch = false }: CatalogViewProps) {
  const { filters, sort, toggle, setSort, clearAll } = useCatalogParams(defaultSort);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // useMemo: solo recalcula cuando cambian productos, filtros u orden.
  const visible = useMemo(
    () => sortProducts(filterProducts(products, filters), sort),
    [products, filters, sort],
  );
  const facets = useMemo(() => getFacets(products, filters), [products, filters]);
  const activeCount = activeFilterCount(filters);

  const groups = [
    { key: 'forma' as const, title: 'Forma', options: facets.shapes, selected: filters.shapes },
    { key: 'talla' as const, title: 'Talla', options: facets.sizes, selected: filters.sizes },
    { key: 'color' as const, title: 'Color', options: facets.colors, selected: filters.colors },
  ];

  const colorName = (id: string) =>
    products.flatMap((p) => p.colors).find((c) => c.id === id)?.name ?? id;

  const chips: { key: ParamKey; value: string; label: string }[] = [
    ...filters.shapes.map((v) => ({ key: 'forma' as const, value: v, label: shapeLabels[v] })),
    ...filters.sizes.map((v) => ({ key: 'talla' as const, value: v, label: sizeLabels[v] })),
    ...filters.colors.map((v) => ({ key: 'color' as const, value: v, label: colorName(v) })),
    ...(filters.audience
      ? [{ key: 'para' as const, value: filters.audience, label: filters.audience === 'mujer' ? 'Mujer' : 'Hombre' }]
      : []),
  ];

  const countLabel = `${visible.length} ${visible.length === 1 ? 'producto' : 'productos'}`;

  return (
    <div className={`container ${styles.layout}`}>
      <aside className={styles.sidebar} aria-label="Filtros">
        <p className={styles.sidebarTitle}>Filtrar</p>
        <FilterPanel groups={groups} onToggle={toggle} />
      </aside>

      <div>
        <div className={styles.toolbar}>
          <button className={styles.filterButton} onClick={() => setDrawerOpen(true)}>
            Filtrar{activeCount > 0 && ` (${activeCount})`}
          </button>
          <p className={styles.count} aria-live="polite">
            {countLabel}
          </p>
          <label className={styles.sort}>
            <span>Ordenar por:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {sortOptions
                .filter((o) => isSearch || !o.searchOnly)
                .map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </select>
          </label>
        </div>

        {chips.length > 0 && (
          <ul className={styles.chips} aria-label="Filtros activos">
            {chips.map((c) => (
              <li key={`${c.key}-${c.value}`}>
                <button className={styles.chip} onClick={() => toggle(c.key, c.value)} aria-label={`Quitar filtro ${c.label}`}>
                  {c.label}
                  <Icon name="close" size={12} />
                </button>
              </li>
            ))}
            <li>
              <button className={styles.clear} onClick={clearAll}>
                Borrar todo
              </button>
            </li>
          </ul>
        )}

        {visible.length > 0 ? (
          <ul className={styles.grid}>
            {visible.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No hay productos con estos filtros.</p>
            <p>Prueba a quitar alguno o explora todo el catálogo.</p>
            {activeCount > 0 && (
              <Button variant="secondary" onClick={clearAll}>
                Borrar filtros
              </Button>
            )}
          </div>
        )}
      </div>

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title="Filtrar"
        side="left"
        footer={
          <div className={styles.drawerActions}>
            <Button variant="secondary" onClick={clearAll} disabled={activeCount === 0}>
              Borrar
            </Button>
            <Button onClick={closeDrawer}>Ver {countLabel}</Button>
          </div>
        }
      >
        <FilterPanel groups={groups} onToggle={toggle} />
      </Drawer>
    </div>
  );
}
