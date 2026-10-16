import { useMemo, useState, type FormEvent } from 'react';
import {
  applyOverrides,
  readOverrides,
  variantKey,
  writeOverrides,
  type Overrides,
  type ProductOverride,
} from '../../admin/catalogOverrides';
import { baseProducts } from '../../data/products';
import { sizeGuide } from '../../data/sizes';
import { normalize } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import type { Category, Product } from '../../types/product';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { controlClass } from '../../components/ui/fieldStyles';
import { AdminHead } from './AdminLayout';
import styles from './Admin.module.css';

/*
 * Productos e inventario: resumen · filtros · tabla del catálogo.
 * Al abrir un producto: precio, visible en la tienda, etiquetas (Nuevo / Más vendido)
 * y unidades por color y talla. Una casilla vacía = inventario sin registrar (se puede vender).
 * Con 0 unidades la tienda muestra esa variante como agotada.
 */
type CategoryFilter = Category | 'todos';
type AlertFilter = 'agotados' | 'bajo' | null;

const categoryLabels: Record<Category, string> = {
  monturas: 'Monturas',
  'gafas-de-sol': 'Gafas de sol',
};

/* Límite de "stock bajo": lo elige el equipo y se recuerda en este navegador. */
const THRESHOLD_KEY = 'lumina.low-stock-threshold.v1';
const thresholdOptions = [1, 2, 3, 4, 5, 10];

function readThreshold() {
  try {
    const n = Number(window.localStorage.getItem(THRESHOLD_KEY));
    return thresholdOptions.includes(n) ? n : 2;
  } catch {
    return 2;
  }
}

interface VariantRow {
  product: Product;
  colorName: string;
  image?: string;
  sizeLabel: string;
  units: number;
}

/** Resumen del inventario registrado de un producto, con el detalle de las variantes en alerta. */
function stockSummary(p: Product, low: number) {
  const rows = p.colors.flatMap((c) =>
    p.sizes.flatMap((s) => {
      const units = p.stock?.[variantKey(c.id, s)];
      const row: VariantRow = { product: p, colorName: c.name, image: c.image, sizeLabel: sizeGuide[s].label, units: units ?? 0 };
      return units === undefined ? [] : [row];
    }),
  );
  return {
    tracked: rows.length > 0,
    registered: rows.length,
    total: p.colors.length * p.sizes.length,
    units: rows.reduce((n, r) => n + r.units, 0),
    soldOut: rows.filter((r) => r.units === 0),
    low: rows.filter((r) => r.units > 0 && r.units <= low),
  };
}

export function AdminProductsPage() {
  usePageTitle('Productos · Administración');
  const [overrides, setOverrides] = useState<Overrides>(readOverrides);
  const [category, setCategory] = useState<CategoryFilter>('todos');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertFilter>(null);
  const [lowStock, setLowStock] = useState(readThreshold);
  // Producto recién guardado (el editor se vuelve a montar con los valores guardados).
  const [savedId, setSavedId] = useState<string | null>(null);

  const catalog = useMemo(() => applyOverrides(baseProducts, overrides), [overrides]);

  const save = (id: string, override: ProductOverride | null) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (override) next[id] = override;
      else delete next[id];
      writeOverrides(next);
      return next;
    });
    setSavedId(id);
  };

  // Interruptor de la tabla: cambia solo la visibilidad y conserva los demás cambios del producto.
  const toggleVisible = (id: string) => {
    setOverrides((prev) => {
      const { hidden, ...rest } = prev[id] ?? {};
      const next = { ...prev };
      const override = hidden ? rest : { ...rest, hidden: true };
      if (Object.keys(override).length) next[id] = override;
      else delete next[id];
      writeOverrides(next);
      return next;
    });
  };

  const changeThreshold = (n: number) => {
    setLowStock(n);
    try {
      window.localStorage.setItem(THRESHOLD_KEY, String(n));
    } catch {
      /* sin persistencia */
    }
  };

  const summaries = new Map(catalog.map((p) => [p.id, stockSummary(p, lowStock)]));
  const all = [...summaries.values()];
  const soldOutRows = all.flatMap((s) => s.soldOut);
  const lowRows = all.flatMap((s) => s.low);
  const registered = all.reduce((n, s) => n + s.registered, 0);
  const totalVariants = all.reduce((n, s) => n + s.total, 0);

  const q = normalize(query.trim());
  const visible = catalog
    .filter((p) => category === 'todos' || p.category === category)
    .filter((p) => !q || normalize(p.name).includes(q))
    .filter((p) => {
      const s = summaries.get(p.id)!;
      return alert === 'agotados' ? s.soldOut.length > 0 : alert === 'bajo' ? s.low.length > 0 : true;
    });

  const alertRows = alert === 'agotados' ? soldOutRows : alert === 'bajo' ? lowRows : [];

  const open = catalog.find((p) => p.id === openId) ?? null;

  return (
    <>
      <AdminHead title="Productos e inventario">
        <p className={styles.demoNote}>Los cambios se ven en la tienda al recargarla.</p>
      </AdminHead>

      <ul className={styles.kpis}>
        <li>
          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Visibles en la tienda</span>
            <span className={styles.kpiValue}>
              {catalog.filter((p) => !p.hidden).length} de {catalog.length}
            </span>
            <span className={styles.kpiHint}>productos publicados</span>
          </div>
        </li>
        <li>
          <button
            type="button"
            className={styles.kpi}
            data-active={alert === 'agotados'}
            data-alert={soldOutRows.length > 0}
            aria-pressed={alert === 'agotados'}
            onClick={() => setAlert(alert === 'agotados' ? null : 'agotados')}
          >
            <span className={styles.kpiLabel}>Agotados</span>
            <span className={styles.kpiValue}>{soldOutRows.length}</span>
            <span className={styles.kpiHint}>color y talla con 0 unidades</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className={styles.kpi}
            data-active={alert === 'bajo'}
            data-alert={lowRows.length > 0}
            aria-pressed={alert === 'bajo'}
            onClick={() => setAlert(alert === 'bajo' ? null : 'bajo')}
          >
            <span className={styles.kpiLabel}>Stock bajo</span>
            <span className={styles.kpiValue}>{lowRows.length}</span>
            <span className={styles.kpiHint}>
              con {lowStock} unidad{lowStock === 1 ? '' : 'es'} o menos
            </span>
          </button>
        </li>
        <li>
          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Unidades en inventario</span>
            <span className={styles.kpiValue}>{all.reduce((n, s) => n + s.units, 0)}</span>
            <span className={styles.kpiHint}>
              {registered} de {totalVariants} variantes registradas
            </span>
          </div>
        </li>
      </ul>

      <label className={styles.thresholdField}>
        <span>Avisar stock bajo con</span>
        <select
          className={`${controlClass} ${styles.thresholdSelect}`}
          value={lowStock}
          onChange={(e) => changeThreshold(Number(e.target.value))}
        >
          {thresholdOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>unidades o menos</span>
      </label>

      {alert && (
        <section className={styles.alertPanel} aria-live="polite">
          <div className={styles.alertHead}>
            <h2 className={styles.detailTitle}>
              {alert === 'agotados' ? 'Variantes agotadas' : `Variantes con ${lowStock} unidades o menos`} ·{' '}
              {alertRows.length}
            </h2>
            <button type="button" className={styles.textButton} onClick={() => setAlert(null)}>
              Ver todos los productos
            </button>
          </div>
          {alertRows.length === 0 ? (
            <p className={styles.muted}>
              {alert === 'agotados' ? 'No hay variantes agotadas.' : 'No hay variantes con stock bajo.'}
            </p>
          ) : (
            <ul className={styles.alertList}>
              {alertRows.map((r) => (
                <li key={`${r.product.id}-${r.colorName}-${r.sizeLabel}`}>
                  <button
                    type="button"
                    className={styles.alertRow}
                    onClick={() => {
                      setOpenId(r.product.id);
                      setSavedId(null);
                    }}
                  >
                    {r.image ? <img src={r.image} alt="" className={styles.thumbSm} /> : <span className={styles.thumbSm} />}
                    <strong>{r.product.name}</strong>
                    <span>
                      {r.colorName} · Talla {r.sizeLabel.toLowerCase()}
                    </span>
                    <span className={styles.alertUnits} data-level={r.units === 0 ? 'out' : 'low'}>
                      {r.units} {r.units === 1 ? 'unidad' : 'unidades'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className={styles.toolbar}>
        <input
          type="search"
          className={`${controlClass} ${styles.search}`}
          placeholder="Buscar producto"
          aria-label="Buscar productos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.chips} role="group" aria-label="Categoría">
          {(['todos', 'monturas', 'gafas-de-sol'] as CategoryFilter[]).map((c) => (
            <button
              key={c}
              type="button"
              className={styles.chip}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c === 'todos' ? 'Todos' : categoryLabels[c]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Categoría</th>
              <th scope="col" className={styles.num}>
                Precio
              </th>
              <th scope="col" className={styles.num}>
                Unidades
              </th>
              <th scope="col">Alertas</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const s = summaries.get(p.id)!;
              return (
                <tr key={p.id}>
                  <td>
                    <button
                      type="button"
                      className={styles.productCell}
                      onClick={() => {
                        setOpenId(p.id);
                        setSavedId(null);
                      }}
                    >
                      <img src={p.colors[0].image} alt="" className={styles.thumbSm} />
                      <span className={styles.rowLink}>{p.name}</span>
                    </button>
                  </td>
                  <td className={styles.muted}>{categoryLabels[p.category]}</td>
                  <td className={styles.num}>{formatPrice(p.price)}</td>
                  <td className={styles.num}>
                    {s.tracked ? s.units : <span className={styles.muted}>Sin registrar</span>}
                  </td>
                  <td>
                    {s.soldOut.length > 0 && (
                      <span className={styles.badge} data-status="pagado">
                        {s.soldOut.length} agotada{s.soldOut.length > 1 ? 's' : ''}
                      </span>
                    )}{' '}
                    {s.low.length > 0 && (
                      <span className={styles.badge} data-status="preparando">
                        Stock bajo
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!p.hidden}
                      aria-label={`${p.name} visible en la tienda`}
                      className={styles.switch}
                      onClick={() => toggleVisible(p.id)}
                    >
                      <span className={styles.switchTrack} aria-hidden="true" />
                      <span>{p.hidden ? 'No visible' : 'Visible'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open ? open.name : 'Producto'}>
        {open && (
          <ProductEditor
            key={`${open.id}-${JSON.stringify(overrides[open.id] ?? {})}`}
            product={open}
            base={baseProducts.find((b) => b.id === open.id)!}
            hasChanges={!!overrides[open.id]}
            justSaved={savedId === open.id}
            lowStock={lowStock}
            onSave={(o) => save(open.id, o)}
          />
        )}
      </Drawer>
    </>
  );
}

function ProductEditor({
  product: p,
  base,
  hasChanges,
  justSaved,
  lowStock,
  onSave,
}: {
  product: Product;
  base: Product;
  hasChanges: boolean;
  justSaved: boolean;
  lowStock: number;
  onSave: (override: ProductOverride | null) => void;
}) {
  const [price, setPrice] = useState(String(p.price));
  const [hidden, setHidden] = useState(!!p.hidden);
  const [isNew, setIsNew] = useState(!!p.isNew);
  const [bestSeller, setBestSeller] = useState(!!p.bestSeller);
  const [stock, setStock] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(p.stock ?? {}).map(([k, v]) => [k, String(v)])),
  );
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(price);
    if (!Number.isInteger(amount) || amount < 1000)
      return setError('Escribe un precio válido en pesos, sin puntos ni decimales.');
    const units: Record<string, number> = {};
    for (const [k, v] of Object.entries(stock)) {
      if (v.trim() === '') continue;
      const n = Number(v);
      if (!Number.isInteger(n) || n < 0) return setError('Las unidades deben ser números enteros, desde 0.');
      units[k] = n;
    }
    setError('');
    // Solo se guarda lo que cambia respecto al catálogo base.
    const override: ProductOverride = {};
    if (amount !== base.price) override.price = amount;
    if (hidden) override.hidden = true;
    if (isNew !== !!base.isNew) override.isNew = isNew;
    if (bestSeller !== !!base.bestSeller) override.bestSeller = bestSeller;
    if (Object.keys(units).length) override.stock = units;
    onSave(Object.keys(override).length ? override : null);
  };

  const reset = () => {
    if (window.confirm(`¿Volver ${p.name} a los valores originales? Se borra el inventario registrado.`)) onSave(null);
  };

  return (
    <form className={styles.detail} onSubmit={submit} noValidate>
      <a href={`/producto/${p.slug}`} target="_blank" rel="noreferrer" className={styles.link}>
        Ver en la tienda ↗
      </a>

      {/* Fotos de la montura: una por color */}
      <ul className={styles.photoStrip} aria-label={`Fotos de ${p.name}`}>
        {p.colors.map((c) => (
          <li key={c.id}>
            <figure>
              {c.image ? (
                <img src={c.image} alt={`${p.name} en ${c.name}`} />
              ) : (
                <span className={styles.photoEmpty} style={{ background: c.hex }} />
              )}
              <figcaption>{c.name}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Precio (COP, IVA incluido)</h2>
        <input
          className={controlClass}
          inputMode="numeric"
          value={price}
          onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
          aria-label="Precio en pesos"
        />
        <p className={styles.muted}>
          {formatPrice(Number(price) || 0)}
          {Number(price) !== base.price && ` · antes ${formatPrice(base.price)}`}
        </p>
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>En la tienda</h2>
        <label className={styles.check}>
          <input type="checkbox" checked={!hidden} onChange={(e) => setHidden(!e.target.checked)} />
          Visible en la tienda
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
          Etiqueta "Nuevo"
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} />
          Etiqueta "Más vendido"
        </label>
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailTitle}>Inventario por color y talla</h2>
        <p className={styles.muted}>
          Deja la casilla vacía si aún no registras esa variante. Con 0 se muestra agotada.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.stockTable}>
            <thead>
              <tr>
                <th scope="col">Color</th>
                {p.sizes.map((s) => (
                  <th key={s} scope="col">
                    {sizeGuide[s].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.colors.map((c) => (
                <tr key={c.id}>
                  <th scope="row">
                    <span className={styles.colorCell}>
                      {c.image ? (
                        <img src={c.image} alt="" className={styles.colorThumb} />
                      ) : (
                        <span className={styles.swatch} style={{ background: c.hex }} aria-hidden="true" />
                      )}
                      {c.name}
                    </span>
                  </th>
                  {p.sizes.map((s) => {
                    const k = variantKey(c.id, s);
                    const v = stock[k] ?? '';
                    return (
                      <td key={s}>
                        <input
                          className={styles.stockInput}
                          inputMode="numeric"
                          value={v}
                          data-level={
                            v === '' ? 'none' : Number(v) === 0 ? 'out' : Number(v) <= lowStock ? 'low' : 'ok'
                          }
                          onChange={(e) =>
                            setStock((prev) => ({
                              ...prev,
                              [k]: e.target.value.replace(/\D/g, ''),
                            }))
                          }
                          aria-label={`${c.name}, talla ${sizeGuide[s].label}`}
                          placeholder="—"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <div className={styles.actionRow}>
          <Button type="submit">Guardar cambios</Button>
          {justSaved && !error && <span className={styles.savedNote}>Guardado</span>}
        </div>
        {hasChanges && (
          <button type="button" className={styles.textButton} onClick={reset}>
            Volver a los valores originales
          </button>
        )}
      </div>
    </form>
  );
}
