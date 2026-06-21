import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import { LoadingState } from './components/ui/AsyncState'

const Home = lazy(() => import('./pages/public/Home'))
const Catalog = lazy(() => import('./pages/public/Catalog'))
const ProductDetail = lazy(() => import('./pages/public/ProductDetail'))
const Cart = lazy(() => import('./pages/public/Cart'))
const Checkout = lazy(() => import('./pages/public/Checkout'))
const Confirmation = lazy(() => import('./pages/public/Confirmation'))
const StaticPage = lazy(() => import('./pages/public/StaticPage'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'))
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'))

function StaticRoute() {
  const location = useLocation()
  return <StaticPage path={location.pathname} />
}

export default function App() {
  return (
    <Suspense fallback={<main className="section-shell py-16"><LoadingState /></main>}>
      <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="tienda" element={<Catalog />} />
        <Route path="producto/:slug" element={<ProductDetail />} />
        <Route path="carrito" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="confirmacion" element={<Confirmation />} />
        <Route path="sobre-nosotros" element={<StaticRoute />} />
        <Route path="guia-espiritual" element={<StaticRoute />} />
        <Route path="contacto" element={<StaticRoute />} />
        <Route path="politicas-envio" element={<StaticRoute />} />
        <Route path="privacidad" element={<StaticRoute />} />
        <Route path="terminos" element={<StaticRoute />} />
      </Route>

      <Route path="admin/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="categorias" element={<AdminCategories />} />
          <Route path="inventario" element={<AdminInventory />} />
          <Route path="pedidos" element={<AdminOrders />} />
          <Route path="pedidos/:id" element={<AdminOrderDetail />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
