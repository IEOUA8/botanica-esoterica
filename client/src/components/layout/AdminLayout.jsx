import { LogOut, Package, ShoppingBag, Sparkles, Tags } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearToken } from '../../utils/auth'

const links = [
  ['Dashboard', '/admin', Sparkles],
  ['Productos', '/admin/productos', Package],
  ['Categorías', '/admin/categorias', Tags],
  ['Pedidos', '/admin/pedidos', ShoppingBag],
]

export default function AdminLayout() {
  const navigate = useNavigate()

  function logout() {
    clearToken()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-ritual text-deep">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-gold/20 bg-deep p-5 text-white lg:block">
        <h1 className="font-display text-3xl font-bold">Botánica Admin</h1>
        <nav className="mt-8 grid gap-2">
          {links.map(([label, to, Icon]) => (
            <NavLink key={to} end={to === '/admin'} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-3 font-semibold ${isActive ? 'bg-gold text-deep' : 'text-ritual hover:bg-white/10'}`}>
              <Icon size={19} /> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-md px-3 py-3 font-semibold text-ritual hover:bg-white/10">
          <LogOut size={19} /> Cerrar sesión
        </button>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-gold/20 bg-warm/95 px-4 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl font-bold text-forest">Admin</span>
            <button onClick={logout} className="rounded-md p-2 text-terracotta"><LogOut /></button>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto">
            {links.map(([label, to]) => <NavLink key={to} end={to === '/admin'} className="rounded-md bg-ritual px-3 py-2 text-sm font-semibold" to={to}>{label}</NavLink>)}
          </nav>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
