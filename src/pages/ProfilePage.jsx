import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    authService.me()
      .then(res => setProfile(res.data))
      .catch(() => setError('Erro ao carregar perfil.'))
      .finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white/20 text-xs tracking-widest uppercase animate-pulse">Carregando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400 text-sm">{error}</p>
        <Link to="/" className="text-xs tracking-widest uppercase text-[#C8F135]">Voltar</Link>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3">VHX Store</p>
          <h1 style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-6xl tracking-widest text-white">
            Meu Perfil
          </h1>
        </div>

        {/* Avatar + nome */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-sm bg-[#111] border border-white/10 flex items-center justify-center flex-shrink-0">
            <span style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-3xl text-[#C8F135]">
              {profile?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-3xl tracking-widest text-white">
              {profile?.name}
            </p>
            <p className="text-white/40 text-sm mt-1">{profile?.email}</p>
            {profile?.role === 'admin' && (
              <span className="inline-block mt-2 bg-[#C8F135] text-black text-[10px] font-bold tracking-widest uppercase px-2 py-1">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Informações */}
        <div className="bg-[#111] rounded-sm p-6 mb-6">
          <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-xl tracking-widest text-white mb-6">
            Informações da Conta
          </p>
          <div className="space-y-4">
            {[
              ['Nome',          profile?.name],
              ['E-mail',        profile?.email],
              ['Tipo de conta', profile?.role === 'admin' ? 'Administrador' : 'Cliente'],
              ['Membro desde',  profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })
                : '—'
              ],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                <span className="text-xs tracking-widest uppercase text-white/30">{label}</span>
                <span className="text-sm text-white/70">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link
            to="/produtos"
            className="bg-[#111] rounded-sm p-5 hover:bg-[#1a1a1a] transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#C8F135] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <p className="text-xs tracking-widest uppercase text-white/50 group-hover:text-white transition-colors">
              Ver coleção
            </p>
          </Link>

          <Link to="/pedidos" className="bg-[#111] rounded-sm p-5 hover:bg-[#1a1a1a] transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#C8F135] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <p className="text-xs tracking-widest uppercase text-white/50 group-hover:text-white transition-colors">Meus pedidos</p>
            </Link>
        </div>

        {/* Admin - só aparece para admins */}
        {profile?.role === 'admin' && (
          <Link
            to="/admin"
            className="block bg-[#C8F135]/10 border border-[#C8F135]/30 rounded-sm p-5 hover:bg-[#C8F135]/20 transition-colors mb-6"
          >
            <p className="text-xs tracking-widest uppercase text-[#C8F135] mb-1">Acesso restrito</p>
            <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-xl tracking-widest text-white">
              Painel Admin →
            </p>
          </Link>
        )}

        {/* Sair */}
        <button
          onClick={handleLogout}
          className="w-full border border-white/10 text-white/40 text-xs tracking-widest uppercase py-4 hover:border-red-500/50 hover:text-red-400 transition-all duration-200"
        >
          Sair da conta
        </button>

      </div>
    </div>
  )
}