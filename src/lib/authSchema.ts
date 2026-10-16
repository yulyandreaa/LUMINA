import { z } from 'zod';

/*
 * Validación de los formularios de cuenta (iniciar sesión, crear cuenta, recuperar contraseña).
 * Los mismos esquemas servirán en el servidor cuando se conecte el servicio de cuentas real.
 */
const required = (msg: string) => z.string({ required_error: msg }).trim().min(1, msg);

const email = required('Escribe tu correo.').email('Escribe un correo válido.');

export const emailSchema = z.object({ email });

export const loginSchema = z.object({
  email,
  password: z.string({ required_error: 'Escribe tu contraseña.' }).min(1, 'Escribe tu contraseña.'),
});

export const PASSWORD_HINT = 'Mínimo 8 caracteres, con letras y números.';

export const registerSchema = z.object({
  firstName: required('Escribe tu nombre.').max(40),
  lastName: required('Escribe tu apellido.').max(40),
  email,
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ''))
    .pipe(z.string().regex(/^(3\d{9})?$/, 'Usa un celular de 10 dígitos, p. ej. 3001234567.'))
    .optional(),
  password: z
    .string({ required_error: 'Crea una contraseña.' })
    .min(8, PASSWORD_HINT)
    .max(72)
    .regex(/[A-Za-zÁÉÍÓÚÑáéíóúñ]/, PASSWORD_HINT)
    .regex(/\d/, PASSWORD_HINT),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar los términos y condiciones.' }) }),
  acceptData: z.literal(true, { errorMap: () => ({ message: 'Necesitamos tu autorización de tratamiento de datos.' }) }),
  newsletter: z.boolean(),
});

/** Convierte los errores de zod en { campo: primer mensaje }. */
export function fieldErrors(error: z.ZodError): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0]]));
}
