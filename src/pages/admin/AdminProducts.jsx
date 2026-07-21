import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService'
import { useTranslation } from 'react-i18next'

export default function AdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    productService.getAll()
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id, name) {
    if (!confirm(`Remover "${name}"?`)) return
    setDeleting(id)
    try {
      await productService.delete(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Erro ao remover produto.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link to="/admin" className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3 block hover:opacity-70">
              {t('admin.back_admin')}
            </Link>
            <h1 style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-6xl tracking-widest text-white">
              {t('admin.products')}
            </h1>
          </div>
          <Link
            to="/admin/produtos/novo"
            className="bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase px-6 py-3 hover:opacity-90 transition-opacity"
          >
            {t('admin.new_product')}
          </Link>
        </div>

        {loading ? (
          <p className="text-white/20 text-xs tracking-widest uppercase animate-pulse">{t('common.loading')}</p>
        ) : (
          <div className="space-y-2">
            {products.map(product => (
              <div key={product.id} className="bg-[#111] rounded-sm flex items-center gap-4 p-4">

                {/* Imagem */}
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">{product.name}</p>
                  <p className="text-[10px] tracking-widest uppercase text-white/30 mt-0.5">{product.category}</p>
                </div>

                {/* Preço */}
                <div className="hidden md:block text-right">
                  <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-xl tracking-wider text-[#C8F135]">
                    R$ {Number(product.price).toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-[10px] text-white/30">{t('product.stock')}: {product.stock}</p>
                </div>

                {/* Badge */}
                <div className="hidden md:block w-16 text-center">
                  {product.badge ? (
                    <span className="bg-[#C8F135] text-black text-[10px] font-bold tracking-widest uppercase px-2 py-1">
                      {product.badge}
                    </span>
                  ) : (
                    <span className="text-white/20 text-[10px]">—</span>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/admin/produtos/${product.id}/opcoes`)}
                    className="text-[10px] tracking-widest uppercase border border-white/10 text-white/40 px-3 py-2 hover:border-[#C8F135] hover:text-[#C8F135] transition-all"
                  >
                    {t('admin.options')}
                  </button>
                  <button
                    onClick={() => navigate(`/admin/produtos/${product.id}/editar`)}
                    className="text-[10px] tracking-widest uppercase border border-white/10 text-white/40 px-3 py-2 hover:border-[#C8F135] hover:text-[#C8F135] transition-all"
                  >
                    {t('admin.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deleting === product.id}
                    className="text-[10px] tracking-widest uppercase border border-white/10 text-white/40 px-3 py-2 hover:border-red-500/50 hover:text-red-400 transition-all disabled:opacity-50"
                  >
                    {deleting === product.id ? '...' : t('admin.remove')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}