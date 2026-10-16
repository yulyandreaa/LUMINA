import { createContext, useContext } from 'react';

/*
 * Contrato de la sesión de cliente para toda la app: const auth = useAuth();
 * ⚠️ Por ahora es una sesión de DEMOSTRACIÓN (AuthProvider la guarda en este navegador).
 * Cuando se conecte el servicio de cuentas real, solo cambia AuthProvider; las pantallas no.
 */
/** Solo el correo: el nombre y el apellido viven en los datos de la cuenta (perfil). */
export interface Customer {
  email: string;
}

export interface AuthContextValue {
  customer: Customer | null;
  signIn: (customer: Customer) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
