import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { Icon } from '../ui/Icon';
import styles from './HeroSlideshow.module.css';

/*
 * Sección 1 — Hero de temporada (carrusel a sangre completa, como la referencia).
 * Admite imagen distinta para móvil y escritorio mediante <picture>.
 */
export interface HeroSlide {
  eyebrow: string;
  title: string;
  cta: { label: string; to: string };
  image: string;
  imageMobile?: string;
  alt: string;
  /** Punto focal de la imagen (CSS object-position). */
  focus?: string;
}

const INTERVAL_MS = 6000;

export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduceMotion || slides.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  const go = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <section
      className={styles.hero}
      aria-roledescription="carrusel"
      aria-label="Destacados"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          className={styles.slide}
          data-active={i === index}
          aria-roledescription="diapositiva"
          aria-label={`${i + 1} de ${slides.length}`}
          aria-hidden={i !== index}
          inert={i !== index}
        >
          <picture>
            {slide.imageMobile && <source media="(max-width: 767px)" srcSet={slide.imageMobile} />}
            <img
              src={slide.image}
              alt={slide.alt}
              className={styles.image}
              style={{ objectPosition: slide.focus }}
              fetchPriority={i === 0 ? 'high' : 'auto'}
            />
          </picture>
          <div className={`container ${styles.content}`}>
            <Eyebrow>{slide.eyebrow}</Eyebrow>
            {i === 0 ? <h1 className={styles.title}>{slide.title}</h1> : <h2 className={styles.title}>{slide.title}</h2>}
            <Button to={slide.cta.to} variant="secondary" withArrow className={styles.cta}>
              {slide.cta.label}
            </Button>
          </div>
        </div>
      ))}

      <div className={`container ${styles.controls}`}>
        <div className={styles.dots}>
          {slides.map((s, i) => (
            <button
              key={s.title}
              className={styles.dot}
              aria-current={i === index}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <div className={styles.arrows}>
          <button onClick={() => go(index - 1)} aria-label="Anterior" className={styles.arrow}>
            <Icon name="arrow" className={styles.flip} />
          </button>
          <button onClick={() => go(index + 1)} aria-label="Siguiente" className={styles.arrow}>
            <Icon name="arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}
