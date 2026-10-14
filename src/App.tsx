import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { SearchPage } from './pages/SearchPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { InfoPage } from './pages/InfoPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { StoresPage } from './pages/StoresPage';
import { infoPages } from './data/pages';

/*
 * Mapa de rutas. Todas comparten <Layout /> (anuncios, cabecera, footer, cesta, cookies).
 * Checkout y resultado se cargan bajo demanda (lazy): su código (validación con zod, etc.)
 * solo se descarga cuando alguien va a pagar, así el inicio carga más rápido.
 */
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderResultPage = lazy(() => import('./pages/OrderResultPage').then((m) => ({ default: m.OrderResultPage })));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="monturas" element={<CollectionPage category="monturas" />} />
        <Route path="gafas-de-sol" element={<CollectionPage category="gafas-de-sol" />} />
        <Route path="buscar" element={<SearchPage />} />
        <Route path="producto/:slug" element={<ProductPage />} />
        <Route path="cesta" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pedido/resultado" element={<OrderResultPage />} />

        {infoPages.map((page) => (
          <Route key={page.slug} path={page.slug} element={<InfoPage page={page} />} />
        ))}

        {/* Fuera de la v1: se explican en vez de mostrar un 404. */}
        <Route path="cuenta" element={<PlaceholderPage title="Cuentas de cliente: próximamente" />} />
        <Route path="tiendas" element={<StoresPage />} />
        <Route path="accesorios" element={<PlaceholderPage title="Accesorios: próximamente" />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
