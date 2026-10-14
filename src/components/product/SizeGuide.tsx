import { Link } from 'react-router-dom';
import type { Category } from '../../types/product';
import { sizeGuide } from '../../data/sizes';
import styles from './SizeGuide.module.css';

/*
 * Contenido de la guía de tallas (modal), con la estructura de la referencia:
 * explicación de medidas + recomendación por talla con enlace a filtrar.
 */
export function SizeGuide({ category }: { category: Category }) {
  return (
    <div className={styles.guide}>
      <p>
        Una sola talla no sirve para todos los rostros. Compara estas medidas con unas gafas que ya te queden bien: las
        encontrarás grabadas en la cara interior de la patilla.
      </p>
      <p className={styles.fictional}>Medidas de ejemplo (ficticias), pendientes de confirmar por modelo.</p>

      <dl className={styles.terms}>
        <div>
          <dt>Ancho de lente</dt>
          <dd>El ancho de una sola lente. Es el número con el que identificamos la talla.</dd>
        </div>
        <div>
          <dt>Ancho de montura</dt>
          <dd>El frente completo de la montura, de un extremo al otro.</dd>
        </div>
      </dl>

      <ul className={styles.sizes}>
        {Object.values(sizeGuide).map((s) => (
          <li key={s.id} className={styles.size}>
            <p className={styles.sizeName}>
              {s.label} · {s.lensWidth} mm
            </p>
            <p>{s.advice}</p>
            <Link to={`/${category}?talla=${s.id}`} className="text-link">
              Ver tallas {s.label.toLowerCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
