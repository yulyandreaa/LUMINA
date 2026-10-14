import type { ReactNode } from 'react';
import styles from './Accordion.module.css';

/*
 * Acordeón con <details>/<summary> nativos: accesible con teclado sin JavaScript.
 * name="…" hace que al abrir uno se cierren los demás del mismo grupo (navegadores modernos).
 */
export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export function Accordion({ items, group, defaultOpen }: { items: AccordionItem[]; group: string; defaultOpen?: string }) {
  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <details key={item.id} name={group} className={styles.item} open={item.id === defaultOpen}>
          <summary className={styles.summary}>{item.title}</summary>
          <div className={styles.content}>{item.content}</div>
        </details>
      ))}
    </div>
  );
}
