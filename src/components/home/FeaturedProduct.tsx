import { useRef, useState } from 'react';
import type { Product } from '../../types/product';
import { formatPrice } from '../../lib/format';
import { FrameIllustration } from '../product/FrameIllustration';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { EyesFrame } from './EyesFrame';
import styles from './FeaturedProduct.module.css';

/*
 * Producto protagonista (bloque LEMTOSH de la referencia):
 * - Izquierda: nombre · ilustración animada · precio · texto recortado a 3 líneas · CTA.
 * - Derecha: imagen grande con anotaciones manuscritas + tira de miniaturas por color.
 * Usa la foto de cada color si existe; si no, el dibujo (FrameIllustration).
 */
export interface Annotation {
  text: string;
  /** Posición dentro del panel, en % (top/left). */
  top: string;
  left: string;
}

interface FeaturedProductProps {
  product: Product;
  story: string;
  annotations: Annotation[];
}

export function FeaturedProduct({ product, story, annotations }: FeaturedProductProps) {
  const [colorId, setColorId] = useState(product.colors[0].id);
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const stripRef = useRef<HTMLUListElement>(null);
  const sun = product.category === 'gafas-de-sol';

  const scrollStrip = (dir: 1 | -1) => {
    const strip = stripRef.current;
    if (strip) strip.scrollBy({ left: dir * strip.clientWidth * 0.6, behavior: 'smooth' });
  };

  return (
    <section className={`section container ${styles.grid}`}>
      <Reveal className={styles.info}>
        <h2 className={styles.name}>{product.name}</h2>
        <EyesFrame color={color.hex} />
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <p className={styles.story}>{story}</p>
        <Button to={`/producto/${product.slug}?color=${color.id}`}>Descubre {product.name}</Button>
      </Reveal>

      <Reveal className={styles.panel}>
        <div className={styles.stage}>
          {/* key: al cambiar de color la imagen se vuelve a montar y hace el fundido */}
          {color.image ? (
            <img key={color.id} src={color.image} alt={`${product.name} en ${color.name}`} className={styles.photo} />
          ) : (
            <FrameIllustration key={color.id} shape={product.shape} color={color.hex} sun={sun} className={styles.frame} />
          )}
          {annotations.map((a) => (
            <span key={a.text} className={styles.note} style={{ top: a.top, left: a.left }}>
              {a.text}
            </span>
          ))}
          <span className={styles.colorName}>{color.name}</span>
        </div>

        <div className={styles.strip}>
          <button className={styles.arrow} onClick={() => scrollStrip(-1)} aria-label="Colores anteriores">
            <Icon name="chevron" size={18} className={styles.flip} />
          </button>
          <ul ref={stripRef} className={styles.thumbs} role="radiogroup" aria-label={`Colores de ${product.name}`}>
            {product.colors.map((c) => (
              <li key={c.id}>
                <button
                  role="radio"
                  aria-checked={c.id === colorId}
                  aria-label={c.name}
                  className={styles.thumb}
                  onClick={() => setColorId(c.id)}
                >
                  {c.image ? (
                    <img src={c.image} alt="" loading="lazy" />
                  ) : (
                    <FrameIllustration shape={product.shape} color={c.hex} sun={sun} />
                  )}
                </button>
              </li>
            ))}
          </ul>
          <button className={styles.arrow} onClick={() => scrollStrip(1)} aria-label="Más colores">
            <Icon name="chevron" size={18} />
          </button>
        </div>
      </Reveal>
    </section>
  );
}
