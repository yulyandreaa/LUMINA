import { Link } from 'react-router-dom';
import type { ResolvedLine } from '../../lib/cart';
import { MAX_QUANTITY } from '../../lib/cart';
import { sizeGuide } from '../../data/sizes';
import { formatPrice } from '../../lib/format';
import { useCart } from '../../cart/CartContext';
import { ProductThumb } from '../product/ProductThumb';
import { Icon } from '../ui/Icon';
import styles from './CartLineItem.module.css';

/* Una línea de la cesta: miniatura · nombre y variante · cantidad (− +) · eliminar · total. */
export function CartLineItem({ line }: { line: ResolvedLine }) {
  const { setQuantity, remove } = useCart();
  const { product, color, size, quantity, key } = line;
  const href = `/producto/${product.slug}?color=${color.id}&talla=${size}`;

  return (
    <li className={styles.line}>
      <Link to={href} className={styles.thumb} tabIndex={-1} aria-hidden="true">
        <ProductThumb product={product} color={color} />
      </Link>

      <div className={styles.body}>
        <div className={styles.top}>
          <Link to={href} className={styles.name}>
            {product.name}
          </Link>
          <p className={styles.total}>{formatPrice(line.lineTotal)}</p>
        </div>
        <p className={styles.variant}>
          {color.name} · Talla {sizeGuide[size].label}
        </p>
        {quantity > 1 && <p className={styles.variant}>{formatPrice(product.price)} c/u</p>}

        <div className={styles.controls}>
          <div className={styles.stepper} role="group" aria-label={`Cantidad de ${product.name}`}>
            <button
              onClick={() => setQuantity(key, quantity - 1)}
              aria-label={quantity === 1 ? `Eliminar ${product.name}` : 'Restar uno'}
            >
              <Icon name="minus" size={14} />
            </button>
            <output aria-live="polite">{quantity}</output>
            <button
              onClick={() => setQuantity(key, quantity + 1)}
              disabled={quantity >= MAX_QUANTITY}
              aria-label="Sumar uno"
            >
              <Icon name="plus" size={14} />
            </button>
          </div>
          <button className={styles.remove} onClick={() => remove(key)}>
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
}
