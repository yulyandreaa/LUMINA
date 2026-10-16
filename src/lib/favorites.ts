/*
 * Favoritos: uno por producto, recordando el color con el que se guardó.
 * Lógica pura (sin React) para poder probarla.
 */
export interface Favorite {
  productId: string;
  colorId: string;
  addedAt: string;
}

export const isFavorite = (list: Favorite[], productId: string) => list.some((f) => f.productId === productId);

/** Si el producto ya está, lo quita; si no, lo agrega al principio (los más recientes primero). */
export function toggleFavorite(
  list: Favorite[],
  item: Omit<Favorite, 'addedAt'>,
  now = new Date().toISOString(),
): Favorite[] {
  return isFavorite(list, item.productId)
    ? list.filter((f) => f.productId !== item.productId)
    : [{ ...item, addedAt: now }, ...list];
}
