import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState({
    street: '', number: '', complement: '', city: '', state: '', zip: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function handleChange(e) {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    if (!address.street || !address.city || !address.zip) {
      setError('Preencha os campos obrigatórios.')
      return
    }
    setLoading(true)
    try {
      const res = await orderService.create({ items, address })
      clearCart()
      navigate(`/pedido/${res.data.id}`)
    } catch {
      setError('Erro ao finalizar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-5xl tracking-widest text-white/10">
          Carrinho vazio
        </p>
        <Link to="/produtos" className="text-xs tracking-widest uppercase text-[#C8F135] hover:opacity-70">
          Explorar coleção
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3">VHX Store</p>
          <h1 style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-6xl tracking-widest text-white">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Formulário */}
          <div className="lg:col-span-2">
            <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-2xl tracking-widest text-white mb-6">
              Endereço de entrega
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-wider px-4 py-3 rounded-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">Rua *</label>
                  <input
                    name="street" value={address.street} onChange={handleChange}
                    placeholder="Nome da rua"
                    className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">Número *</label>
                  <input
                    name="number" value={address.number} onChange={handleChange}
                    placeholder="123"
                    className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">Complemento</label>
                <input
                  name="complement" value={address.complement} onChange={handleChange}
                  placeholder="Apto, bloco, etc. (opcional)"
                  className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">Cidade *</label>
                  <input
                    name="city" value={address.city} onChange={handleChange}
                    placeholder="Sua cidade"
                    className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">Estado</label>
                  <input
                    name="state" value={address.state} onChange={handleChange}
                    placeholder="MG"
                    className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">CEP *</label>
                <input
                  name="zip" value={address.zip} onChange={handleChange}
                  placeholder="00000-000"
                  className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 mt-4"
              >
                {loading ? 'Finalizando...' : 'Confirmar pedido'}
              </button>
            </form>
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] rounded-sm p-6 sticky top-24">
              <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-2xl tracking-widest text-white mb-6">
                Resumo
              </p>

              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between text-sm">
                    <span className="text-white/50 truncate mr-2">
                      {item.name} {item.selectedSize && `(${item.selectedSize})`} ×{item.quantity}
                    </span>
                    <span className="text-white/70 flex-shrink-0">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-white/40 tracking-wider">Total</span>
                  <span style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-3xl tracking-wider text-[#C8F135]">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-[10px] tracking-widest uppercase text-white/20 mt-2">
                  Frete grátis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}