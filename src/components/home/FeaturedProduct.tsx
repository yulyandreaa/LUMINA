import { useEffect, useState } from 'react';
import type { Product } from '../../types/product';
import { formatPrice } from '../../lib/format';
import { Button } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import styles from './FeaturedProduct.module.css';

/*
 * Producto protagonista del home, según el diseño "Banner editorial de gafas AURA artesanales":
 * carrusel a sangre con las 4 fotos del diseño (con sus notas manuscritas) y, encima a la izquierda,
 * el texto con la tipografía de LUMINA: etiqueta · nombre · precio · texto · CTA y controles del carrusel.
 * En móvil la foto va arriba y el texto debajo, sobre el borgoña.
 */
export interface FeaturedSlide {
  src: string;
  alt: string;
}

interface FeaturedProductProps {
  product: Product;
  story: string;
  slides: FeaturedSlide[];
}

const INTERVAL_MS = 5000;

export function FeaturedProduct({ product, story, slides }: FeaturedProductProps) {
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
    <section className="section">
      <div
        className={styles.card}
        aria-roledescription="carrusel"
        aria-label={`Fotos de ${product.name}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className={styles.media}>
          {slides.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.alt}
              className={styles.photo}
              data-active={i === index}
              aria-hidden={i !== index}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        <Reveal className={styles.info}>
          <Eyebrow rule={false} className={styles.eyebrow}>
            Montura destacada
          </Eyebrow>
          <h2 className={styles.name}>{product.name}</h2>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={styles.story}>{story}</p>
          <div className={styles.actions}>
            <Button to={`/producto/${product.slug}?color=${product.colors[0].id}`} withArrow className={styles.cta}>
              Descubre {product.name}
            </Button>
            <div className={styles.controls}>
              <button onClick={() => go(index - 1)} aria-label="Foto anterior" className={styles.arrow}>
                <Icon name="chevron" size={16} className={styles.flip} />
              </button>
              <div className={styles.dots}>
                {slides.map((s, i) => (
                  <button
                    key={s.src}
                    className={styles.dot}
                    aria-current={i === index}
                    aria-label={`Ver foto ${i + 1} de ${slides.length}`}
                    onClick={() => go(i)}
                  />
                ))}
              </div>
              <button onClick={() => go(index + 1)} aria-label="Foto siguiente" className={styles.arrow}>
                <Icon name="chevron" size={16} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
