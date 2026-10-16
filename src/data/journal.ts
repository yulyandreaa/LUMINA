import diarioTalla from '../assets/photos/diario-talla.jpg';
import diarioColor from '../assets/photos/diario-color.jpg';
import diarioCuidado from '../assets/photos/diario-cuidado.jpg';
import patillaDetalle from '../assets/photos/patilla-detalle.jpg';
import examenConsultorio from '../assets/photos/examen-consultorio.jpg';

/*
 * Diario LUMINA (blog).
 * ⚠️ Fechas, autoría y la historia de marca son FICTICIAS (textos de ejemplo).
 * Los datos de cuidado, protección UV, acetato y frecuencia del examen resumen fuentes públicas,
 * citadas al final de cada artículo. No reemplazan la consulta con un profesional.
 */

export type JournalCategory = 'Guías' | 'Cuidado visual' | 'Diseño';

export interface ArticleSection {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
}

export interface Article {
  slug: string;
  category: JournalCategory;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  date: string; // ISO, ficticia
  readMinutes: number;
  body: ArticleSection[];
  cta?: { label: string; to: string };
  sources?: { label: string; url: string }[];
  /** Texto de marca inventado (no se basa en fuentes). */
  fictional?: boolean;
}

export const journalCategories: JournalCategory[] = ['Guías', 'Cuidado visual', 'Diseño'];

export const articles: Article[] = [
  {
    slug: 'como-elegir-la-talla-de-tu-montura',
    category: 'Guías',
    title: 'Cómo elegir la talla de tu montura',
    excerpt: 'Ancho de lente, puente y patilla: lo que significan los tres números grabados en tus gafas.',
    image: diarioTalla,
    imageAlt: 'Montura LUMINA vista de cerca, con la patilla abierta',
    date: '2026-09-02',
    readMinutes: 4,
    body: [
      {
        paragraphs: [
          'Pocas cosas cambian tanto la experiencia de llevar gafas como la talla. Una montura demasiado ancha se resbala y deja tus ojos cerca del centro de la cara; una demasiado estrecha aprieta en las sienes y deja marcas. La buena noticia: tus gafas actuales ya tienen la respuesta.',
        ],
      },
      {
        heading: 'Los tres números',
        paragraphs: [
          'En la cara interior de la patilla casi siempre hay tres cifras en milímetros, por ejemplo 49 □ 21 145.',
        ],
        list: [
          'Ancho de lente (49): el ancho de una sola lente. Es el número que define la talla; suele ir de 40 a 62 mm.',
          'Puente (21): la distancia entre las dos lentes, donde la montura se apoya en la nariz; suele ir de 14 a 24 mm.',
          'Patilla (145): el largo de la varilla hasta la punta que va detrás de la oreja; suele ir de 120 a 150 mm.',
        ],
      },
      {
        heading: 'Compara antes de elegir',
        paragraphs: [
          'Si unas gafas te quedan bien, busca modelos con un ancho de lente parecido: una diferencia de 1 o 2 mm casi no se nota. Fíjate también en que tus ojos queden centrados en cada lente y en que el frente no sobresalga de tu rostro.',
          'Si es tu primera montura, empieza por una talla media y pruébatela frente al espejo con calma.',
        ],
      },
    ],
    cta: { label: 'Ver la guía completa de talla y ajuste', to: '/talla-y-ajuste' },
    sources: [
      { label: 'All About Vision – Medidas de la montura', url: 'https://www.allaboutvision.com/en-gb/eyeglasses/faq/numbers-on-frames-meaning/' },
      { label: 'MOSCOT – Size Guide', url: 'https://moscot.com/blogs/moscot-moments/the-moscot-size-guide' },
    ],
  },
  {
    slug: 'el-color-como-forma-de-mirar',
    category: 'Diseño',
    title: 'El color como forma de mirar',
    excerpt: 'Por qué el borgoña se convirtió en nuestro color firma, y cómo elegir el tono que va contigo.',
    image: diarioColor,
    imageAlt: 'Monturas LUMINA en tonos borgoña y rosa sobre fondo cálido',
    date: '2026-08-18',
    readMinutes: 3,
    fictional: true,
    body: [
      {
        paragraphs: [
          'Cuando empezamos a dibujar LUMINA teníamos una idea clara: unas gafas no son un accesorio que se esconde, son lo primero que alguien ve de ti. Por eso el color nunca fue un detalle al final del proceso, sino el punto de partida.',
        ],
      },
      {
        heading: 'Por qué borgoña',
        paragraphs: [
          'El borgoña está entre el rojo y el vino: tiene la energía de uno y la calma del otro. Sobre la piel ilumina sin gritar y, a diferencia del negro, deja ver la profundidad del acetato cuando le da la luz. Se volvió nuestro color firma casi sin proponérnoslo: fue el tono al que siempre volvíamos.',
        ],
      },
      {
        heading: 'Cómo elegir tu tono',
        list: [
          'Si buscas algo que combine con todo, el negro y el carey son apuestas seguras.',
          'Si quieres que la montura sea protagonista, prueba el borgoña o el rosa empolvado.',
          'Si prefieres que pase casi desapercibida, el cristal deja ver tu rostro tal cual.',
        ],
      },
      {
        paragraphs: ['Al final, la mejor regla es la más sencilla: elige el color con el que te reconoces al mirarte al espejo.'],
      },
    ],
    cta: { label: 'Ver monturas en borgoña', to: '/monturas?color=borgona' },
  },
  {
    slug: 'cuidar-tus-gafas-paso-a-paso',
    category: 'Cuidado visual',
    title: 'Cuidar tus gafas, paso a paso',
    excerpt: 'Limpieza, estuche y pequeños gestos que alargan la vida de tus lentes y de tu montura.',
    image: diarioCuidado,
    imageAlt: 'Gafas LUMINA junto a su estuche y paño de limpieza',
    date: '2026-07-29',
    readMinutes: 4,
    body: [
      {
        paragraphs: [
          'La mayoría de los rayones no vienen de una caída, sino de limpiar mal las lentes día tras día. Con una rutina de un minuto tus gafas se mantienen como nuevas mucho más tiempo.',
        ],
      },
      {
        heading: 'La rutina de limpieza',
        list: [
          'Enjuaga primero con agua tibia, nunca caliente: el polvo y la arena son los que rayan.',
          'Si hace falta, usa un limpiador de lentes sin alcohol o muy poco jabón suave, y frota con los dedos.',
          'Enjuaga de nuevo y sacude el exceso de agua.',
          'Seca con un paño de microfibra limpio, con movimientos suaves.',
        ],
      },
      {
        heading: 'Lo que es mejor evitar',
        list: [
          'Papel higiénico, servilletas o toallas de papel: tienen fibras que pueden rayar.',
          'La camiseta o el borde de la ropa: arrastran polvo.',
          'Limpiavidrios y productos de la casa: pueden dañar los recubrimientos de las lentes.',
        ],
      },
      {
        heading: 'Montura y estuche',
        paragraphs: [
          'Limpia también las plaquetas y las bisagras, donde se acumula grasa. Cuando no las uses, guárdalas en su estuche y nunca las dejes boca abajo sobre las lentes ni en el tablero del carro al sol.',
        ],
      },
    ],
    cta: { label: 'Ver la guía de cuidado', to: '/cuidado' },
    sources: [
      { label: 'Which? – Cómo limpiar tus gafas', url: 'https://www.which.co.uk/reviews/opticians-stores/article/how-to-safely-clean-your-glasses-and-sunglasses-abjZD1m7RGXn' },
      { label: 'NBC Select – Consejos de un óptico y un optómetra', url: 'https://www.nbcnews.com/select/shopping/how-to-clean-your-glasses-rcna345754' },
    ],
  },
  {
    slug: 'gafas-de-sol-que-significa-uv400',
    category: 'Cuidado visual',
    title: 'Gafas de sol: qué significa UV400',
    excerpt: 'Oscuro no siempre es protegido. Lo que debes buscar en la etiqueta antes de elegir tus gafas de sol.',
    image: '/banners/gafas-de-sol.jpg',
    imageAlt: 'Gafas de sol negras LUMINA sobre una piedra, con un pueblo colonial al fondo',
    date: '2026-07-10',
    readMinutes: 3,
    body: [
      {
        paragraphs: [
          'Unas lentes muy oscuras no garantizan protección. Lo que cuida tus ojos de la radiación ultravioleta es el filtro de la lente, no su color.',
        ],
      },
      {
        heading: 'UV400, en una frase',
        paragraphs: [
          'Una lente UV400 bloquea la luz hasta 400 nanómetros de longitud de onda, es decir, los rayos UVA y UVB. La Academia Americana de Oftalmología recomienda elegir gafas de sol que bloqueen entre el 99 y el 100 % de esa radiación.',
        ],
      },
      {
        heading: 'Polarizado no es lo mismo',
        paragraphs: [
          'Las lentes polarizadas reducen los reflejos del agua, el asfalto o la nieve, y hacen la visión más cómoda. Pero polarizado no significa protección UV: son dos cosas distintas y conviene revisar ambas en la etiqueta.',
        ],
      },
      {
        heading: 'También en días nublados',
        paragraphs: [
          'Los rayos UV atraviesan las nubes. En una ciudad de altura como Bogotá, usar gafas de sol también en días grises es un buen hábito.',
        ],
      },
    ],
    cta: { label: 'Ver gafas de sol', to: '/gafas-de-sol' },
    sources: [
      { label: 'All About Vision – Protección UV en gafas de sol', url: 'https://www.allaboutvision.com/eyewear/sunglasses/lenses/best-uv-protection' },
      { label: 'Corewell Health – UV400 y la AAO', url: 'https://healthbeat.corewellhealth.org/?p=93494' },
    ],
  },
  {
    slug: 'acetato-del-bloque-a-tu-rostro',
    category: 'Diseño',
    title: 'Acetato: del bloque a tu rostro',
    excerpt: 'Qué es el acetato, por qué se pule a mano y cómo se forman esos tonos con profundidad.',
    image: patillaDetalle,
    imageAlt: 'Detalle de la patilla de acetato de una montura LUMINA',
    date: '2026-06-21',
    readMinutes: 4,
    body: [
      {
        paragraphs: [
          'Si alguna vez te has preguntado por qué una montura de acetato parece tener luz por dentro, la respuesta está en cómo se fabrica.',
        ],
      },
      {
        heading: 'Un material de origen vegetal',
        paragraphs: [
          'El acetato de celulosa es un material hecho a partir de celulosa, que se obtiene de la pulpa de algodón o de madera. Es ligero, resistente y admite colores muy ricos.',
        ],
      },
      {
        heading: 'Del bloque a la montura',
        list: [
          'Los colores se forman uniendo láminas o fragmentos de acetato en un bloque, que luego se corta en placas.',
          'De cada placa se recorta la silueta del frente y de las patillas, a máquina o a mano.',
          'Las piezas se pulen por etapas: primero en tambores con virutas de madera y después a mano, hasta lograr el brillo final.',
        ],
      },
      {
        heading: 'Por qué importa el pulido',
        paragraphs: [
          'El pulido a mano respeta las aristas y los biseles del diseño, y es lo que da ese acabado profundo que cambia con la luz. Por eso decimos que cada montura tiene su propio carácter.',
        ],
      },
    ],
    cta: { label: 'Descubre AURA', to: '/producto/aura' },
    sources: [
      { label: 'Warby Parker – Cómo se hacen sus gafas', url: 'https://www.warbyparker.com/how-our-glasses-are-made' },
      { label: 'Ceft & Co. – Pulido a mano', url: 'https://www.ceftandcompany.com/selima-optique-x-ceft-and-company-collab-limited-edition-sunglasses-frame/' },
    ],
  },
  {
    slug: 'cada-cuanto-hacerte-un-examen-visual',
    category: 'Cuidado visual',
    title: '¿Cada cuánto hacerte un examen visual?',
    excerpt: 'Aunque veas bien, tus ojos cambian con los años. Una guía general para no dejarlo pasar.',
    image: examenConsultorio,
    imageAlt: 'Consultorio de examen visual en una tienda LUMINA',
    date: '2026-06-03',
    readMinutes: 3,
    body: [
      {
        paragraphs: [
          'Muchas personas solo van al optómetra cuando ya notan que ven borroso. Pero la vista cambia poco a poco, y un examen a tiempo ayuda a detectar esos cambios antes de que te molesten.',
        ],
      },
      {
        heading: 'Una guía general',
        list: [
          'Adultos sin síntomas ni factores de riesgo: más o menos cada uno o dos años.',
          'Desde los 60 o 65 años: una vez al año.',
          'Con diabetes, presión alta, antecedentes familiares de enfermedades de los ojos o alguna condición visual: con la frecuencia que indique tu profesional de la salud visual.',
        ],
      },
      {
        heading: 'Señales para no esperar',
        list: [
          'Ves borroso de lejos o de cerca.',
          'Te duele la cabeza o sientes cansancio visual al final del día.',
          'Entrecierras los ojos para leer o ver la pantalla.',
        ],
      },
      {
        paragraphs: ['Esta es una guía general: tu optómetra es quien te dirá cada cuánto volver según tu caso.'],
      },
    ],
    cta: { label: 'Agenda tu examen visual', to: '/examen-visual' },
    sources: [
      { label: 'Cleveland Clinic – Cada cuánto un examen visual', url: 'https://health.clevelandclinic.org/how-often-should-you-get-an-eye-exam' },
      { label: 'AARP – Razones para visitar al especialista', url: 'https://www.aarp.org/health/conditions-treatments/reasons-to-visit-eye-doctor/' },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function formatArticleDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}
