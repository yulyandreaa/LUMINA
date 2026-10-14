import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { NavItem } from '../../data/navigation';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import styles from './MobileNav.module.css';

/*
 * Menú lateral para móvil y tablet (<1024px).
 * Cada entrada con submenú se despliega como acordeón.
 * Accesibilidad: bloquea el scroll de fondo, cierra con Escape
 * y mueve el foco al botón de cerrar al abrirse.
 */
interface MobileNavProps {
  id: string;
  nav: NavItem[];
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ id, nav, open, onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <>
      <div className={styles.overlay} data-open={open} onClick={onClose} aria-hidden="true" />
      <div
        id={id}
        className={styles.drawer}
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        inert={!open}
      >
        <div className={styles.top}>
          <Logo className={styles.logo} />
          <button ref={closeRef} className={styles.close} onClick={onClose} aria-label="Cerrar menú">
            <Icon name="close" size={24} />
          </button>
        </div>

        <nav aria-label="Principal (móvil)">
          <ul>
            {nav.map((item) => {
              const isOpen = expanded === item.label;
              return (
                <li key={item.label} className={styles.item}>
                  {item.columns ? (
                    <>
                      <button
                        className={styles.row}
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : item.label)}
                      >
                        {item.label}
                        <Icon name={isOpen ? 'minus' : 'plus'} size={18} />
                      </button>
                      <div className={styles.panel} data-open={isOpen}>
                        <div className={styles.panelInner}>
                          {item.columns.map((col) => (
                            <div key={col.title} className={styles.group}>
                              <p className={styles.groupTitle}>{col.title}</p>
                              <ul>
                                {col.links.map((link) => (
                                  <li key={link.label}>
                                    <Link to={link.href} className={styles.subLink}>
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link to={item.href} className={styles.row}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.footer}>
          <Link to="/examen-visual" className={styles.footerLink}>
            Examen visual
          </Link>
          <Link to="/cuenta" className={styles.footerLink}>
            Mi cuenta
          </Link>
        </div>
      </div>
    </>
  );
}
