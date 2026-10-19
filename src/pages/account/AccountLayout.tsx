import type { ReactNode } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useAccountData } from '../../auth/useAccountData';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { useTabStrip } from '../../hooks/useTabStrip';
import styles from './Account.module.css';

/*
 * Marco de "Mi cuenta":
 * - Escritorio: menú lateral fijo (saludo con el nombre + secciones + cerrar sesión) y contenido a la derecha.
 * - Móvil: el saludo arriba y las secciones como fila de pestañas deslizable.
 * Sin sesión → manda a iniciar sesión y después vuelve a la sección pedida.
 */
const sections = [
  { to: 'pedidos', label: 'Mis pedidos' },
  { to: 'citas', label: 'Mis citas' },
  { to: 'datos', label: 'Datos y direcciones' },
  { to: 'favoritos', label: 'Favoritos' },
];

export function AccountLayout() {
  const { customer, signOut } = useAuth();
  const { data } = useAccountData();
  const { pathname } = useLocation();
  const navRef = useTabStrip<HTMLElement>();
  // Solo el nombre: un saludo más cercano ("Hola, Yuly").
  const firstName = data.profile.firstName?.trim().split(/\s+/)[0];

  if (!customer) return <Navigate to="/cuenta/ingresar" replace state={{ from: pathname }} />;

  return (
    <div className={`container ${styles.layout}`}>
      <aside className={styles.sidebar}>
        <Eyebrow>Mi cuenta</Eyebrow>
        <p className={styles.hello}>{firstName ? `Hola, ${firstName}` : 'Hola'}</p>
        {!firstName && (
          <Link to="datos" className={styles.addName}>
            Agrega tu nombre
          </Link>
        )}
        <nav ref={navRef} className={styles.nav} aria-label="Secciones de mi cuenta">
          {sections.map((s) => (
            <NavLink key={s.to} to={s.to} className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.current}` : styles.navLink)}>
              {s.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className={styles.signOut} onClick={signOut}>
          Cerrar sesión
        </button>
      </aside>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

/* Encabezado común de cada sección del panel. */
export function SectionHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className={styles.sectionHead}>
      <h1 className={styles.sectionTitle}>{title}</h1>
      {children}
    </header>
  );
}
