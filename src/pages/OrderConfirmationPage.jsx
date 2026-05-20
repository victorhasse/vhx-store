import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { orderService } from '../services/orderService'
import { useTranslation } from 'react-i18next'

export default function OrderConfirmPage() {
  const { id } = useParams()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  const STATUS_MAP = {
    pending:   { label: t('orders.pending'),   color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    confirmed: { label: t('orders.confirmed'), color: 'text-[#C8F135]',  bg: 'bg-[#C8F135]/10' },
    shipped:   { label: t('orders.shipped'),   color: 'text-blue-400',   bg: 'bg-blue-400/10'  },
    delivered: { label: t('orders.delivered'), color: 'text-green-400',  bg: 'bg-green-400/10' },
    cancelled: { label: t('orders.cancelled'), color: 'text-red-400',    bg: 'bg-red-400/10'   },
  }

  useEffect(() => {
    orderService.getById(id)
      .then(res => setOrder(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white/20 text-xs tracking-widest uppercase animate-pulse">{t('common.loading')}</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-white/30 text-sm">{t('orders.not_found')}</p>
        <Link to="/" className="text-xs tracking-widest uppercase text-[#C8F135]">{t('order_confirmation.back')}</Link>
      </div>
    )
  }

  const address = order.address ? JSON.parse(order.address) : null
  const status  = STATUS_MAP[order.status] || STATUS_MAP.pending

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Confirmação */}
        <div className="text-center mb-16">
          <p className="text-5xl mb-6">🎉</p>
          <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-5xl tracking-widest text-white mb-3">
            {t('order_confirmation.title')}
          </p>
          <p className="text-white/40 text-sm">
            {t('order_confirmation.order')} <span className="text-white/70">#{String(order.id).padStart(5, '0')}</span> {t('order_confirmation.success')}
          </p>
        </div>

        {/* Status */}
        <div className="bg-[#111] rounded-sm p-6 mb-4">
          <div className="flex justify-between items-center">
            <p className="text-xs tracking-widest uppercase text-white/30">{t('order_confirmation.status')}</p>
            <p className={`text-sm font-medium tracking-wider ${status.color}`}>
              {status.label}
            </p>
          </div>
        </div>

        {/* Itens */}
        <div className="bg-[#111] rounded-sm p-6 mb-4">
          <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-xl tracking-widest text-white mb-4">
            {t('order_confirmation.items')}
          </p>
          <div className="space-y-4">
            {order.items?.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-sm flex-shrink-0 overflow-hidden">
                  {item.product?.image_url ? (
                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 text-xs">VHX</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/80">{item.product?.name}</p>
                  <p className="text-[10px] text-white/30 tracking-wider">
                    {item.size && `Tam. ${item.size} · `}Qtd. {item.quantity}
                  </p>
                </div>
                <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-lg text-[#C8F135]">
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 mt-6 pt-4 flex justify-between">
            <span className="text-sm text-white/40">Total</span>
            <span style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-2xl text-[#C8F135]">
              R$ {Number(order.total).toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Endereço */}
        {address && (
          <div className="bg-[#111] rounded-sm p-6 mb-8">
            <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-xl tracking-widest text-white mb-4">
              {t('order_confirmation.delivery')}
            </p>
            <p className="text-sm text-white/50 leading-relaxed">
              {address.street}, {address.number}
              {address.complement && ` — ${address.complement}`}<br />
              {address.city}{address.state && ` — ${address.state}`}<br />
              {t('checkout.zipcode')}: {address.zip}
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-3">
          <Link
            to="/pedidos"
            className="flex-1 text-center border border-white/10 text-white/40 text-xs tracking-widest uppercase py-4 hover:border-[#C8F135] hover:text-[#C8F135] transition-all"
          >
            {t('order_confirmation.see_orders')}
          </Link>
          <Link
            to="/produtos"
            className="flex-1 text-center bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase py-4 hover:opacity-90 transition-opacity"
          >
            {t('order_confirmation.keep_shopping')}
          </Link>
        </div>

      </div>
    </div>
  )
}