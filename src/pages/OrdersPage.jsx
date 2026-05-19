import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'
import { OrderCardSkeleton } from '../components/ui/Skeleton'

const STATUS_MAP = {
  pending:   { label: 'Aguardando', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  confirmed: { label: 'Confirmado', color: 'text-[#C8F135]',  bg: 'bg-[#C8F135]/10' },
  shipped:   { label: 'Enviado',    color: 'text-blue-400',   bg: 'bg-blue-400/10'  },
  delivered: { label: 'Entregue',   color: 'text-green-400',  bg: 'bg-green-400/10' },
  cancelled: { label: 'Cancelado',  color: 'text-red-400',    bg: 'bg-red-400/10'   },
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    orderService.getAll()
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <div className="mb-12">
          <Link to="/perfil" className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3 block hover:opacity-70">
            ← Meu perfil
          </Link>
          <h1 style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-6xl tracking-widest text-white">
            Meus Pedidos
          </h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-4xl tracking-widest text-white/10">
              Nenhum pedido ainda
            </p>
            <Link to="/produtos" className="text-xs tracking-widest uppercase text-[#C8F135] hover:opacity-70">
              Explorar coleção →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = STATUS_MAP[order.status] || STATUS_MAP.pending
              return (
                <Link
                  key={order.id}
                  to={`/pedido/${order.id}`}
                  className="block bg-[#111] rounded-sm p-6 hover:bg-[#1a1a1a] transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs tracking-widest uppercase text-white/30 mb-1">
                        Pedido #{String(order.id).padStart(6, '0')}
                      </p>
                      <p className="text-xs text-white/30">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs tracking-widest uppercase px-2 py-1 rounded-sm ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {order.items?.slice(0, 4).map(item => (
                      <div key={item.id} className="w-10 h-10 bg-[#1a1a1a] rounded-sm overflow-hidden flex-shrink-0">
                        {item.product?.image_url ? (
                          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <span className="text-xs text-white/30">+{order.items.length - 4}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-white/30">
                      {order.items?.length} {order.items?.length === 1 ? 'item' : 'itens'}
                    </p>
                    <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-xl tracking-wider text-[#C8F135]">
                      R$ {Number(order.total).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}