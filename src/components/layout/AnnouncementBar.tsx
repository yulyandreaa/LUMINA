import { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon';
import styles from './AnnouncementBar.module.css';

/*
 * Barra de anuncios rotativa (como la de la referencia).
 * - Cambia cada 5 s; se pausa con el ratón encima o con el foco dentro.
 * - No rota sola si el usuario pidió reducir el movimiento.
 */
const INTERVAL_MS = 5000;

export function AnnouncementBar({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduceMotion || messages.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, messages.length]);

  const go = (step: number) => setIndex((i) => (i + step + messages.length) % messages.length);

  return (
    <div
      className={styles.bar}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Anuncios"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button className={styles.arrow} onClick={() => go(-1)} aria-label="Anuncio anterior">
        <Icon name="chevron" size={14} className={styles.flip} />
      </button>
      <div className={styles.viewport} aria-live={paused ? 'polite' : 'off'}>
        {messages.map((text, i) => (
          <p key={text} className={styles.message} data-active={i === index} aria-hidden={i !== index}>
            {text}
          </p>
        ))}
      </div>
      <button className={styles.arrow} onClick={() => go(1)} aria-label="Anuncio siguiente">
        <Icon name="chevron" size={14} />
      </button>
    </div>
  );
}
