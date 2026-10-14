import type { HeroSlide } from '../components/home/HeroSlideshow';
import type { ColorTab } from '../components/home/ColorTabs';
import type { PromoTile } from '../components/home/PromoGrid';
import type { JournalPost } from '../components/home/Journal';
import type { Annotation } from '../components/home/FeaturedProduct';
import heroEditorial from '../assets/photos/hero-editorial.jpg';
import heroArcos from '../assets/photos/hero-arcos.jpg';
import heroGafasPiedra from '../assets/photos/hero-gafas-piedra.jpg';
import promoMonturas from '../assets/photos/promo-monturas.jpg';
import promoSol from '../assets/photos/promo-sol.jpg';
import diarioTalla from '../assets/photos/diario-talla.jpg';
import diarioColor from '../assets/photos/diario-color.jpg';
import diarioCuidado from '../assets/photos/diario-cuidado.jpg';
import tiendaFachada from '../assets/photos/tienda-fachada.jpg';

/*
 * Contenido editorial del inicio. Separado de los componentes para poder
 * cambiar textos e imágenes sin tocar el diseño (y, más adelante, traerlo de un CMS).
 * Fotos: PROVISIONALES, recortadas del tablero de identidad.
 */

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: 'Nueva colección',
    title: 'Una nueva perspectiva.',
    cta: { label: 'Compra las novedades', to: '/monturas?orden=novedades' },
    image: heroEditorial,
    alt: 'Mujer con gafas de acetato borgoña bajo luz dorada',
    focus: '60% 30%',
  },
  {
    eyebrow: 'Gafas de sol',
    title: 'Ver bien también es sentir bien.',
    cta: { label: 'Ver gafas de sol', to: '/gafas-de-sol' },
    image: heroArcos,
    alt: 'Mujer con gafas borgoña sentada entre arcos y sombras de hojas',
    focus: '68% 30%',
  },
  {
    eyebrow: 'Detalle LUMINA',
    title: 'Hechas para durar contigo.',
    cta: { label: 'Ver monturas', to: '/monturas' },
    image: heroGafasPiedra,
    alt: 'Gafas de acetato borgoña sobre un bloque de piedra bajo luz cálida',
    focus: '55% 45%',
  },
];

/* Pestañas de "Color con carácter": cada una muestra productos disponibles en ese color. */
export const colorTabs: ColorTab[] = [
  { label: 'Monturas y gafas de sol borgoña', colorId: 'borgona' },
  { label: 'Monturas y gafas de sol rosa', colorId: 'rosa' },
  { label: 'Monturas y gafas de sol carey', colorId: 'carey' },
  { label: 'Monturas y gafas de sol negras', colorId: 'negro' },
];

/* Producto protagonista. ⚠️ Texto y detalles FICTICIOS, pendientes de LUMINA. */
export const featuredStory =
  'LUMINA es una óptica contemporánea que entiende las gafas como una forma de mirar y de ser mirada. AURA es nuestra montura redonda esencial: acetato pulido, remaches con el destello de la marca y un puente pensado para todos los rostros. Una pieza para todos los días que nunca pasa de moda.';

export const featuredAnnotations: Annotation[] = [
  { text: 'Remaches destello', top: '20%', left: '22%' },
  { text: 'Acetato pulido a mano', top: '22%', left: '80%' },
  { text: 'Puente cerradura', top: '80%', left: '50%' },
];

export const promoTiles: PromoTile[] = [
  // Fotos generadas con IA (Magnific) con modelos que llevan AURA carey e IRIS SOL borgoña.
  { title: 'Monturas', cta: 'Ver colección', to: '/monturas', image: promoMonturas, focus: '50% 30%' },
  { title: 'Gafas de sol', cta: 'Ver colección', to: '/gafas-de-sol', image: promoSol, focus: '50% 30%' },
];

export const journalPosts: JournalPost[] = [
  {
    title: 'Cómo elegir la talla de tu montura',
    excerpt: 'Ancho de lente, puente y patilla: lo que significan los números.',
    image: diarioTalla,
    to: '/talla-y-ajuste',
  },
  {
    title: 'El color como forma de mirar',
    excerpt: 'Por qué el borgoña se convirtió en nuestro color firma.',
    image: diarioColor,
    to: '/diario',
  },
  {
    title: 'Cuidar tus gafas, paso a paso',
    excerpt: 'Limpieza, estuche y pequeños gestos que alargan su vida.',
    image: diarioCuidado,
    to: '/cuidado',
  },
];

// Fachada en Bogotá generada con IA (Magnific) + logo real montado en edición; no es una tienda real todavía.
export const visitImage = tiendaFachada;
