import { useRef, useState, type ReactNode } from 'react';
import { Icon } from '../ui/Icon';
import styles from './Gallery.module.css';

/*
 * Galería de la ficha: carrusel de 1 imagen por vista, sin miniaturas (decisión de LUMINA).
 * Implementada con scroll-snap: en móvil se desliza con el dedo de forma nativa;
 * las flechas solo hacen scroll hasta la diapositiva elegida.
 */
export interface GallerySlide {
  key: string;
  content: ReactNode;
  caption: string;
}

export function Gallery({ slides, label }: { slides: GallerySlide[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
  };

  // Actualiza el índice cuando el usuario desliza con el dedo.
  const onScroll = () => {
    const track = trackRef.current;
    if (track) setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <section className={styles.gallery} aria-roledescription="carrusel" aria-label={label}>
      <div className={styles.viewport}>
        <div ref={trackRef} className={styles.track} onScroll={onScroll}>
          {slides.map((s, i) => (
            <figure
              key={s.key}
              className={styles.slide}
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${slides.length}: ${s.caption}`}
            >
              {s.content}
              <figcaption className={styles.caption}>{s.caption}</figcaption>
            </figure>
          ))}
        </div>
        <button className={`${styles.arrow} ${styles.prev}`} onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Imagen anterior">
          <Icon name="arrow" className={styles.flip} />
        </button>
        <button
          className={`${styles.arrow} ${styles.next}`}
          onClick={() => goTo(index + 1)}
          disabled={index === slides.length - 1}
          aria-label="Imagen siguiente"
        >
          <Icon name="arrow" />
        </button>
        <p className={styles.counter} aria-live="polite">
          {index + 1} / {slides.length}
        </p>
      </div>
    </section>
  );
}
