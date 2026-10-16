import { describe, expect, it } from 'vitest';
import { dateRange, makeExamSchema, timeSlots } from './examSchema';

const today = new Date(2026, 9, 14); // 14 oct 2026, hora local

const valid = {
  store: 'usaquen',
  date: '2026-10-15',
  time: '10:00',
  fullName: 'Ana Gómez',
  phone: '300 123 4567',
  email: 'ana@correo.co',
  acceptData: true,
};

describe('examen visual', () => {
  it('ofrece citas cada hora de 10:00 a 18:00', () => {
    expect(timeSlots[0]).toBe('10:00');
    expect(timeSlots.at(-1)).toBe('18:00');
    expect(timeSlots).toHaveLength(9);
  });

  it('permite agendar desde mañana hasta 60 días', () => {
    expect(dateRange(today)).toEqual({ min: '2026-10-15', max: '2026-12-13' });
  });

  it('acepta una solicitud válida y limpia el celular', () => {
    const r = makeExamSchema(today).safeParse(valid);
    expect(r.success && r.data.phone).toBe('3001234567');
  });

  it('rechaza hoy, fechas lejanas, horas fuera de horario y tiendas inexistentes', () => {
    const schema = makeExamSchema(today);
    expect(schema.safeParse({ ...valid, date: '2026-10-14' }).success).toBe(false);
    expect(schema.safeParse({ ...valid, date: '2027-01-30' }).success).toBe(false);
    expect(schema.safeParse({ ...valid, time: '19:00' }).success).toBe(false);
    expect(schema.safeParse({ ...valid, store: 'medellin' }).success).toBe(false);
  });

  it('exige la autorización de datos', () => {
    expect(makeExamSchema(today).safeParse({ ...valid, acceptData: false }).success).toBe(false);
  });
});
