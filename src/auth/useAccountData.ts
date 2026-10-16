import { createContext, useContext } from 'react';
import type { Address, Profile } from '../lib/accountSchema';
import type { ExamRequest } from '../lib/examSchema';
import type { Favorite } from '../lib/favorites';

/*
 * Datos de la cuenta en la DEMOSTRACIÓN: perfil, direcciones, citas y favoritos.
 * Un solo estado compartido (AccountDataProvider) para que, p. ej., marcar un favorito
 * en una tarjeta se vea al instante en todas las demás.
 * Cuando exista el servicio de cuentas real, el proveedor pedirá los datos a la API
 * y las pantallas seguirán igual.
 */
export interface Appointment extends Omit<ExamRequest, 'acceptData'> {
  id: string;
  createdAt: string;
}

export interface AccountData {
  profile: Partial<Profile>;
  addresses: Address[];
  appointments: Appointment[];
  favorites: Favorite[];
}

export interface AccountDataValue {
  data: AccountData;
  update: (change: (d: AccountData) => AccountData) => void;
}

export const AccountDataContext = createContext<AccountDataValue | null>(null);

export function useAccountData(): AccountDataValue {
  const ctx = useContext(AccountDataContext);
  if (!ctx) throw new Error('useAccountData debe usarse dentro de <AccountDataProvider>');
  return ctx;
}

export const newId = () => Math.random().toString(36).slice(2, 10);
