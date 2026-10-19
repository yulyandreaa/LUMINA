/*
 * Estructura de navegación. Replica la de la referencia
 * (Categoría · Color · Forma · Talla en el megamenú) con el catálogo de LUMINA v1:
 * solo monturas y gafas de sol, sin lentes graduadas.
 * Fotos del megamenú: generadas con IA (Magnific), una pareja distinta por categoría.
 */
import menuMonturasTodo from '../assets/photos/menu-monturas-todo.jpg';
import menuMonturasVendidos from '../assets/photos/menu-monturas-vendidos.jpg';
import menuSolTodo from '../assets/photos/menu-sol-todo.jpg';
import menuSolVendidos from '../assets/photos/menu-sol-vendidos.jpg';
import { products } from './products';
import type { Product } from '../types/product';

/**
 * ¿Hay algún producto visible de esa categoría ("/monturas" → monturas) que cumpla la condición?
 * El megamenú solo ofrece opciones con productos: nunca un filtro que da cero resultados.
 */
const offered = (base: string, has: (p: Product) => boolean) =>
  products.some((p) => `/${p.category}` === base && has(p));

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
  /** Fotos de las 2 tarjetas del megamenú ("Ver todo" y "Más vendidos"). */
  cardImages?: { all: string; bestSellers: string };
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
  ]
    .filter(([, id]) => offered(base, (p) => p.colors.some((c) => c.id === id)))
    .map(([label, id]) => ({ label, href: `${base}?color=${id}` })),
});

const byShape = (base: string): NavColumn => ({
  title: 'Por forma',
  links: [
    ['Redonda', 'redonda'],
    ['Cuadrada', 'cuadrada'],
    ['Aviador', 'aviador'],
    ['Cat-eye', 'cat-eye'],
    ['Geométrica', 'geometrica'],
  ]
    .filter(([, id]) => offered(base, (p) => p.shape === id))
    .map(([label, id]) => ({ label, href: `${base}?forma=${id}` })),
});

const bySize = (base: string): NavColumn => ({
  title: 'Por talla',
  links: [
    ['Estrecha', 'estrecha'],
    ['Media', 'media'],
    ['Ancha', 'ancha'],
    ['Extra ancha', 'extra-ancha'],
  ]
    .filter(([, id]) => offered(base, (p) => p.sizes.some((s) => s === id)))
    .map(([label, id]) => ({ label, href: `${base}?talla=${id}` })),
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
    cardImages: { all: menuMonturasTodo, bestSellers: menuMonturasVendidos },
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
    cardImages: { all: menuSolTodo, bestSellers: menuSolVendidos },
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
