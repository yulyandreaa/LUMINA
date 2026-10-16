import type { Favorite } from '../lib/favorites';
import type { AccountData } from './useAccountData';

/*
 * Lectura y escritura de los datos de cada cliente en este navegador (DEMOSTRACIÓN), por correo.
 */
const empty: AccountData = { profile: {}, addresses: [], appointments: [], favorites: [] };
const keyFor = (email: string) => `lumina.account.v1:${email.toLowerCase()}`;
export const PENDING_FAVORITE_KEY = 'lumina.pending-favorite';

export function read(email: string | undefined): AccountData {
  if (!email) return empty;
  try {
    const raw = window.localStorage.getItem(keyFor(email));
    return raw ? { ...empty, ...(JSON.parse(raw) as Partial<AccountData>) } : empty;
  } catch {
    return empty;
  }
}

export function write(email: string, data: AccountData) {
  try {
    window.localStorage.setItem(keyFor(email), JSON.stringify(data));
  } catch {
    /* sin persistencia: los cambios duran hasta recargar */
  }
}

/** Guarda datos de perfil antes de iniciar sesión (al crear la cuenta). */
export function saveProfile(email: string, profile: AccountData['profile']) {
  const current = read(email);
  write(email, { ...current, profile: { ...current.profile, ...profile } });
}

export function takePendingFavorite(): Omit<Favorite, 'addedAt'> | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_FAVORITE_KEY);
    window.sessionStorage.removeItem(PENDING_FAVORITE_KEY);
    return raw ? (JSON.parse(raw) as Omit<Favorite, 'addedAt'>) : null;
  } catch {
    return null;
  }
}
