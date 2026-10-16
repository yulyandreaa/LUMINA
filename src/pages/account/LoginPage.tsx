import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { startAdminSession } from '../../admin/adminSessionStorage';
import { fieldErrors, loginSchema } from '../../lib/authSchema';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { controlClass } from '../../components/ui/fieldStyles';
import { AuthShell, PasswordInput } from './AuthShell';
import styles from './Auth.module.css';

/*
 * Iniciar sesión con correo y contraseña (o con Google, en AuthShell).
 * En la demostración cualquier contraseña sirve.
 * Al entrar vuelve a la página que pidió la sesión (state.from) o a /cuenta.
 * Si el correo es de administrador, abre el panel de administración (/admin) y no la cuenta de cliente.
 */
type Errors = Record<string, string | undefined>;

export function LoginPage() {
  usePageTitle('Iniciar sesión');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/cuenta';
  const [errors, setErrors] = useState<Errors>({});

  const enter = (email: string) => {
    if (startAdminSession(email)) {
      navigate(from.startsWith('/admin') ? from : '/admin', { replace: true });
      return;
    }
    signIn({ email });
    // Un cliente nunca vuelve al panel (lo mandaría de regreso aquí).
    navigate(from.startsWith('/admin') ? '/cuenta' : from, { replace: true });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    enter(parsed.data.email);
  };

  return (
    <AuthShell title="Hola de nuevo" intro="Entra para ver tus pedidos, tus citas y tus monturas favoritas.">
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <Field id="email" label="Correo electrónico" error={errors.email}>
          {(a) => <input {...a} name="email" type="email" autoComplete="email" className={controlClass} />}
        </Field>
        <Field id="password" label="Contraseña" error={errors.password}>
          {(a) => <PasswordInput {...a} name="password" autoComplete="current-password" />}
        </Field>
        <Link to="/cuenta/recuperar" className={styles.forgot}>
          ¿Olvidaste tu contraseña?
        </Link>
        <Button type="submit" className={styles.submit}>
          Iniciar sesión
        </Button>
      </form>
    </AuthShell>
  );
}
