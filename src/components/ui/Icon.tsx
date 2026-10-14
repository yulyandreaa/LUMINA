/*
 * Iconos de línea fina (estilo del tablero de marca).
 * Heredan el color del texto con currentColor y son decorativos por defecto:
 * el botón que los contiene es quien lleva el aria-label.
 */
const paths = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" /></>,
  bag: <><path d="M5 8h14l-1 12.5H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  menu: <><path d="M3.5 7h17" /><path d="M3.5 12h17" /><path d="M3.5 17h17" /></>,
  close: <><path d="m5.5 5.5 13 13" /><path d="m18.5 5.5-13 13" /></>,
  arrow: <><path d="M4 12h15" /><path d="m14 7 5 5-5 5" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />,
  pause: <><path d="M9 5.5v13" /><path d="M15 5.5v13" /></>,
};

export type IconName = keyof typeof paths;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
