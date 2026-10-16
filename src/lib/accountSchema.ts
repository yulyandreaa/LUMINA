import { z } from 'zod';
import { departments } from './checkoutSchema';

/*
 * Datos de "Mi cuenta": perfil y direcciones de envío.
 * Reutiliza los departamentos del checkout para que una dirección guardada sirva al comprar.
 */
const required = (msg: string) => z.string({ required_error: msg }).trim().min(1, msg);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || undefined)
    .optional();

export const profileSchema = z.object({
  firstName: required('Escribe tu nombre.').max(40),
  lastName: required('Escribe tu apellido.').max(40),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ''))
    .pipe(z.string().regex(/^(3\d{9})?$/, 'Usa un celular de 10 dígitos, p. ej. 3001234567.'))
    .transform((v) => v || undefined)
    .optional(),
  legalIdType: z.enum(['CC', 'CE', 'PP', 'NIT']).optional(),
  legalId: z
    .string()
    .trim()
    .regex(/^([0-9A-Za-z-]{5,15})?$/, 'Revisa el número de documento.')
    .transform((v) => v || undefined)
    .optional(),
});

export const addressSchema = z.object({
  label: required('Ponle un nombre, p. ej. Casa u Oficina.').max(30),
  region: z.enum(departments, { message: 'Elige un departamento.' }),
  city: required('Escribe tu ciudad o municipio.').max(60),
  address: required('Escribe la dirección.').min(5, 'La dirección parece incompleta.').max(120),
  address2: optionalText(120),
  isDefault: z.boolean(),
});

export type Profile = z.infer<typeof profileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export interface Address extends AddressInput {
  id: string;
}

/** Guarda o actualiza una dirección. Si es la principal, las demás dejan de serlo; siempre queda una principal. */
export function upsertAddress(list: Address[], address: Address): Address[] {
  const exists = list.some((a) => a.id === address.id);
  let next = exists ? list.map((a) => (a.id === address.id ? address : a)) : [...list, address];
  if (address.isDefault) next = next.map((a) => ({ ...a, isDefault: a.id === address.id }));
  return ensureDefault(next);
}

export function removeAddress(list: Address[], id: string): Address[] {
  return ensureDefault(list.filter((a) => a.id !== id));
}

function ensureDefault(list: Address[]): Address[] {
  if (list.length === 0 || list.some((a) => a.isDefault)) return list;
  return list.map((a, i) => ({ ...a, isDefault: i === 0 }));
}
