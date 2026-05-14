import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { productService } from '../services/productService'

const SIZES = ['P', 'M', 'G', 'GG']

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()

  const [product, setProduct]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded]         = useState(false)
  const [sizeError, setSizeError] = useState(false)

  useEffect(() => {
    productService.getById(id)
      .then(res => setProduct(res.data))
      .catch(() => setError('Produto não encontrado'))
      .finally(() => setLoading(false))
  }, [id])

  function handleAdd() {
    if (!selectedSize) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 2000)
      return
    }
    addItem({ ...product, selectedSize })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white/20 text-xs tracking-widest uppercase animate-pulse">Carregando...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-6xl tracking-widest text-white/10">404</p>
        <p className="text-white/40 text-sm tracking-widest uppercase">Produto não encontrado</p>
        <Link to="/produtos" className="text-xs tracking-widest uppercase text-[#C8F135] hover:opacity-70 transition-opacity">
          ← Voltar à coleção
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-white/30 mb-12">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/produtos" className="hover:text-white transition-colors">Coleção</Link>
          <span>/</span>
          <span className="text-white/60">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Imagem */}
          <div className="relative aspect-square bg-[#111] rounded-sm flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <>
                <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-[200px] text-white/5 tracking-tight select-none absolute">VHX</p>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-[#C8F135]/20 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </>
            )}
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#C8F135] text-black text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                {product.badge}
              </span>
            )}
            {product.stock <= 3 && (
              <span className="absolute top-4 right-4 bg-red-500/80 text-white text-[10px] tracking-widest uppercase px-3 py-1">
                Últimas {product.stock} unidades
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-[11px] tracking-widest uppercase text-white/30 mb-3">{product.category}</p>

            <h1 style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-5xl tracking-widest text-white mb-4">
              {product.name}
            </h1>

            <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-4xl tracking-wider text-[#C8F135] mb-8">
              R$ {Number(product.price).toFixed(2).replace('.', ',')}
            </p>

            <p className="text-white/50 text-sm leading-relaxed mb-10">{product.description}</p>

            {/* Tamanhos */}
            <div className="mb-8">
              <p className="text-[11px] tracking-widest uppercase text-white/40 mb-3">
                Tamanho {sizeError && <span className="text-red-400 ml-2">— Selecione um tamanho</span>}
              </p>
              <div className="flex gap-2">
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false) }}
                    className={`w-12 h-12 text-sm tracking-widest border transition-all duration-150 ${
                      selectedSize === size
                        ? 'bg-[#C8F135] border-[#C8F135] text-black font-medium'
                        : 'border-white/10 text-white/40 hover:border-white/40 hover:text-white/70'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Botão */}
            <button
              onClick={handleAdd}
              className={`w-full py-4 text-sm font-medium tracking-widest uppercase transition-all duration-200 ${
                added
                  ? 'bg-[#C8F135]/20 border border-[#C8F135] text-[#C8F135]'
                  : 'bg-[#C8F135] text-black hover:opacity-90 active:scale-95'
              }`}
            >
              {added ? '✓ Adicionado ao carrinho' : 'Adicionar ao carrinho'}
            </button>

            {/* Detalhes */}
            <div className="mt-10 pt-8 border-t border-white/5 space-y-3">
              {[
                ['SKU',        `VHX-${String(product.id).padStart(4, '0')}`],
                ['Categoria',  product.category],
                ['Estoque',    `${product.stock} unidades`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-white/30 tracking-wider">{label}</span>
                  <span className="text-white/60">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5">
          <Link to="/produtos" className="text-[11px] tracking-widest uppercase text-white/30 hover:text-[#C8F135] transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar à coleção
          </Link>
        </div>
      </div>
    </div>
  )
}