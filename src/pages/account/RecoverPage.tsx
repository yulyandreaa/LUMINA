import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { emailSchema, fieldErrors } from '../../lib/authSchema';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { controlClass } from '../../components/ui/fieldStyles';
import { AuthShell } from './AuthShell';
import styles from './Auth.module.css';

/*
 * Recuperar contraseña. El mensaje final es el mismo exista o no la cuenta
 * (así nadie puede averiguar qué correos están registrados).
 */
export function RecoverPage() {
  usePageTitle('Recuperar contraseña');
  const [error, setError] = useState<string>();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) return setError(fieldErrors(parsed.error).email);
    setError(undefined);
    setSentTo(parsed.data.email);
  };

  return (
    <AuthShell
      withTabs={false}
      title="Recupera tu contraseña"
      intro="Escribe el correo de tu cuenta y te enviaremos un enlace para crear una nueva."
    >
      {sentTo ? (
        <div className={styles.form} role="status">
          <p className={styles.sent}>
            Si existe una cuenta con <strong>{sentTo}</strong>, te llegará un enlace en unos minutos. Revisa también la
            carpeta de spam.
          </p>
          <Link to="/cuenta/ingresar" className="text-link">
            Volver a iniciar sesión
          </Link>
        </div>
      ) : (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <Field id="email" label="Correo electrónico" error={error}>
            {(a) => <input {...a} name="email" type="email" autoComplete="email" className={controlClass} />}
          </Field>
          <Button type="submit" className={styles.submit}>
            Enviar enlace
          </Button>
          <Link to="/cuenta/ingresar" className={styles.forgot}>
            Volver a iniciar sesión
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
