import { isAdmin } from '../auth/admin';

/*
 * Guardado de la sesión del panel (DEMOSTRACIÓN), aparte de la sesión de clientes.
 * La abre el inicio de sesión de "Mi cuenta" cuando el correo es de administrador.
 */
export const ADMIN_SESSION_KEY = 'lumina.admin-session.v1';

export function readAdminSession(): string | null {
  try {
    const email = window.localStorage.getItem(ADMIN_SESSION_KEY);
    return isAdmin(email) ? email : null;
  } catch {
    return null;
  }
}

/** Devuelve false si el correo no es de administrador. */
export function startAdminSession(email: string): boolean {
  const clean = email.trim().toLowerCase();
  if (!isAdmin(clean)) return false;
  try {
    window.localStorage.setItem(ADMIN_SESSION_KEY, clean);
  } catch {
    /* sin persistencia: el panel pedirá entrar de nuevo al recargar */
  }
  return true;
}

export function endAdminSession() {
  try {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    /* nada que borrar */
  }
}
