import { Link } from 'react-router-dom';
import { Reveal } from '../ui/Reveal';
import styles from './PromoGrid.module.css';

/*
 * Rejilla de promociones (como en la referencia):
 * 2 tarjetas cuadradas · foto con velo oscuro · título y botón centrados.
 * Toda la tarjeta es un enlace; el "botón" es visual para no anidar enlaces.
 */
export interface PromoTile {
  title: string;
  cta: string;
  to: string;
  image: string;
  /** Punto focal de la foto (CSS object-position). */
  focus?: string;
}

export function PromoGrid({ tiles }: { tiles: PromoTile[] }) {
  return (
    <section className="section container">
      <ul className={styles.grid}>
        {tiles.map((t) => (
          <li key={t.title}>
            <Reveal>
              <Link to={t.to} className={styles.tile}>
                <img src={t.image} alt="" loading="lazy" className={styles.image} style={{ objectPosition: t.focus }} />
                <span className={styles.content}>
                  <span className={styles.title}>{t.title}</span>
                  <span className={styles.cta}>{t.cta}</span>
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
