import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
      <p className="font-display text-[120px] leading-none tracking-widest text-brand-border">404</p>
      <p className="text-brand-muted text-sm tracking-widest uppercase">{t('common.not_found')}</p>
      <Link to="/" className="btn-ghost mt-2">{t('common.back_store')}</Link>
    </div>
  )
}