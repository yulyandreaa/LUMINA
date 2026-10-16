import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { toggleFavorite } from '../lib/favorites';
import { useAuth } from './AuthContext';
import { read, takePendingFavorite, write } from './accountStorage';
import { AccountDataContext, type AccountData, type AccountDataValue } from './useAccountData';

/*
 * Estado compartido de los datos de la cuenta (lectura/escritura en accountStorage.ts).
 * Favorito pendiente: si alguien toca el corazón sin sesión, FavoriteButton lo deja en
 * sessionStorage; al iniciar sesión se guarda en su cuenta automáticamente.
 */
export function AccountDataProvider({ children }: { children: ReactNode }) {
  const { customer } = useAuth();
  const email = customer?.email;
  const [data, setData] = useState<AccountData>(() => read(email));

  // Al cambiar quién inició sesión: cargar sus datos y guardar el favorito pendiente, si lo hay.
  useEffect(() => {
    let loaded = read(email);
    const pending = email ? takePendingFavorite() : null;
    if (email && pending && !loaded.favorites.some((f) => f.productId === pending.productId)) {
      loaded = { ...loaded, favorites: toggleFavorite(loaded.favorites, pending) };
      write(email, loaded);
    }
    setData(loaded);
  }, [email]);

  const update = useCallback(
    (change: (d: AccountData) => AccountData) => {
      if (!email) return;
      setData((prev) => {
        const next = change(prev);
        write(email, next);
        return next;
      });
    },
    [email],
  );

  const value = useMemo<AccountDataValue>(() => ({ data, update }), [data, update]);
  return <AccountDataContext.Provider value={value}>{children}</AccountDataContext.Provider>;
}
