import { useEffect, useRef, useState } from 'react';
import { Eyebrow } from '../ui/Eyebrow';
import styles from './Manifesto.module.css';

interface ManifestoProps {
  eyebrow: string;
  lines: { text: string; note: string }[];
}

/*
 * Manifiesto de /nosotros: frases cortas apiladas en grande.
 * Cada línea pasa de tenue a borgoña cuando llega a la mitad de la pantalla (y se queda encendida).
 */
export function Manifesto({ eyebrow, lines }: ManifestoProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const items = Array.from(listRef.current?.children ?? []);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLit(items.length);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = items.indexOf(entry.target) + 1;
          setLit((n) => Math.max(n, index));
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -45% 0px' },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.manifesto} aria-label={eyebrow}>
      <div className="container">
        <Eyebrow>{eyebrow}</Eyebrow>
        <ol ref={listRef} className={styles.lines}>
          {lines.map((line, i) => (
            <li key={line.text} className={styles.line} data-lit={i < lit}>
              <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
              <p className={styles.text}>{line.text}</p>
              <p className={styles.note}>{line.note}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
