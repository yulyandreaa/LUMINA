import { describe, expect, it } from 'vitest';
import { addressSchema, profileSchema, removeAddress, upsertAddress, type Address } from './accountSchema';

const base: Omit<Address, 'id' | 'isDefault'> = {
  label: 'Casa',
  region: 'Bogotá D.C.',
  city: 'Bogotá',
  address: 'Calle 70 # 10-20',
};

describe('mi cuenta', () => {
  it('el perfil acepta celular y documento vacíos', () => {
    const r = profileSchema.safeParse({ firstName: 'Ana', lastName: 'Gómez', phone: '', legalId: '' });
    expect(r.success && r.data.phone).toBeUndefined();
  });

  it('la dirección exige departamento válido y dirección completa', () => {
    expect(addressSchema.safeParse({ ...base, isDefault: false }).success).toBe(true);
    expect(addressSchema.safeParse({ ...base, region: 'Narnia', isDefault: false }).success).toBe(false);
    expect(addressSchema.safeParse({ ...base, address: 'Cl', isDefault: false }).success).toBe(false);
  });

  it('la primera dirección queda como principal y solo hay una principal', () => {
    let list = upsertAddress([], { ...base, id: 'a', isDefault: false });
    expect(list[0].isDefault).toBe(true);
    list = upsertAddress(list, { ...base, id: 'b', label: 'Oficina', isDefault: true });
    expect(list.filter((a) => a.isDefault).map((a) => a.id)).toEqual(['b']);
  });

  it('al borrar la principal, otra pasa a ser principal', () => {
    const list: Address[] = [
      { ...base, id: 'a', isDefault: true },
      { ...base, id: 'b', isDefault: false },
    ];
    expect(removeAddress(list, 'a')).toEqual([{ ...base, id: 'b', isDefault: true }]);
  });
});
