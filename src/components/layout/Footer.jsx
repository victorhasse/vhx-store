import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/logo-transparente.png'
import LanguageToggle from '../ui/LanguageToggle'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-brand-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Logo e descrição — centralizado no mobile */}
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0 md:hidden">
          <img src={logo} alt="VHX Store" className="h-20 w-auto mb-3" />
          <p className="text-brand-muted text-sm leading-relaxed text-center">
            {t('footer.tagline_1')}<br />{t('footer.tagline_2')}
          </p>
        </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-8">
        {/* Logo — só aparece no desktop */}
        <div className="hidden md:flex flex-col items-start">
          <img src={logo} alt="VHX Store" className="h-20 w-auto mb-3" />
          <p className="text-brand-muted text-sm leading-relaxed">
            {t('footer.tagline_1')}<br />{t('footer.tagline_2')}
          </p>
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase text-brand-muted mb-4">{t('footer.store')}</p>
        <ul className="space-y-2">
          {[t('nav.collection'), t('nav.clothes'), t('nav.accessories')].map(item => (
            <li key={item}>
              <Link to="/produtos" className="text-sm text-brand-muted hover:text-brand-white transition-colors">{item}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase text-brand-muted mb-4">{t('footer.account')}</p>
        <ul className="space-y-2">
          {[
            [t('nav.login'),    '/login'   ],
            [t('nav.register'), '/cadastro'],
            [t('cart.title'),   '/carrinho'],
          ].map(([label, to]) => (
            <li key={to}>
              <Link to={to} className="text-sm text-brand-muted hover:text-brand-white transition-colors">{label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase text-brand-muted mb-4">{t('footer.social')}</p>
        <ul className="space-y-2">
          {[
            ['Instagram', '#'],
            ['TikTok',    '#'],
            ['GitHub',    'https://github.com/victorhasse'],
          ].map(([label, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-muted hover:text-brand-white transition-colors">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>

      {/* Rodapé inferior */}
      <div className="border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center md:flex-row md:justify-between gap-3">
          <p className="text-xs text-brand-muted tracking-wider text-center md:text-left">
            © {new Date().getFullYear()} &lt;VHX&gt; Store. {t('footer.rights')}
          </p>

          {/* Language toggle discreto */}
          <LanguageToggle />
          <p className="text-xs text-brand-muted tracking-wider text-center md:text-right">
            {t('footer.developed')}{' '}
            <a
              href="https://github.com/victorhasse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C8F135] hover:opacity-70 transition-opacity"
            >
              Victor Hasse
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}