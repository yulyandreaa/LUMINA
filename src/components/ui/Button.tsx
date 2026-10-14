import type { ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import styles from './Button.module.css';

/*
 * Botón píldora de LUMINA (tablero de marca: "Uso en la interfaz").
 * - primary: relleno borgoña, texto marfil.
 * - secondary: contorno borgoña.
 * Si recibe `to`, se renderiza como enlace interno; si no, como <button>.
 */
type Variant = 'primary' | 'secondary';

interface BaseProps {
  variant?: Variant;
  withArrow?: boolean;
}

type ButtonAsButton = BaseProps & ComponentPropsWithoutRef<'button'> & { to?: undefined };
type ButtonAsLink = BaseProps & Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { to: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', withArrow = false, className, children, ...rest } = props;
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ');
  const content = (
    <>
      <span>{children}</span>
      {withArrow && <Icon name="arrow" size={18} className={styles.arrow} />}
    </>
  );

  if (rest.to !== undefined) {
    const { to, ...linkProps } = rest as ButtonAsLink;
    return (
      <Link to={to} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {content}
    </button>
  );
}
