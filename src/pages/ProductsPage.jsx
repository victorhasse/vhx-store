import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { productService } from '../services/productService'
import { ProductCardSkeleton } from '../components/ui/Skeleton'
import { useScrollFadeIn } from '../hooks/useFadeIn'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'

const CATEGORY_LABELS = {
  camisetas:  t('products.shirts'),
  calcas:     t('products.pants'),
  moletons:   t('products.hoodies'),
  acessorios: t('products.accessories'),
  tenis:      t('products.sneakers'),
}

function ProductCard({ product, index }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const { ref, visible } = useScrollFadeIn()
  const { t } = useTranslation()

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      ref={ref}
      className={`fade-in stagger-${Math.min(index + 1, 8)} ${visible ? 'visible' : ''} group bg-[#111] rounded-sm overflow-hidden`}
    >
      <Link to={`/produtos/${product.id}`} className="block relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
        )}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-[#C8F135] text-black text-[10px] font-bold tracking-widest uppercase px-2 py-1">
            {product.badge}
          </span>
        )}
        {product.stock <= 3 && (
          <span className="absolute top-2 right-2 bg-red-500/80 text-white text-[10px] tracking-widest uppercase px-2 py-1">
            {t('products.last_units')}
          </span>
        )}
      </Link>
      <div className="p-4">
        <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">
          {CATEGORY_LABELS[product.category] || product.category}
        </p>
        <Link to={`/produtos/${product.id}`}>
          <h3 className="text-sm font-medium text-white/90 mb-3 group-hover:text-[#C8F135] transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <span style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-xl tracking-wider text-[#C8F135]">
            R$ {Number(product.price).toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={handleAdd}
            className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all duration-200 ${
              added ? 'border-[#C8F135] text-[#C8F135]' : 'border-white/10 text-white/40 hover:border-[#C8F135] hover:text-[#C8F135]'
            }`}
          >
            {added ? t('products.added') : t('products.add_cart')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts]             = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch]                 = useState('')
  const { ref: headerRef, visible: headerVisible } = useScrollFadeIn()
  const { t } = useTranslation()

  const CATEGORIES = [
  { value: '',           label: t('products.all')         },
  { value: 'camisetas',  label: t('products.shirts')      },
  { value: 'calcas',     label: t('products.pants')       },
  { value: 'moletons',   label: t('products.hoodies')     },
  { value: 'acessorios', label: t('products.accessories') },
  { value: 'tenis',      label: t('products.sneakers')    }
]

  useEffect(() => {
    setLoading(true)
    productService.getAll(activeCategory ? { category: activeCategory } : {})
      .then(res => setProducts(res.data))
      .catch(() => setError({ message: t('products.error') }))
      .finally(() => setLoading(false))
  }, [activeCategory])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">

        {/* Header */}
        <div
          ref={headerRef}
          className={`fade-in ${headerVisible ? 'visible' : ''} mb-12`}
        >
          <p className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3">VHX Store</p>
          <h1 style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-5xl md:text-6xl tracking-widest text-white mb-8">
            {t('products.title')}
          </h1>
          <input
            type="text"
            placeholder={t('products.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-80 bg-[#111] border border-white/10 text-white/80 text-sm px-4 py-3 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`text-[11px] tracking-widest uppercase px-4 py-2 border transition-all duration-150 ${
                activeCategory === cat.value
                  ? 'bg-[#C8F135] border-[#C8F135] text-black'
                  : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <p className="text-red-400 text-sm tracking-wider">{error}</p>
            <button onClick={() => window.location.reload()} className="text-xs tracking-widest uppercase text-[#C8F135] hover:opacity-70">
              {t('products.retry')}
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-xs tracking-widest uppercase text-white/20 mb-6">
              {filtered.length} {filtered.length === 1 ? t('products.products_count') : t('products.products_count_plural')}
            </p>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-4xl tracking-widest text-white/10">
                  {t('products.no_results')}
                </p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('') }}
                  className="text-xs tracking-widest uppercase text-[#C8F135] hover:opacity-70 transition-opacity"
                >
                  {t('products.clear_filters')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}