import { useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { controlClass } from '../../components/ui/fieldStyles';
import styles from './Auth.module.css';

/*
 * Marco común de "Iniciar sesión" y "Crear cuenta":
 * columna centrada · pestañas · formulario · separador "o" · botón de Google · aviso de demostración.
 */
interface AuthShellProps {
  title: string;
  intro: string;
  /** false en "recuperar contraseña" (sin pestañas ni Google). */
  withTabs?: boolean;
  children: ReactNode;
}

export function AuthShell({ title, intro, withTabs = true, children }: AuthShellProps) {
  const [googleNote, setGoogleNote] = useState(false);
  // Al cambiar de pestaña se conserva a qué página volver después de entrar.
  const { state } = useLocation();

  return (
    <section className={`container ${styles.page}`}>
      <div className={styles.column}>
        <Eyebrow>Mi cuenta</Eyebrow>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.intro}>{intro}</p>

        {withTabs && (
          <nav className={styles.tabs} aria-label="Acceso a tu cuenta">
            <NavLink to="/cuenta/ingresar" state={state} replace className={tabClass}>
              Iniciar sesión
            </NavLink>
            <NavLink to="/cuenta/registro" state={state} replace className={tabClass}>
              Crear cuenta
            </NavLink>
          </nav>
        )}

        {children}

        {withTabs && (
          <>
            <p className={styles.divider}>
              <span>o</span>
            </p>
            <button type="button" className={styles.google} onClick={() => setGoogleNote(true)}>
              <GoogleMark />
              Continuar con Google
            </button>
            {googleNote && (
              <p className={styles.note} role="status">
                El acceso con Google se activará cuando conectemos el servicio de cuentas.
              </p>
            )}
          </>
        )}

        <p className={styles.demo}>
          Versión de demostración: todavía no se crean cuentas reales ni se envían correos.
        </p>
      </div>
    </section>
  );
}

const tabClass = ({ isActive }: { isActive: boolean }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab);

/* Campo de contraseña con botón Mostrar / Ocultar. */
export function PasswordInput(props: {
  id: string;
  name: string;
  autoComplete: 'current-password' | 'new-password';
  'aria-invalid': boolean;
  'aria-describedby'?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.password}>
      <input {...props} type={visible ? 'text' : 'password'} className={controlClass} />
      <button
        type="button"
        className={styles.reveal}
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-controls={props.id}
      >
        {visible ? 'Ocultar' : 'Mostrar'}
      </button>
    </div>
  );
}

/* "G" de Google (uso estándar en botones de acceso). */
function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}
