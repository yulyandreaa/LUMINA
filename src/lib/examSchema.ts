import { z } from 'zod';
import { stores } from '../data/stores';

/*
 * Solicitud de cita para examen visual.
 * Horario de las tiendas: 10:00 a. m. – 7:00 p. m. → citas cada hora de 10:00 a 18:00
 * (la última empieza a las 6 p. m. para terminar antes del cierre).
 * Se puede agendar desde mañana y hasta 60 días adelante.
 */
export const MAX_DAYS_AHEAD = 60;

export const timeSlots = Array.from({ length: 9 }, (_, i) => `${String(10 + i).padStart(2, '0')}:00`);

/** "2026-10-15" a partir de una fecha, en hora local (no UTC). */
export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function dateRange(today = new Date()) {
  const min = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + MAX_DAYS_AHEAD);
  return { min: toISODate(min), max: toISODate(max) };
}

export const examReasons = [
  { value: 'primera-vez', label: 'Es mi primer examen' },
  { value: 'control', label: 'Control de rutina' },
  { value: 'molestias', label: 'Noto cambios o molestias al ver' },
] as const;

const storeIds = stores.map((s) => s.id) as [string, ...string[]];
const required = (msg: string) => z.string({ required_error: msg }).trim().min(1, msg);

export function makeExamSchema(today = new Date()) {
  const { min, max } = dateRange(today);
  return z.object({
    store: z.enum(storeIds, { message: 'Elige una tienda.' }),
    date: required('Elige un día.')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Elige un día.')
      // Las fechas ISO se comparan bien como texto.
      .refine((d) => d >= min && d <= max, `Elige un día entre mañana y los próximos ${MAX_DAYS_AHEAD} días.`),
    time: z.enum(timeSlots as [string, ...string[]], { message: 'Elige una hora.' }),
    fullName: required('Escribe tu nombre completo.').min(5, 'Escribe nombre y apellido.').max(80),
    phone: required('Escribe tu celular.')
      .transform((v) => v.replace(/[\s-]/g, ''))
      .pipe(z.string().regex(/^3\d{9}$/, 'Usa un celular de 10 dígitos, p. ej. 3001234567.')),
    email: required('Escribe tu correo.').email('Escribe un correo válido.'),
    reason: z.enum(['primera-vez', 'control', 'molestias']).optional(),
    acceptData: z.literal(true, { errorMap: () => ({ message: 'Necesitamos tu autorización de tratamiento de datos.' }) }),
  });
}

export type ExamRequest = z.infer<ReturnType<typeof makeExamSchema>>;
