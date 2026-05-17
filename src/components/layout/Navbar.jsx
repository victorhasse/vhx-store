import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { totalItems } = useCart()
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-brand-black border-b border-brand-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="font-display text-2xl tracking-widest text-brand-white">
          <span className="text-brand-lime">&lt;</span>VHX<span className="text-brand-lime">&gt;</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {[
            { to: '/produtos',              label: 'Coleção' },
            { to: '/produtos?cat=roupas',   label: 'Roupas' },
            { to: '/produtos?cat=acessorios', label: 'Acessórios' },
          ].map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `text-xs tracking-widest uppercase transition-colors duration-150 ${
                    isActive ? 'text-brand-lime' : 'text-brand-muted hover:text-brand-white'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/perfil"
                className="text-xs tracking-widest uppercase text-brand-muted hover:text-brand-white transition-colors"
              >
                Perfil
              </Link>
              <button
                onClick={logout}
                className="text-xs tracking-widest uppercase text-brand-muted hover:text-brand-white transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-xs tracking-widest uppercase text-brand-muted hover:text-brand-white transition-colors">
              Entrar
            </Link>
          )}

          <Link to="/carrinho" className="relative text-brand-muted hover:text-brand-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-lime text-brand-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}