import type { ReactNode } from 'react';
import styles from './Field.module.css';

/*
 * Campo de formulario accesible: etiqueta + control + ayuda/error.
 * El control recibe por props el id y aria-describedby para enlazar el mensaje de error.
 */
interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: (a11y: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode;
}

export function Field({ id, label, error, hint, optional, className, children }: FieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> (opcional)</span>}
      </label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}
