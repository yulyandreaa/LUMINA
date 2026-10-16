import { describe, expect, it } from 'vitest';
import { isFavorite, toggleFavorite } from './favorites';

describe('favoritos', () => {
  it('agrega al principio y quita si ya estaba', () => {
    let list = toggleFavorite([], { productId: 'p-aura', colorId: 'borgona' }, '2026-10-14');
    list = toggleFavorite(list, { productId: 'p-bruma', colorId: 'negro' }, '2026-10-15');
    expect(list.map((f) => f.productId)).toEqual(['p-bruma', 'p-aura']);
    expect(isFavorite(list, 'p-aura')).toBe(true);

    list = toggleFavorite(list, { productId: 'p-aura', colorId: 'carey' });
    expect(isFavorite(list, 'p-aura')).toBe(false);
    expect(list).toHaveLength(1);
  });
});
