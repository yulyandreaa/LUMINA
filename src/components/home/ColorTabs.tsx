import { useId, useRef, useState, type KeyboardEvent } from 'react';
import type { Product } from '../../types/product';
import { ProductCard } from '../product/ProductCard';
import { Reveal } from '../ui/Reveal';
import styles from './ColorTabs.module.css';

/*
 * Sección 2 — "Color con carácter" (como en la referencia):
 * título centrado · pestañas por color · 4 productos mostrados en ese color.
 *
 * Accesibilidad: patrón ARIA de pestañas (tablist/tab/tabpanel).
 * Con el teclado, ← → cambian de pestaña e Inicio/Fin van a la primera/última.
 */
export interface ColorTab {
  label: string;
  colorId: string;
}

interface ColorTabsProps {
  title: string;
  tabs: ColorTab[];
  products: Product[];
  maxItems?: number;
}

export function ColorTabs({ title, tabs, products, maxItems = 4 }: ColorTabsProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const tab = tabs[active];
  const items = products.filter((p) => p.colors.some((c) => c.id === tab.colorId)).slice(0, maxItems);

  const select = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: tabs.length - 1 };
    if (e.key in moves) {
      e.preventDefault();
      select(moves[e.key]);
    }
  };

  return (
    <section className="section container">
      <Reveal className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.tabs} role="tablist" aria-label={title} onKeyDown={onKeyDown}>
          {tabs.map((t, i) => (
            <button
              key={t.colorId}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${baseId}-tab-${i}`}
              role="tab"
              aria-selected={i === active}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === active ? 0 : -1}
              className={styles.tab}
              onClick={() => setActive(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`}>
        <ul className={styles.grid}>
          {items.map((p) => (
            // key con el color: al cambiar de pestaña la tarjeta se reinicia mostrando ese color.
            <li key={`${tab.colorId}-${p.id}`} className={styles.item}>
              <ProductCard product={p} initialColorId={tab.colorId} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
