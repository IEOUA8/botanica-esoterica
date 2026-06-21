import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import Home from './pages/public/Home'
import Catalog from './pages/public/Catalog'
import ProductDetail from './pages/public/ProductDetail'
import Cart from './pages/public/Cart'
import Checkout from './pages/public/Checkout'
import Confirmation from './pages/public/Confirmation'
import StaticPage from './pages/public/StaticPage'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'

function StaticRoute() {
  const location = useLocation()
  return <StaticPage path={location.pathname} />
}

export default function App() {
  return (
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
          <Route path="pedidos" element={<AdminOrders />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
