import { Link } from 'react-router-dom';
import type { NavItem } from '../../data/navigation';
import heroImg from '../../assets/photos/hero-retrato.jpg';
import detailImg from '../../assets/photos/monturas-sombra.jpg';
import styles from './MegaMenu.module.css';

/*
 * Panel desplegable a todo el ancho bajo la cabecera.
 * Columnas de enlaces a la izquierda + 2 tarjetas con imagen a la derecha,
 * como en la referencia ("Comprar todas…" / "Más vendidos").
 */
interface MegaMenuProps {
  id: string;
  item: NavItem;
  onMouseEnter: () => void;
}

export function MegaMenu({ id, item, onMouseEnter }: MegaMenuProps) {
  return (
    <div id={id} className={styles.panel} onMouseEnter={onMouseEnter}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.columns}>
          {item.columns?.map((col) => (
            <div key={col.title}>
              <p className={styles.title}>{col.title}</p>
              <ul className={styles.links}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.cards}>
          <Link to={item.href} className={styles.card}>
            <span className={styles.media}><img src={heroImg} alt="" loading="lazy" /></span>
            <span>Ver todo · {item.label}</span>
          </Link>
          <Link to={`${item.href}?orden=mas-vendidos`} className={styles.card}>
            <span className={styles.media}><img src={detailImg} alt="" loading="lazy" /></span>
            <span>Más vendidos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
