import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatPrice } from '../../lib/format';
import { FavoriteButton } from './FavoriteButton';
import { FrameIllustration } from './FrameIllustration';
import { Swatches } from './Swatches';
import styles from './ProductCard.module.css';

/*
 * Tarjeta de producto (anatomía de la referencia):
 * imagen con segunda vista al pasar el ratón · corazón de favoritos · "Elige opciones" · nombre · precio · muestras de color.
 * Elegir una muestra cambia la imagen y el enlace apunta a ese color.
 */
interface ProductCardProps {
  product: Product;
  /** Color con el que se muestra al principio (p. ej. el de la pestaña activa). */
  initialColorId?: string;
}

export function ProductCard({ product, initialColorId }: ProductCardProps) {
  const [colorId, setColorId] = useState(
    product.colors.some((c) => c.id === initialColorId) ? initialColorId! : product.colors[0].id,
  );
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const href = `/producto/${product.slug}?color=${color.id}`;
  const sun = product.category === 'gafas-de-sol';

  return (
    <article className={styles.card}>
      <Link to={href} className={styles.media} aria-label={`${product.name}, ${color.name}`}>
        {product.isNew && <span className={styles.badge}>Nuevo</span>}
        {color.image ? (
          <img src={color.image} alt="" className={styles.photo} loading="lazy" />
        ) : (
          <>
            <FrameIllustration shape={product.shape} color={color.hex} sun={sun} className={styles.primary} />
            <FrameIllustration shape={product.shape} color={color.hex} sun={sun} angled className={styles.secondary} />
          </>
        )}
        <span className={styles.quick} aria-hidden="true">
          Elige opciones
        </span>
      </Link>
      <FavoriteButton product={product} color={color} className={styles.favorite} />

      <div className={styles.info}>
        <h3 className={styles.name}>
          <Link to={href}>{product.name}</Link>
        </h3>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <Swatches colors={product.colors} selected={colorId} onSelect={setColorId} label={`Color de ${product.name}`} />
      </div>
    </article>
  );
}
