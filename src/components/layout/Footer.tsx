import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { footerColumns, legalLinks } from '../../data/navigation';
import { Logo } from '../ui/Logo';
import { Eyebrow } from '../ui/Eyebrow';
import { Icon } from '../ui/Icon';
import styles from './Footer.module.css';

/*
 * Footer con la estructura de la referencia: cita de marca · 4 columnas · legales.
 * En celular las 4 columnas se pliegan (se abre una a la vez) para que el footer no sea tan alto.
 */
const MOBILE = '(max-width: 767px)';

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE).matches);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE);
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return mobile;
}

export function Footer() {
  const year = new Date().getFullYear();
  const mobile = useIsMobile();
  const [openCol, setOpenCol] = useState<string | null>(null);

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

        {footerColumns.map((col, i) => {
          const open = !mobile || openCol === col.title;
          const listId = `footer-col-${i}`;
          return (
            <nav key={col.title} aria-label={col.title} className={styles.column}>
              {mobile ? (
                <h2 className={styles.toggleHeading}>
                  <button
                    type="button"
                    className={styles.toggle}
                    aria-expanded={open}
                    aria-controls={listId}
                    onClick={() => setOpenCol(open ? null : col.title)}
                  >
                    {col.title}
                    <Icon name={open ? 'minus' : 'plus'} size={16} />
                  </button>
                </h2>
              ) : (
                <Eyebrow as="h2" className={styles.title}>
                  {col.title}
                </Eyebrow>
              )}
              <ul id={listId} className={styles.links} hidden={!open}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
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
