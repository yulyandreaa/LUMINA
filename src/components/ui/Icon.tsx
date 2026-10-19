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
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  store: <><path d="M4 9.5 5.5 4.5h13L20 9.5" /><path d="M4 9.5h16v1a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0 2.7 2.7 0 0 1-5.3 0v-1Z" /><path d="M5.5 13v6.5h13V13" /><path d="M10 19.5v-4h4v4" /></>,
  shield: <><path d="M12 3.5 19 6v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6l7-2.5Z" /><path d="m9 12 2.2 2.2L15.5 10" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />,
  /* Destello de cuatro puntas, como el de la A del logotipo. */
  spark: <path d="M12 3c.6 5 2.6 8 9 9-6.4 1-8.4 4-9 9-.6-5-2.6-8-9-9 6.4-1 8.4-4 9-9Z" />,
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
