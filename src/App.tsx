import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { SearchPage } from './pages/SearchPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { InfoPage } from './pages/InfoPage';
import { AboutPage } from './pages/AboutPage';
import { EyeExamPage } from './pages/EyeExamPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { StoresPage } from './pages/StoresPage';
import { JournalPage } from './pages/JournalPage';
import { ArticlePage } from './pages/ArticlePage';
import { infoPages } from './data/pages';
import { AccountLayout } from './pages/account/AccountLayout';
import { OrdersPage } from './pages/account/OrdersPage';
import { AppointmentsPage } from './pages/account/AppointmentsPage';
import { ProfilePage } from './pages/account/ProfilePage';
import { FavoritesPage } from './pages/account/FavoritesPage';
import { LoginPage } from './pages/account/LoginPage';
import { RegisterPage } from './pages/account/RegisterPage';
import { RecoverPage } from './pages/account/RecoverPage';

/*
 * Mapa de rutas. Todas comparten <Layout /> (anuncios, cabecera, footer, cesta, cookies), también el panel /admin.
 * Checkout y resultado se cargan bajo demanda (lazy): su código (validación con zod, etc.)
 * solo se descarga cuando alguien va a pagar, así el inicio carga más rápido.
 */
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderResultPage = lazy(() => import('./pages/OrderResultPage').then((m) => ({ default: m.OrderResultPage })));
/* Panel de administración: diferido (solo lo descarga el equipo). */
const AdminRoot = lazy(() => import('./admin/AdminSession').then((m) => ({ default: m.AdminRoot })));
const AdminNewProductPage = lazy(() =>
  import('./pages/admin/AdminNewProductPage').then((m) => ({ default: m.AdminNewProductPage })),
);
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminAppointmentsPage = lazy(() =>
  import('./pages/admin/AdminAppointmentsPage').then((m) => ({ default: m.AdminAppointmentsPage })),
);
const AdminProductsPage = lazy(() =>
  import('./pages/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })),
);
const AdminCustomersPage = lazy(() =>
  import('./pages/admin/AdminCustomersPage').then((m) => ({ default: m.AdminCustomersPage })),
);
const AdminOrdersPage = lazy(() =>
  import('./pages/admin/AdminOrdersPage').then((m) => ({ default: m.AdminOrdersPage })),
);

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

        <Route path="nosotros" element={<AboutPage />} />
        {infoPages.map((page) => (
          <Route key={page.slug} path={page.slug} element={<InfoPage page={page} />} />
        ))}

        {/* Cuentas de cliente (demostración: aún sin servicio de cuentas real) */}
        <Route path="cuenta" element={<AccountLayout />}>
          <Route index element={<Navigate to="pedidos" replace />} />
          <Route path="pedidos" element={<OrdersPage />} />
          <Route path="citas" element={<AppointmentsPage />} />
          <Route path="datos" element={<ProfilePage />} />
          <Route path="favoritos" element={<FavoritesPage />} />
        </Route>
        <Route path="cuenta/ingresar" element={<LoginPage />} />
        <Route path="cuenta/registro" element={<RegisterPage />} />
        <Route path="cuenta/recuperar" element={<RecoverPage />} />

        {/* Panel de administración: misma diagramación que Mi cuenta, con sesión propia */}
        <Route path="admin" element={<AdminRoot />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="pedidos" replace />} />
            <Route path="pedidos" element={<AdminOrdersPage />} />
            <Route path="citas" element={<AdminAppointmentsPage />} />
            <Route path="productos" element={<AdminProductsPage />} />
            <Route path="productos/nuevo" element={<AdminNewProductPage />} />
            <Route path="clientes" element={<AdminCustomersPage />} />
          </Route>
        </Route>

        {/* Fuera de la v1: se explican en vez de mostrar un 404. */}
        <Route path="tiendas" element={<StoresPage />} />
        <Route path="diario" element={<JournalPage />} />
        <Route path="diario/:slug" element={<ArticlePage />} />
        <Route path="examen-visual" element={<EyeExamPage />} />
        <Route path="accesorios" element={<PlaceholderPage title="Accesorios: próximamente" />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
