import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo-transparente.png'

export default function Navbar() {
  const { totalItems } = useCart()
  const { isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 bg-brand-black border-b border-brand-border transition-all duration-300 ${scrolled ? 'shadow-lg shadow-black/40' : ''}`}>
      <nav className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}">

        {/* Logo */}
        <Link to="/" className="z-10 group .flex-shrink-0">
          <div className="relative">
            <img
              src={logo}
              alt="VHX Store"
              className={`w-auto transition-all duration-300 ${scrolled ? 'h-16' : 'h-30'}`}
            />
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="glitch-img-1 absolute inset-0 h-30 w-auto opacity-0"
              style={{
                height: scrolled ? '64px' : '120px',
                filter: 'hue-rotate(90deg) saturate(3)'}}
            />
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="glitch-img-2 absolute inset-0 h-30 w-auto opacity-0"
              style={{
                height: scrolled ? '64px' : '120px',
                filter: 'hue-rotate(200deg) saturate(3)'}}
            />
          </div>
        </Link>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {[
            { to: '/produtos',               label: 'Coleção'     },
            { to: '/produtos?cat=roupas',    label: 'Roupas'      },
            { to: '/produtos?cat=acessorios', label: 'Acessórios' },
          ].map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `text-xs tracking-widest uppercase transition-all duration-300 ${
                    scrolled ? 'text-[11px]' : 'text-xs'
                  } ${isActive ? 'text-brand-lime' : 'text-brand-muted hover:text-brand-white'}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Ícones direita */}
        <div className="flex items-center gap-4">
          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/perfil" className={`tracking-widest uppercase text-brand-muted hover:text-brand-white transition-all duration-300 ${
                  scrolled ? 'text-[10px]' : 'text-xs'}`}>
                  Perfil
                </Link>
                <button onClick={logout} className={`tracking-widest uppercase text-brand-muted hover:text-brand-white transition-all duration-300 ${
                  scrolled ? 'text-[10px]' : 'text-xs'}`}>
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className={`tracking-widest uppercase text-brand-muted hover:text-brand-white transition-all duration-300 ${
                  scrolled ? 'text-[10px]' : 'text-xs'}`}>
                Entrar
              </Link>
            )}
          </div>

          {/* Carrinho */}
          <Link to="/carrinho" className="relative text-brand-muted hover:text-brand-white transition-colors">
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-all duration-300 ${scrolled ? 'w-4 h-4' : 'w-5 h-5'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-lime text-brand-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburguer mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-brand-muted hover:text-brand-white transition-colors"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div 
        className={`md:hidden bg-brand-black border-t border-brand-border overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 flex flex-col gap-5">
          {[
            { to: '/produtos',                label: 'Coleção'     },
            { to: '/produtos?cat=roupas',     label: 'Roupas'      },
            { to: '/produtos?cat=acessorios', label: 'Acessórios'  },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-widest uppercase text-brand-muted hover:text-brand-white transition-colors"
            >
              {label}
            </Link>
          ))}

          <div className="border-t border-brand-border pt-4 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/perfil" onClick={() => setMenuOpen(false)} className="text-sm tracking-widest uppercase text-brand-muted hover:text-brand-white transition-colors">
                  Perfil
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false) }}
                  className="text-left text-sm tracking-widest uppercase text-brand-muted hover:text-brand-white transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm tracking-widest uppercase text-brand-muted hover:text-brand-white transition-colors">
                  Entrar
                </Link>
                <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="text-sm tracking-widest uppercase text-brand-muted hover:text-brand-white transition-colors">
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}