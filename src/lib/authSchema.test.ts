import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './authSchema';

const validRegister = {
  firstName: 'Ana',
  lastName: 'Gómez',
  email: 'ana@correo.co',
  phone: '',
  password: 'lumina2026',
  acceptTerms: true,
  acceptData: true,
  newsletter: false,
};

describe('cuentas', () => {
  it('inicio de sesión exige correo válido y contraseña', () => {
    expect(loginSchema.safeParse({ email: 'ana@correo.co', password: 'x' }).success).toBe(true);
    expect(loginSchema.safeParse({ email: 'ana', password: 'x' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'ana@correo.co', password: '' }).success).toBe(false);
  });

  it('el registro acepta celular vacío y exige contraseña con letras y números', () => {
    expect(registerSchema.safeParse(validRegister).success).toBe(true);
    expect(registerSchema.safeParse({ ...validRegister, password: 'corta1' }).success).toBe(false);
    expect(registerSchema.safeParse({ ...validRegister, password: 'solamenteletras' }).success).toBe(false);
    expect(registerSchema.safeParse({ ...validRegister, password: '1234567890' }).success).toBe(false);
  });

  it('el registro valida el celular si se escribe y exige las autorizaciones', () => {
    expect(registerSchema.safeParse({ ...validRegister, phone: '300 123 4567' }).success).toBe(true);
    expect(registerSchema.safeParse({ ...validRegister, phone: '12345' }).success).toBe(false);
    expect(registerSchema.safeParse({ ...validRegister, acceptData: false }).success).toBe(false);
  });
});
