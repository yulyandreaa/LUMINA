import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { saveProfile } from '../../auth/accountStorage';
import { fieldErrors, PASSWORD_HINT, registerSchema } from '../../lib/authSchema';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { controlClass } from '../../components/ui/fieldStyles';
import { AuthShell, PasswordInput } from './AuthShell';
import styles from './Auth.module.css';

/*
 * Crear cuenta: nombre, apellido, correo, celular (opcional) y contraseña,
 * con las autorizaciones obligatorias (términos y Ley 1581) y el boletín opcional (desmarcado).
 */
type Errors = Record<string, string | undefined>;

export function RegisterPage() {
  usePageTitle('Crear cuenta');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/cuenta';
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = registerSchema.safeParse({
      ...data,
      acceptTerms: data.acceptTerms === 'on',
      acceptData: data.acceptData === 'on',
      newsletter: data.newsletter === 'on',
    });
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    const { email, firstName, lastName, phone } = parsed.data;
    saveProfile(email, { firstName, lastName, phone: phone || undefined });
    signIn({ email });
    navigate(from, { replace: true });
  };

  return (
    <AuthShell title="Crea tu cuenta" intro="Guarda tus datos para comprar más rápido y sigue tus pedidos y citas.">
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.row}>
          <Field id="firstName" label="Nombre" error={errors.firstName}>
            {(a) => <input {...a} name="firstName" autoComplete="given-name" className={controlClass} />}
          </Field>
          <Field id="lastName" label="Apellido" error={errors.lastName}>
            {(a) => <input {...a} name="lastName" autoComplete="family-name" className={controlClass} />}
          </Field>
        </div>
        <Field id="email" label="Correo electrónico" error={errors.email}>
          {(a) => <input {...a} name="email" type="email" autoComplete="email" className={controlClass} />}
        </Field>
        <Field id="phone" label="Celular" optional error={errors.phone}>
          {(a) => <input {...a} name="phone" type="tel" autoComplete="tel" className={controlClass} />}
        </Field>
        <Field id="password" label="Contraseña" error={errors.password} hint={PASSWORD_HINT}>
          {(a) => <PasswordInput {...a} name="password" autoComplete="new-password" />}
        </Field>

        <div className={styles.checks}>
          <label className={styles.check}>
            <input type="checkbox" name="acceptTerms" aria-invalid={!!errors.acceptTerms} />
            <span>
              Acepto los <Link to="/terminos">términos y condiciones</Link>.
            </span>
          </label>
          {errors.acceptTerms && <p className={styles.error}>{errors.acceptTerms}</p>}
          <label className={styles.check}>
            <input type="checkbox" name="acceptData" aria-invalid={!!errors.acceptData} />
            <span>
              Autorizo el <Link to="/tratamiento-de-datos">tratamiento de mis datos personales</Link> (Ley 1581 de
              2012).
            </span>
          </label>
          {errors.acceptData && <p className={styles.error}>{errors.acceptData}</p>}
          <label className={styles.check}>
            <input type="checkbox" name="newsletter" />
            <span>Quiero recibir novedades y lanzamientos de LUMINA por correo.</span>
          </label>
        </div>

        <Button type="submit" className={styles.submit}>
          Crear cuenta
        </Button>
      </form>
    </AuthShell>
  );
}
