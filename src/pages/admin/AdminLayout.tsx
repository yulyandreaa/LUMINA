import { Suspense, type ReactNode } from 'react';
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminSession } from '../../admin/AdminSession';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { useTabStrip } from '../../hooks/useTabStrip';
import account from '../account/Account.module.css';
import styles from './Admin.module.css';

/*
 * Marco del panel de administración, con la MISMA diagramación que "Mi cuenta"
 * (reutiliza sus estilos): cabecera y footer de la tienda, menú lateral fijo en escritorio
 * (rótulo · saludo · secciones · cerrar sesión) y pestañas deslizables en móvil.
 * Sesión propia del panel (no la de clientes). Sin ella → "Iniciar sesión" de Mi cuenta y luego vuelve.
 */
const sections = [
  { to: 'pedidos', label: 'Pedidos' },
  { to: 'citas', label: 'Citas de examen' },
  { to: 'productos', label: 'Productos e inventario' },
  { to: 'clientes', label: 'Clientes' },
];

export function AdminLayout() {
  const { email, signOut } = useAdminSession();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const navRef = useTabStrip<HTMLElement>();

  if (!email) return <Navigate to="/cuenta/ingresar" replace state={{ from: pathname }} />;

  return (
    <div className={`container ${account.layout}`}>
      <aside className={account.sidebar}>
        <Eyebrow>Administración</Eyebrow>
        <p className={account.hello}>Hola, equipo</p>
        <p className={account.muted}>{email}</p>
        <nav ref={navRef} className={account.nav} aria-label="Secciones del panel">
          {sections.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              className={({ isActive }) => (isActive ? `${account.navLink} ${account.current}` : account.navLink)}
            >
              {s.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className={account.signOut}
          onClick={() => {
            signOut();
            navigate('/cuenta/ingresar');
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      <div className={account.content}>
        <Suspense fallback={<p className={styles.soon}>Cargando…</p>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

/* Encabezado común de cada sección: igual que en "Mi cuenta" (título grande + filete vino). */
export function AdminHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className={account.sectionHead}>
      <h1 className={account.sectionTitle}>{title}</h1>
      {children}
    </header>
  );
}
