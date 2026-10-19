import collageRostro from '../assets/photos/nosotros/rostro.jpg';
import collageTienda from '../assets/photos/nosotros/tienda.jpg';
import collageMontura from '../assets/photos/nosotros/montura.jpg';
import collageForoptero from '../assets/photos/nosotros/foroptero.jpg';
import collageAjuste from '../assets/photos/nosotros/ajuste.jpg';
import collageLuz from '../assets/photos/nosotros/luz.jpg';
import collageRepisa from '../assets/photos/nosotros/repisa.jpg';
import collageEstuche from '../assets/photos/nosotros/estuche.jpg';
import nosotrosInspiracion from '../assets/photos/nosotros-inspiracion.jpg';
import tiendaFachada from '../assets/photos/tienda-fachada.jpg';
import examenConsultorio from '../assets/photos/examen-consultorio.jpg';
import heroGafasPiedra from '../assets/photos/hero-gafas-piedra.jpg';
import type { IconName } from '../components/ui/Icon';

/*
 * Página "Nuestra historia" (/nosotros).
 * ⚠️ Textos de visión de marca, sin datos inventados (fundadores, fechas, cifras).
 * La historia real y el equipo los debe aportar LUMINA.
 */
export const about = {
  hero: {
    eyebrow: 'Nuestra historia',
    title: 'Una nueva perspectiva.',
    intro: 'LUMINA es una óptica contemporánea: diseño editorial, cercanía y cuidado por cómo ves el mundo.',
    /*
     * Collage de portada (aportado por LUMINA), en dos filas como el original.
     * `w` = ancho relativo de cada foto dentro de su fila (en px del collage original).
     */
    collage: [
      [
        { src: collageRostro, alt: 'Retrato de perfil con montura borgoña a la luz del sol', w: 421 },
        { src: collageTienda, alt: 'Interior de una tienda LUMINA con arcos, mostrador de piedra y sillones borgoña', w: 524 },
        { src: collageMontura, alt: 'Detalle de una montura de acetato borgoña con remaches dorados', w: 341 },
        { src: collageForoptero, alt: 'Foróptero del consultorio de examen visual', w: 370 },
      ],
      [
        { src: collageAjuste, alt: 'Manos ajustando una montura borgoña con un destornillador de precisión', w: 421 },
        { src: collageLuz, alt: 'Sombras de hojas de olivo sobre una pared marfil', w: 458 },
        { src: collageRepisa, alt: 'Repisas de piedra con monturas en exhibición', w: 308 },
        { src: collageEstuche, alt: 'Estuche borgoña abierto con una montura dentro', w: 469 },
      ],
    ],
  },
  origin: {
    image: nosotrosInspiracion,
    alt: 'Mesa de diseño con el boceto de una montura, telas borgoña, fotos de la tienda y unas gafas carey vino',
    eyebrow: 'Por qué existimos',
    title: 'Ver bien también es sentir bien',
    paragraphs: [
      'Creemos que unas gafas son mucho más que un accesorio: son la forma en la que miras y te miran. Por eso las elegimos como se elige una prenda que te acompaña todos los días.',
      'LUMINA nace para unir dos mundos que pocas veces van juntos: el cuidado de una óptica y la mirada de una marca de diseño. Monturas con carácter, una asesoría sin afán y un examen visual hecho con calma.',
      'Queremos que salgas de nuestras tiendas viendo mejor y sintiéndote tú.',
    ],
  },
  manifesto: {
    eyebrow: 'Nuestro manifiesto',
    lines: [
      { text: 'Ver bien.', note: 'Un examen visual hecho con calma, en cualquiera de nuestras tres tiendas.' },
      { text: 'Sentirte tú.', note: 'Monturas con carácter que eliges como una prenda que te acompaña todos los días.' },
      { text: 'Sin afán.', note: 'Una asesoría que se toma el tiempo de escucharte.' },
    ],
  },
  values: [
    {
      icon: 'spark',
      title: 'Diseño con carácter',
      text: 'Monturas pensadas como piezas editoriales: siluetas atemporales y colores que se notan sin gritar.',
    },
    {
      icon: 'eye',
      title: 'Cuidado visual',
      text: 'Tu salud visual va primero. Por eso el examen visual es gratis con la compra de tu montura.',
    },
    {
      icon: 'heart',
      title: 'Cercanía',
      text: 'Te asesoramos sin afán, mirando tu rostro, tu estilo y tu forma de vivir.',
    },
    {
      icon: 'shield',
      title: 'Respaldo',
      text: 'Cada montura tiene garantía legal y te acompañamos también después de tu compra.',
    },
  ] satisfies { icon: IconName; title: string; text: string }[],
  paths: [
    {
      image: tiendaFachada,
      alt: 'Fachada de una tienda LUMINA',
      title: 'Nuestras tiendas',
      text: 'Tres sedes en Bogotá para probarte las monturas en persona.',
      href: '/tiendas',
      cta: 'Ver tiendas',
    },
    {
      image: examenConsultorio,
      alt: 'Consultorio de examen visual LUMINA',
      title: 'Examen visual',
      text: 'Agenda tu cita en línea y elige la tienda y la hora.',
      href: '/examen-visual',
      cta: 'Agendar examen',
    },
    {
      image: heroGafasPiedra,
      alt: 'Montura borgoña sobre una piedra a pleno sol',
      title: 'La colección',
      text: 'Monturas y gafas de sol diseñadas para acompañarte todos los días.',
      href: '/monturas',
      cta: 'Ver monturas',
    },
  ],
};
