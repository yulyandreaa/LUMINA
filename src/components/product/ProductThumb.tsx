import type { ColorVariant, Product } from '../../types/product';
import { FrameIllustration } from './FrameIllustration';
import styles from './ProductThumb.module.css';

/*
 * Miniatura de un producto en un color (cesta, checkout, buscador):
 * la foto de ese color si existe; si no, el dibujo de la montura.
 * Llena el recuadro que la contiene.
 */
export function ProductThumb({ product, color }: { product: Product; color: ColorVariant }) {
  return color.image ? (
    <img src={color.image} alt="" loading="lazy" className={styles.photo} />
  ) : (
    <FrameIllustration
      shape={product.shape}
      color={color.hex}
      sun={product.category === 'gafas-de-sol'}
      className={styles.drawing}
    />
  );
}
