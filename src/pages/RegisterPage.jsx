import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { useTranslation } from 'react-i18next'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const { t } = useTranslation()

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError(t('checkout.error_address'))
      return
    }
    if (form.password.length < 6) {
      setError(t('auth.error_password'))
      return
    }
    if (form.password !== form.confirm) {
      setError(t('auth.password_mismatch'))
      return
    }
    try {
      setLoading(true)
      const res = await authService.register({
        name:     form.name,
        email:    form.email,
        password: form.password,
      })
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || t('auth.error_register'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="block text-center mb-12">
          <span style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-3xl tracking-widest text-white">
            <span className="text-[#C8F135]">&lt;</span>VHX<span className="text-[#C8F135]">&gt;</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-[#111] rounded-sm p-8">
          <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-3xl tracking-widest text-white mb-2">
            {t('auth.register_title')}
          </p>
          <p className="text-white/30 text-sm mb-8">
            {t('auth.register_sub')}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-wider px-4 py-3 rounded-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
                {t('auth.name')}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t('auth.your_name')}
                className="w-full bg-[#1a1a1a] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('auth.your_email')}
                className="w-full bg-[#1a1a1a] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={t('auth.password_placeholder')}
                className="w-full bg-[#1a1a1a] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">
                {t('auth.confirm_password')}
              </label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder={t('auth.confirm_password_placeholder')}
                className="w-full bg-[#1a1a1a] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? t('auth.registering') : t('auth.register_btn')}
            </button>
          </form>
        </div>

        {/* Link login */}
        <p className="text-center text-white/30 text-sm mt-6">
          {t('auth.has_account')}{' '}
          <Link to="/login" className="text-[#C8F135] hover:opacity-70 transition-opacity">
            {t('auth.sign_in')}
          </Link>
        </p>

      </div>
    </div>
  )
}