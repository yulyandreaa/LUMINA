import wordmark from '../../assets/brand/logo-wordmark.png';
import wordmarkIvory from '../../assets/brand/logo-wordmark-marfil.png';

/*
 * Logotipo recortado de la imagen proporcionada por LUMINA (PNG con transparencia).
 * Cuando exista el archivo vectorial, se sustituye aquí por un SVG
 * y todo el sitio se actualiza a la vez.
 */
interface LogoProps {
  variant?: 'burgundy' | 'ivory';
  className?: string;
}

export function Logo({ variant = 'burgundy', className }: LogoProps) {
  return (
    <img
      src={variant === 'ivory' ? wordmarkIvory : wordmark}
      alt="LUMINA"
      className={className}
      width={1975}
      height={445}
    />
  );
}
