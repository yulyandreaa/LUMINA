import { z } from 'zod';

/*
 * Esquema del pedido, COMPARTIDO entre navegador y servidor.
 * - En el navegador: muestra errores campo a campo antes de enviar.
 * - En el servidor: vuelve a validar (nunca se confía en lo que llega del navegador).
 */

export const departments = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas',
  'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía',
  'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander',
  'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre',
  'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
] as const;

export const legalIdTypes = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'PP', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' },
] as const;

const required = (msg: string) => z.string({ required_error: msg }).trim().min(1, msg);

export const customerSchema = z.object({
  email: required('Escribe tu correo.').email('Escribe un correo válido.'),
  fullName: required('Escribe tu nombre completo.').min(5, 'Escribe nombre y apellido.').max(80),
  legalIdType: z.enum(['CC', 'CE', 'PP', 'NIT'], { message: 'Elige un tipo de documento.' }),
  legalId: required('Escribe tu número de documento.').regex(/^[0-9A-Za-z-]{5,15}$/, 'Revisa el número de documento.'),
  // Móvil colombiano (3xx xxx xxxx) o fijo nacional (60x xxx xxxx), 10 dígitos.
  phone: required('Escribe tu teléfono.')
    .transform((v) => v.replace(/[\s-]/g, ''))
    .pipe(z.string().regex(/^(3\d{9}|60\d{8})$/, 'Usa 10 dígitos, p. ej. 3001234567.')),
  region: z.enum(departments, { message: 'Elige un departamento.' }),
  city: required('Escribe tu ciudad o municipio.').max(60),
  address: required('Escribe tu dirección.').min(5, 'La dirección parece incompleta.').max(120),
  address2: z.string().trim().max(120).optional(),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar los términos y condiciones.' }) }),
  acceptData: z.literal(true, { errorMap: () => ({ message: 'Necesitamos tu autorización de tratamiento de datos.' }) }),
});

export const orderLineSchema = z.object({
  productId: z.string().max(40),
  colorId: z.string().max(40),
  size: z.enum(['estrecha', 'media', 'ancha', 'extra-ancha']),
  quantity: z.number().int().min(1).max(10),
});

export const checkoutRequestSchema = z.object({
  customer: customerSchema,
  lines: z.array(orderLineSchema).min(1, 'La cesta está vacía.').max(20),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

/** Respuesta del servidor al crear el pago. */
export type CheckoutResponse = { checkoutUrl: string; reference: string } | { error: string };

/** Estado de una transacción tal como lo devuelve nuestro servidor. */
export interface TransactionStatus {
  status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING';
  reference: string;
  amountInCents: number;
}
