import { describe, expect, it } from 'vitest';
import { products } from '../data/products';
import {
  MAX_QUANTITY,
  cartCount,
  cartReducer,
  cartSubtotal,
  lineKey,
  parseStoredCart,
  resolveLines,
  type CartLine,
} from './cart';

const aura = { productId: 'p-aura', colorId: 'borgona', size: 'media' as const };
const coral = { productId: 'p-coral', colorId: 'rosa', size: 'estrecha' as const };

describe('cartReducer', () => {
  it('añade una línea nueva con cantidad 1', () => {
    expect(cartReducer([], { type: 'add', line: aura })).toEqual([{ ...aura, quantity: 1 }]);
  });

  it('la misma variante suma cantidad en vez de duplicar línea', () => {
    const s = cartReducer(cartReducer([], { type: 'add', line: aura }), { type: 'add', line: aura });
    expect(s).toHaveLength(1);
    expect(s[0].quantity).toBe(2);
  });

  it('otro color es otra línea', () => {
    const s = cartReducer(cartReducer([], { type: 'add', line: aura }), {
      type: 'add',
      line: { ...aura, colorId: 'negro' },
    });
    expect(s).toHaveLength(2);
  });

  it(`no supera el máximo de ${MAX_QUANTITY}`, () => {
    const s = cartReducer([], { type: 'add', line: aura, quantity: 50 });
    expect(s[0].quantity).toBe(MAX_QUANTITY);
  });

  it('cantidad 0 elimina la línea', () => {
    const s = cartReducer([{ ...aura, quantity: 2 }], { type: 'setQuantity', key: lineKey(aura), quantity: 0 });
    expect(s).toEqual([]);
  });

  it('remove y clear', () => {
    const start: CartLine[] = [
      { ...aura, quantity: 1 },
      { ...coral, quantity: 1 },
    ];
    expect(cartReducer(start, { type: 'remove', key: lineKey(aura) })).toEqual([{ ...coral, quantity: 1 }]);
    expect(cartReducer(start, { type: 'clear' })).toEqual([]);
  });

  it('no muta el estado anterior', () => {
    const start: CartLine[] = [{ ...aura, quantity: 1 }];
    cartReducer(start, { type: 'add', line: aura });
    expect(start[0].quantity).toBe(1);
  });
});

describe('resolveLines y totales', () => {
  it('calcula el subtotal con el precio del catálogo', () => {
    const lines = resolveLines(
      [
        { ...aura, quantity: 2 },
        { ...coral, quantity: 1 },
      ],
      products,
    );
    expect(cartSubtotal(lines)).toBe(420000 * 2 + 430000);
    expect(cartCount(lines)).toBe(3);
  });

  it('descarta productos, colores o tallas inexistentes', () => {
    const lines = resolveLines(
      [
        { productId: 'p-no-existe', colorId: 'x', size: 'media', quantity: 1 },
        { ...aura, colorId: 'verde', quantity: 1 },
        { ...aura, size: 'extra-ancha', quantity: 1 },
      ],
      products,
    );
    expect(lines).toEqual([]);
  });
});

describe('parseStoredCart', () => {
  it('tolera vacío, JSON roto y datos manipulados', () => {
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart('{roto')).toEqual([]);
    expect(parseStoredCart('{"a":1}')).toEqual([]);
    const raw = JSON.stringify([
      { ...aura, quantity: 3, price: 1 }, // el precio inyectado se ignora
      { ...coral, quantity: -2 },
      { productId: 5 },
    ]);
    expect(parseStoredCart(raw)).toEqual([{ ...aura, quantity: 3 }]);
  });
});
