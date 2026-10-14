import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { FrameSize } from '../types/product';
import { getProductBySlug, products } from '../data/products';
import { sizeGuide } from '../data/sizes';
import { shapeLabels } from '../lib/catalog';
import { formatPrice } from '../lib/format';
import { FrameIllustration } from '../components/product/FrameIllustration';
import { Gallery, type GallerySlide } from '../components/product/Gallery';
import { Swatches } from '../components/product/Swatches';
import { SizeSelector } from '../components/product/SizeSelector';
import { SizeGuide } from '../components/product/SizeGuide';
import { ProductRail } from '../components/home/ProductRail';
import { Accordion } from '../components/ui/Accordion';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { PlaceholderPage } from './PlaceholderPage';
import { useCart } from '../cart/CartContext';
import heroRetrato from '../assets/photos/hero-retrato.jpg';
import patilla from '../assets/photos/patilla-detalle.jpg';
import { usePageTitle } from '../hooks/usePageTitle';
import styles from './ProductPage.module.css';

/*
 * Ficha de producto (estructura de /products/lemtosh en la referencia).
 * Color y talla viven en la URL (?color=borgona&talla=media) para poder compartir la variante exacta.
 */
export function ProductPage() {
  const { slug = '' } = useParams();
  // key: al pasar de un producto a otro (p. ej. desde "recomendados") se reinicia todo el estado.
  return <ProductView key={slug} slug={slug} />;
}

function ProductView({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  const [params, setParams] = useSearchParams();
  const [guideOpen, setGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState('');
  const buyRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const cart = useCart();

  // Barra de compra fija: aparece cuando el botón principal sale de la pantalla.
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [product]);

  usePageTitle(product?.name ?? 'Producto no encontrado');

  if (!product) return <PlaceholderPage title="No encontramos este producto" />;

  const color = product.colors.find((c) => c.id === params.get('color')) ?? product.colors[0];
  const sizeParam = params.get('talla') as FrameSize | null;
  const size = sizeParam && product.sizes.includes(sizeParam) ? sizeParam : null;
  const sun = product.category === 'gafas-de-sol';
  const categoryLabel = sun ? 'Gafas de sol' : 'Monturas';

  // replace: true → cambiar de variante no llena el historial del navegador.
  const setParam = (key: 'color' | 'talla', value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(key, value);
        return next;
      },
      { replace: true },
    );

  const onAdd = () => {
    if (!size) {
      setSizeError('Elige una talla para continuar.');
      return;
    }
    cart.add({ productId: product.id, colorId: color.id, size });
    cart.open();
  };

  const slides: GallerySlide[] = [
    {
      key: 'frente',
      caption: `${color.name} · Frente`,
      content: <FrameIllustration shape={product.shape} color={color.hex} sun={sun} />,
    },
    {
      key: 'angulo',
      caption: `${color.name} · Tres cuartos`,
      content: <FrameIllustration shape={product.shape} color={color.hex} sun={sun} angled />,
    },
    { key: 'detalle', caption: 'Imagen de ambiente', content: <img src={patilla} alt="" /> },
    { key: 'retrato', caption: 'Imagen de ambiente', content: <img src={heroRetrato} alt="" /> },
  ];

  const measures = size ? sizeGuide[size] : sizeGuide[product.sizes[0]];
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <>
      <div className={`container ${styles.layout}`}>
        <nav aria-label="Migas de pan" className={styles.breadcrumb}>
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/${product.category}`}>{categoryLabel}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <Gallery slides={slides} label={`Galería de imágenes de ${product.name}`} />

        <div className={styles.info}>
          <div className={styles.head}>
            {product.fictional && <span className={styles.fictional}>Producto ficticio</span>}
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.price}>{formatPrice(product.price)}</p>
            <p className={styles.tax}>Precio de ejemplo · Impuestos pendientes de definir</p>
          </div>

          <div className={styles.field}>
            <p className={styles.label}>
              Color: <strong>{color.name}</strong>
              <span className={styles.muted}> · {product.colors.length} colores</span>
            </p>
            <Swatches
              colors={product.colors}
              selected={color.id}
              onSelect={(id) => setParam('color', id)}
              label="Color"
              size="md"
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <p className={styles.label}>
                Talla{size && <>: <strong>{sizeGuide[size].label}</strong></>}
              </p>
              <button className={styles.guideLink} onClick={() => setGuideOpen(true)}>
                Guía de tallas
              </button>
            </div>
            <SizeSelector
              sizes={product.sizes}
              selected={size}
              error={sizeError}
              onSelect={(s) => {
                setSizeError('');
                setParam('talla', s);
              }}
            />
          </div>

          <div ref={buyRef} className={styles.buy}>
            <Button onClick={onAdd} withArrow className={styles.buyButton}>
              Añadir a la cesta · Solo montura
            </Button>
            <p className={styles.note}>LUMINA v1 vende monturas sin graduación.</p>
          </div>

          <Accordion
            group="pdp"
            defaultOpen="detalles"
            items={[
              {
                id: 'detalles',
                title: 'Detalles',
                content: (
                  <>
                    <p>{product.description}</p>
                    <ul>
                      <li>Forma: {shapeLabels[product.shape]}</li>
                      <li>Uso: {product.audience === 'unisex' ? 'Unisex' : product.audience === 'mujer' ? 'Mujer' : 'Hombre'}</li>
                      <li>Materiales y acabados: pendientes de confirmar</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 'medidas',
                title: 'Medidas',
                content: (
                  <ul>
                    <li>Ancho de lente: {measures.lensWidth} mm</li>
                    <li>Ancho de montura: {measures.frameWidth} mm</li>
                    <li>Puente: {measures.bridge} mm</li>
                    <li>Largo de patilla: {measures.temple} mm</li>
                    <li>Talla: {measures.label} (medidas de ejemplo)</li>
                  </ul>
                ),
              },
              {
                id: 'ajuste',
                title: 'Estilo y ajuste',
                content: <p>{sizeGuide[size ?? product.sizes[0]].advice}</p>,
              },
              {
                id: 'envios',
                title: 'Envíos y devoluciones',
                content: <p>[Pendiente: política de envíos, plazos y devoluciones de LUMINA para Colombia.]</p>,
              },
            ]}
          />
        </div>
      </div>

      {related.length > 0 && (
        <ProductRail
          eyebrow="También te puede gustar"
          title="Completa tu mirada"
          products={related}
          viewAll={{ label: `Ver ${categoryLabel.toLowerCase()}`, to: `/${product.category}` }}
        />
      )}

      <div className={styles.sticky} data-visible={showSticky} aria-hidden={!showSticky} inert={!showSticky}>
        <div className={`container ${styles.stickyInner}`}>
          <div className={styles.stickyInfo}>
            <span className={styles.stickyThumb}>
              <FrameIllustration shape={product.shape} color={color.hex} sun={sun} />
            </span>
            <span>
              <strong>{product.name}</strong> · {color.name}
              <span className={styles.muted}> · {formatPrice(product.price)}</span>
            </span>
          </div>
          <Button
            onClick={() => (size ? onAdd() : buyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))}
          >
            {size ? 'Añadir a la cesta' : 'Elegir talla'}
          </Button>
        </div>
      </div>

      <Dialog open={guideOpen} onClose={() => setGuideOpen(false)} title="Guía de tallas LUMINA">
        <SizeGuide category={product.category} />
      </Dialog>
    </>
  );
}
