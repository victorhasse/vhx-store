import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
      <p className="font-display text-[120px] leading-none tracking-widest text-brand-border">404</p>
      <p className="text-brand-muted text-sm tracking-widest uppercase">Página não encontrada</p>
      <Link to="/" className="btn-ghost mt-2">Voltar à loja</Link>
    </div>
  )
}