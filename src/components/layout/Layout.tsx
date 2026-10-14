import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { announcements, mainNav } from '../../data/navigation';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { CookieBanner } from './CookieBanner';

/* Estructura común de todas las páginas. <Outlet /> es donde React Router pinta la página actual. */
export function Layout() {
  const { pathname } = useLocation();

  // Al cambiar de página, volver arriba (cambiar solo filtros en la URL no mueve el scroll).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <AnnouncementBar messages={announcements} />
      <Header nav={mainNav} />
      <main id="contenido">
        {/* Mientras se descarga el código de una página diferida (lazy) */}
        <Suspense fallback={<p className="container" style={{ padding: 'var(--space-24) 0' }}>Cargando…</p>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <CookieBanner />
    </>
  );
}
