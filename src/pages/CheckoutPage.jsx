import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { paymentService } from '../services/paymentService'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const CARD_STYLE = {
  style: {
    base: {
      color: 'rgba(240,237,232,0.8)',
      fontFamily: '"DM Sans", sans-serif',
      fontSize:   '14px',
      '::placeholder': { color: 'rgba(240,237,232,0.2)' },
    },
    invalid: { color: '#ff4444' },
  },
}

function CheckoutForm({ items, totalPrice, address, setAddress, addressError, setAddressError }) {
  const stripe     = useStripe()
  const elements   = useElements()
  const navigate   = useNavigate()
  const { clearCart } = useCart()

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function handleAddressChange(e) {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setAddressError('')
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    if (!address.street || !address.number || !address.city || !address.state || !address.zipcode) {
      setAddressError('Preencha todos os campos obrigatórios.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Cria o PaymentIntent no backend
      const intentRes = await paymentService.createIntent({ items, address })
      const { clientSecret, orderId } = intentRes.data

      // 2. Confirma o pagamento no Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      )

      if (stripeError) {
        setError(stripeError.message)
        setLoading(false)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. Confirma o pedido no backend
        await paymentService.confirm({ orderId })
        clearCart()
        navigate(`/pedido/${orderId}`)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao processar pagamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Endereço */}
      <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-2xl tracking-widest text-white mb-4">
        Endereço de entrega
      </p>

      {addressError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-wider px-4 py-3 rounded-sm">
          {addressError}
        </div>
      )}

      <div>
        <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">CEP *</label>
        <input
          name="zipcode" value={address.zipcode} onChange={handleAddressChange}
          placeholder="00000-000"
          maxLength={9}
          onInput={e => {
            e.target.value = e.target.value
              .replace(/\D/g, '')
              .replace(/(\d{5})(\d)/, '$1-$2')
              .slice(0, 9)
          }}
          className="w-full md:w-48 bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">Rua *</label>
          <input
            name="street" value={address.street} onChange={handleAddressChange}
            placeholder="Nome da rua"
            maxLength={80}
            className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
          />
        </div>
        <div>
          <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">Número *</label>
          <input
          name="number" value={address.number} onChange={handleAddressChange}
          placeholder="123"
          maxLength={6}
          onInput={e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6) }}
          className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">Complemento</label>
        <input
          name="complement" value={address.complement} onChange={handleAddressChange}
          placeholder="Apto, bloco..."
          maxLength={40}
          className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
        />
      </div>
      <div>
        <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">Bairro</label>
        <input
          name="neighborhood" value={address.neighborhood} onChange={handleAddressChange}
          placeholder="Bairro"
          maxLength={50}
          className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
        />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">Cidade *</label>
        <input
          name="city" value={address.city} onChange={handleAddressChange}
          placeholder="Sua cidade"
          maxLength={50}
          onInput={e => { e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '') }}
          className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
        />
      </div>
      <div>
        <label className="block text-[11px] tracking-widest uppercase text-white/30 mb-2">Estado *</label>
        <input
          name="state" value={address.state} onChange={handleAddressChange}
          placeholder="SC"
          maxLength={2}
          onInput={e => { e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2) }}
          className="w-full bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
        />
      </div>
    </div>

      {/* Pagamento */}
      <div className="pt-4">
        <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-2xl tracking-widest text-white mb-4">
          Pagamento
        </p>

        <div className="bg-[#111] border border-white/10 px-4 py-4 focus-within:border-[#C8F135] transition-colors">
          <CardElement options={CARD_STYLE} />
        </div>

        <p className="text-[10px] tracking-widest uppercase text-white/20 mt-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Pagamento seguro via Stripe — modo teste
        </p>

        <div className="mt-3 bg-[#C8F135]/5 border border-[#C8F135]/20 px-4 py-3 rounded-sm">
          <p className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-1">Cartão de teste</p>
          <p className="text-xs text-white/40 font-mono">4242 4242 4242 4242</p>
          <p className="text-xs text-white/30">Validade: qualquer data futura — CVC: qualquer 3 dígitos</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-wider px-4 py-3 rounded-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase py-4 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 mt-2"
      >
        {loading ? 'Processando pagamento...' : `Pagar R$ ${totalPrice.toFixed(2).replace('.', ',')}`}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart()
  const { isAuthenticated }   = useAuth()

  const [address, setAddress]           = useState({
    street: '', number: '', complement: '',
    neighborhood: '', city: '', state: '', zipcode: '',
  })
  const [addressError, setAddressError] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-4xl tracking-widest text-white/10">
          Faça login para continuar
        </p>
        <Link to="/login" className="bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase px-8 py-4">
          Entrar
        </Link>
      </div>
    )
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

        <div className="mb-12">
          <p className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3">VHX Store</p>
          <h1 style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-6xl tracking-widest text-white">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                items={items}
                totalPrice={totalPrice}
                address={address}
                setAddress={setAddress}
                addressError={addressError}
                setAddressError={setAddressError}
              />
            </Elements>
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
                <p className="text-[10px] tracking-widest uppercase text-white/20 mt-2">Frete grátis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}