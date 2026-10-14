/*
 * Estructura de navegación. Replica la de la referencia
 * (Categoría · Color · Forma · Talla en el megamenú) con el catálogo de LUMINA v1:
 * solo monturas y gafas de sol, sin lentes graduadas.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  href: string;
  /** Si existe, el elemento abre un megamenú. */
  columns?: NavColumn[];
}

const byColor = (base: string): NavColumn => ({
  title: 'Por color',
  links: [
    ['Borgoña', 'borgona'],
    ['Negro', 'negro'],
    ['Carey', 'carey'],
    ['Cristal', 'cristal'],
    ['Rosa', 'rosa'],
    ['Dorado', 'dorado'],
  ].map(([label, id]) => ({ label, href: `${base}?color=${id}` })),
});

const byShape = (base: string): NavColumn => ({
  title: 'Por forma',
  links: [
    ['Redonda', 'redonda'],
    ['Cuadrada', 'cuadrada'],
    ['Aviador', 'aviador'],
    ['Cat-eye', 'cat-eye'],
    ['Geométrica', 'geometrica'],
  ].map(([label, id]) => ({ label, href: `${base}?forma=${id}` })),
});

const bySize = (base: string): NavColumn => ({
  title: 'Por talla',
  links: [
    ['Estrecha', 'estrecha'],
    ['Media', 'media'],
    ['Ancha', 'ancha'],
    ['Extra ancha', 'extra-ancha'],
  ].map(([label, id]) => ({ label, href: `${base}?talla=${id}` })),
});

const categoryColumn = (base: string, label: string): NavColumn => ({
  title: label,
  links: [
    { label: 'Ver todo', href: base },
    { label: 'Más vendidos', href: `${base}?orden=mas-vendidos` },
    { label: 'Novedades', href: `${base}?orden=novedades` },
    { label: 'Mujer', href: `${base}?para=mujer` },
    { label: 'Hombre', href: `${base}?para=hombre` },
  ],
});

export const mainNav: NavItem[] = [
  {
    label: 'Monturas',
    href: '/monturas',
    columns: [
      categoryColumn('/monturas', 'Monturas'),
      byColor('/monturas'),
      byShape('/monturas'),
      bySize('/monturas'),
    ],
  },
  {
    label: 'Gafas de sol',
    href: '/gafas-de-sol',
    columns: [
      categoryColumn('/gafas-de-sol', 'Gafas de sol'),
      byColor('/gafas-de-sol'),
      byShape('/gafas-de-sol'),
      bySize('/gafas-de-sol'),
    ],
  },
  { label: 'Tiendas', href: '/tiendas' },
];

export const announcements: string[] = [
  'Más visión para tu mundo',
  'Ver bien también es sentir bien',
  'Nueva colección · Una nueva perspectiva',
];

export const footerColumns: NavColumn[] = [
  {
    title: 'Empresa',
    links: [
      { label: 'Nuestra historia', href: '/nosotros' },
      { label: 'Tiendas', href: '/tiendas' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
  {
    title: 'Marca',
    links: [
      { label: 'Talla y ajuste', href: '/talla-y-ajuste' },
      { label: 'Cuidado de tus gafas', href: '/cuidado' },
      { label: 'Diario', href: '/diario' },
    ],
  },
  {
    title: 'Productos',
    links: [
      { label: 'Monturas', href: '/monturas' },
      { label: 'Gafas de sol', href: '/gafas-de-sol' },
      { label: 'Más vendidos', href: '/monturas?orden=mas-vendidos' },
      { label: 'Novedades', href: '/monturas?orden=novedades' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Envíos y devoluciones', href: '/envios-y-devoluciones' },
      { label: 'Garantía', href: '/garantia' },
      { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: 'Términos y condiciones', href: '/terminos' },
  { label: 'Política de privacidad', href: '/privacidad' },
  { label: 'Tratamiento de datos', href: '/tratamiento-de-datos' },
];
