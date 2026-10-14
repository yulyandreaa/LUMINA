import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { ProductCard } from '../product/ProductCard';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';
import styles from './ProductRail.module.css';

/*
 * Colección destacada: cabecera centrada (como "Color con carácter") y enlace "Ver todo" debajo.
 * Escritorio: rejilla de 4 columnas (grid-cols-4 en la referencia).
 * Móvil: fila deslizable con scroll-snap (sin librería de carrusel).
 */
interface ProductRailProps {
  eyebrow: string;
  title: string;
  products: Product[];
  viewAll: { label: string; to: string };
}

export function ProductRail({ eyebrow, title, products, viewAll }: ProductRailProps) {
  return (
    <section className="section container">
      <Reveal className={styles.head}>
        <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow>
        <h2 className={styles.title}>{title}</h2>
      </Reveal>
      <Reveal>
        <ul className={styles.rail}>
          {products.map((p) => (
            <li key={p.id} className={styles.item}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </Reveal>
      <div className={styles.more}>
        <Link to={viewAll.to} className="text-link">
          {viewAll.label}
        </Link>
      </div>
    </section>
  );
}
