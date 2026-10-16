import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { endAdminSession, readAdminSession } from './adminSessionStorage';

/*
 * Sesión del panel de administración (DEMOSTRACIÓN), separada de la de clientes.
 * Se entra desde el mismo "Iniciar sesión" de Mi cuenta: si el correo es de administrador,
 * se abre el panel en vez de la cuenta de cliente (ver LoginPage).
 */
interface AdminSessionValue {
  email: string | null;
  signOut: () => void;
}

const AdminSessionContext = createContext<AdminSessionValue | null>(null);

/* Envuelve todas las rutas /admin. */
export function AdminRoot({ children }: { children?: ReactNode }) {
  const [email, setEmail] = useState<string | null>(readAdminSession);

  const signOut = useCallback(() => {
    endAdminSession();
    setEmail(null);
  }, []);

  const value = useMemo(() => ({ email, signOut }), [email, signOut]);
  return <AdminSessionContext.Provider value={value}>{children ?? <Outlet />}</AdminSessionContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminSession(): AdminSessionValue {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error('useAdminSession debe usarse dentro de <AdminRoot>');
  return ctx;
}
