import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../types/product';
import { getProductsByCategory } from '../data/products';
import { CatalogView } from '../components/catalog/CatalogView';
import { TrustBar } from '../components/catalog/TrustBar';
import { Eyebrow } from '../components/ui/Eyebrow';
import { usePageTitle } from '../hooks/usePageTitle';
import styles from './CollectionPage.module.css';

/* Listado por categoría (/monturas, /gafas-de-sol), como /collections/eyeglasses de la referencia. */
/*
 * banner y about.image: fotos IA en public/banners/ (fuera de src/assets, como las de producto).
 * about: bloque "Sobre la colección" antes del footer, como en la referencia.
 */
interface CollectionCopy {
  title: string;
  text: string;
  banner: string;
  about: { image: string; paragraphs: ReactNode[] };
}

const copy: Record<Category, CollectionCopy> = {
  monturas: {
    title: 'Monturas',
    text: 'Acetatos y metales pensados para acompañarte cada día. Elige forma, talla y color.',
    banner: '/banners/monturas.jpg',
    about: {
      image: '/banners/monturas-coleccion.jpg',
      paragraphs: [
        'En LUMINA creemos que unas monturas no solo completan tu look: lo cuentan. Por eso cada modelo nace de una idea sencilla — que te acompañe todo el día y que se sienta tuyo desde el primer momento.',
        'Hay siluetas redondas, cuadradas, cat-eye y geométricas, en colores que van del borgoña al cristal. Elige la forma que mejor va con tu rostro y la talla que te queda cómoda.',
        <>
          ¿Aún no sabes tu fórmula? Agenda tu <Link to="/examen-visual">examen visual</Link> en
          cualquiera de nuestras <Link to="/tiendas">tiendas</Link>.
        </>,
      ],
    },
  },
  'gafas-de-sol': {
    title: 'Gafas de sol',
    text: 'Para los días de luz: siluetas con carácter y lentes que cuidan tu mirada.',
    banner: '/banners/gafas-de-sol.jpg',
    about: {
      image: '/banners/gafas-de-sol-coleccion.jpg',
      paragraphs: [
        'Las gafas de sol LUMINA están pensadas para los días largos de luz: siluetas con carácter, acetatos de color profundo y detalles dorados que se notan sin gritar.',
        'Desde formas clásicas hasta modelos más atrevidos, cada par busca el equilibrio entre estilo y comodidad para que lo uses todos los días, no solo en vacaciones.',
        <>
          ¿Buscas algo para el día a día? Mira también nuestras <Link to="/monturas">monturas</Link>.
        </>,
      ],
    },
  },
};

export function CollectionPage({ category }: { category: Category }) {
  const { title, text, banner, about } = copy[category];
  usePageTitle(title);

  return (
    <>
      {/* Banner a todo el ancho, como el de /collections/eyeglasses en la referencia. */}
      <header className={styles.hero}>
        <img className={styles.heroImage} src={banner} alt="" />
        <div className={styles.heroContent}>
          <Eyebrow className={styles.eyebrow}>Catálogo</Eyebrow>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.text}>{text}</p>
        </div>
      </header>
      <nav aria-label="Migas de pan" className={`container ${styles.breadcrumb}`}>
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{title}</span>
      </nav>
      {/* key: al cambiar de categoría se reinicia el estado interno (p. ej. el panel de filtros). */}
      <CatalogView key={category} products={getProductsByCategory(category)} defaultSort="destacados" />
      <section className={styles.about} aria-labelledby="about-title">
        <div className={styles.aboutMedia}>
          <img src={about.image} alt="" loading="lazy" />
        </div>
        <div className={styles.aboutContent}>
          <h2 id="about-title" className={styles.aboutTitle}>
            Sobre la colección
          </h2>
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
      <TrustBar />
    </>
  );
}
