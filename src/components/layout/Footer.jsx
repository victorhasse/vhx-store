import { Link } from 'react-router-dom'
import logo from '../../assets/logo-transparente.png'

export default function Footer() {
  return (
    <footer className="border-t border-brand-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-2xl tracking-widest text-brand-white mb-3">
            <img src={logo} alt="VHX Store" className="h-20 w-auto" />
          </p>
          <p className="text-brand-muted text-sm leading-relaxed">
            Streetwear sem compromisso.<br />Cada peça é uma declaração.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-widest uppercase text-brand-muted mb-4">Loja</p>
          <ul className="space-y-2">
            {['Coleção', 'Roupas', 'Acessórios'].map(item => (
              <li key={item}>
                <Link to="/produtos" className="text-sm text-brand-muted hover:text-brand-white transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-widest uppercase text-brand-muted mb-4">Conta</p>
          <ul className="space-y-2">
            {[['Entrar', '/login'], ['Cadastrar', '/cadastro'], ['Carrinho', '/carrinho']].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-sm text-brand-muted hover:text-brand-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-widest uppercase text-brand-muted mb-4">Redes</p>
          <ul className="space-y-2">
            {['Instagram', 'TikTok', 'GitHub'].map(item => (
              <li key={item}>
                <span className="text-sm text-brand-muted cursor-pointer hover:text-brand-white transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-brand-muted tracking-wider">© {new Date().getFullYear()} &lt;VHX&gt; Store.</p>
          <p className="text-xs text-brand-muted tracking-wider">Feito com React + Node.js</p>
        </div>
      </div>
    </footer>
  )
}