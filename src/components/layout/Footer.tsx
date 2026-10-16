import { Link } from 'react-router-dom';
import { footerColumns, legalLinks } from '../../data/navigation';
import { Logo } from '../ui/Logo';
import { Eyebrow } from '../ui/Eyebrow';
import styles from './Footer.module.css';

/*
 * Footer con la estructura de la referencia:
 * cita de marca · 4 columnas · legales.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo variant="ivory" className={styles.logo} />
          <p className={styles.quote}>“Más visión para tu mundo.”</p>
          <Eyebrow as="span" rule={false} className={styles.descriptor}>
            Óptica contemporánea
          </Eyebrow>
        </div>

        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <Eyebrow as="h2" className={styles.title}>
              {col.title}
            </Eyebrow>
            <ul className={styles.links}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {year} LUMINA · Colombia (COP)</p>
        <ul className={styles.legal}>
          {legalLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
