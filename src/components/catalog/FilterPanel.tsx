import type { FacetOption } from '../../lib/catalog';
import type { ParamKey } from '../../hooks/useCatalogParams';
import styles from './FilterPanel.module.css';

/*
 * Grupos de filtro (Forma · Talla · Color), como en la referencia:
 * cada opción con su recuento entre paréntesis.
 * Se usa en la barra lateral (escritorio) y dentro del Drawer (móvil).
 */
interface FilterGroup {
  key: ParamKey;
  title: string;
  options: FacetOption[];
  selected: string[];
}

interface FilterPanelProps {
  groups: FilterGroup[];
  onToggle: (key: ParamKey, value: string) => void;
}

export function FilterPanel({ groups, onToggle }: FilterPanelProps) {
  return (
    <div className={styles.panel}>
      {groups.map((g) => (
        <details key={g.key} className={styles.group} open>
          <summary className={styles.summary}>
            {g.title}
            {g.selected.length > 0 && <span className={styles.count}>{g.selected.length}</span>}
          </summary>
          <fieldset className={styles.fieldset}>
            <legend className="visually-hidden">{g.title}</legend>
            {g.options.map((o) => (
              <label key={o.value} className={styles.option}>
                <input
                  type="checkbox"
                  checked={g.selected.includes(o.value)}
                  onChange={() => onToggle(g.key, o.value)}
                  className={styles.checkbox}
                />
                {o.hex && <span className={styles.dot} style={{ background: o.hex }} aria-hidden="true" />}
                <span>{o.label}</span>
                <span className={styles.qty}>({o.count})</span>
              </label>
            ))}
          </fieldset>
        </details>
      ))}
    </div>
  );
}
