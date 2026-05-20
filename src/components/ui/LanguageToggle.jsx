import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const isEN = i18n.language?.startsWith('en')

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => i18n.changeLanguage('pt')}
        className={`text-[11px] tracking-wider transition-all duration-200 flex items-center gap-1 ${
          !isEN ? 'text-brand-white' : 'text-brand-muted hover:text-brand-white'
        }`}
      >
        🇧🇷 <span>PT</span>
      </button>
      <span className="text-brand-border text-[10px]">|</span>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`text-[11px] tracking-wider transition-all duration-200 flex items-center gap-1 ${
          isEN ? 'text-brand-white' : 'text-brand-muted hover:text-brand-white'
        }`}
      >
        🇺🇸 <span>EN</span>
      </button>
    </div>
  )
}