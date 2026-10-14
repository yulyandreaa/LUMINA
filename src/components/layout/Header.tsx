import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import type { NavItem } from '../../data/navigation';
import { Logo } from '../ui/Logo';
import { Icon } from '../ui/Icon';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { SearchOverlay } from './SearchOverlay';
import { useCart } from '../../cart/CartContext';
import styles from './Header.module.css';

/*
 * Cabecera fija con megamenú (escritorio ≥1024px) y menú lateral (móvil/tablet).
 * El megamenú se abre al pasar el ratón o con teclado (Enter/Espacio en el botón)
 * y se cierra con Escape, al salir del área o al cambiar de página.
 */
const CLOSE_DELAY_MS = 150;

export function Header({ nav }: { nav: NavItem[] }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeTimer = useRef<number | undefined>(undefined);
  const location = useLocation();
  const cart = useCart();

  // Cerrar menús al navegar.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenMenu(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const open = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  };

  const activeItem = nav.find((item) => item.label === openMenu);

  return (
    <header className={styles.header} onMouseLeave={scheduleClose}>
      <div className={`container ${styles.inner}`}>
        <button
          className={`${styles.iconButton} ${styles.mobileOnly}`}
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <Icon name="menu" size={24} />
        </button>

        <Link to="/" className={styles.logo} aria-label="LUMINA, ir al inicio">
          <Logo />
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          <ul className={styles.navList}>
            {nav.map((item) => (
              <li key={item.label} onMouseEnter={() => (item.columns ? open(item.label) : setOpenMenu(null))}>
                {item.columns ? (
                  <button
                    className={styles.navLink}
                    aria-expanded={openMenu === item.label}
                    aria-controls="mega-menu"
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  >
                    {item.label}
                  </button>
                ) : (
                  <NavLink to={item.href} className={styles.navLink}>
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link to="/examen-visual" className={styles.highlight}>
            Examen visual
          </Link>
          <Link to="/cuenta" className={`${styles.iconButton} ${styles.desktopOnly}`} aria-label="Mi cuenta">
            <Icon name="user" />
          </Link>
          <button
            className={styles.iconButton}
            aria-label="Buscar"
            aria-expanded={searchOpen}
            onClick={() => {
              setOpenMenu(null);
              setSearchOpen((v) => !v);
            }}
          >
            <Icon name="search" />
          </button>
          <button
            className={`${styles.iconButton} ${styles.cart}`}
            aria-label={`Cesta, ${cart.count} ${cart.count === 1 ? 'producto' : 'productos'}`}
            onClick={cart.open}
          >
            <Icon name="bag" />
            {cart.count > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={closeSearch} />}

      {!searchOpen && activeItem?.columns && (
        <MegaMenu
          id="mega-menu"
          item={activeItem}
          onMouseEnter={() => open(activeItem.label)}
        />
      )}

      <MobileNav id="mobile-nav" nav={nav} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
