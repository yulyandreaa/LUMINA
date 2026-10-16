import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue, type Customer } from './AuthContext';

/*
 * Sesión de DEMOSTRACIÓN: no hay servidor de cuentas todavía.
 * Guarda solo el correo en localStorage para poder recorrer las pantallas
 * (nunca la contraseña). Se reemplaza por el servicio real (p. ej. Supabase) más adelante.
 */
const STORAGE_KEY = 'lumina.demo-session.v2';

function readSession(): Customer | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Partial<Customer>) : null;
    return data?.email ? { email: data.email } : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(readSession);

  const signIn = useCallback((c: Customer) => {
    setCustomer(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    } catch {
      /* sin persistencia: la sesión dura hasta recargar */
    }
  }, []);

  const signOut = useCallback(() => {
    setCustomer(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nada que borrar */
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ customer, signIn, signOut }), [customer, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
