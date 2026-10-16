import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { ColorTabs } from '../components/home/ColorTabs';
import { ProductRail } from '../components/home/ProductRail';
import { FeaturedProduct } from '../components/home/FeaturedProduct';
import { PromoGrid } from '../components/home/PromoGrid';
import { Marquee } from '../components/home/Marquee';
import { StoryQuote } from '../components/home/StoryQuote';
import { VideoFeature } from '../components/home/VideoFeature';
import { Journal } from '../components/home/Journal';
import { VisitUs } from '../components/home/VisitUs';
import { Newsletter } from '../components/home/Newsletter';
import { getProductBySlug, getProductsByCategory, products } from '../data/products';
import {
  colorTabs,
  featuredSlides,
  featuredStory,
  heroSlides,
  journalPosts,
  promoTiles,
  visitImage,
} from '../data/home';
import historiaMirarMundo from '../assets/photos/historia-mirar-mundo.jpg';

/*
 * Inicio: las 11 secciones de la referencia, en el mismo orden.
 * Esta página solo COMPONE secciones; cada una vive en components/home/.
 */
export function HomePage() {
  const featured = getProductBySlug('aura')!;

  return (
    <>
      <HeroSlideshow slides={heroSlides} />
      <ColorTabs title="Color con carácter" tabs={colorTabs} products={products} />
      <FeaturedProduct
        product={featured}
        story={featuredStory}
        slides={featuredSlides}
      />
      <Marquee items={['Ver más allá', 'Diseñado para ti', 'Una nueva forma de mirar']} />
      <PromoGrid tiles={promoTiles} />
      <StoryQuote
        image={historiaMirarMundo}
        alt="Mano sosteniendo unas gafas LUMINA borgoña frente a las montañas; a través de los lentes el paisaje se ve nítido"
        quote="Cuando eliges unas LUMINA no eliges solo unas gafas: eliges cómo quieres mirar el mundo, y cómo quieres que el mundo te mire."
        author="Equipo LUMINA"
      />
      <ProductRail
        eyebrow="Gafas de sol"
        title="Para los días de luz"
        products={getProductsByCategory('gafas-de-sol')}
        viewAll={{ label: 'Ver todas las gafas de sol', to: '/gafas-de-sol' }}
      />
      <VideoFeature
        src="/media/lumina-mirar-480.mp4"
        poster="/media/lumina-mirar-poster.jpg"
        title="Más visión para tu mundo."
      />
      <Journal posts={journalPosts} />
      <VisitUs image={visitImage} />
      <Newsletter />
    </>
  );
}
