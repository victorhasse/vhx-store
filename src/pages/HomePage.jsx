import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'

const HERO_IMAGES = [
  'https://res.cloudinary.com/duznkmwkf/image/upload/v1779084460/cena1_pxymjz.png',
  'https://res.cloudinary.com/duznkmwkf/image/upload/v1779084460/cena2_lwx782.jpg',
  'https://res.cloudinary.com/duznkmwkf/image/upload/v1779084460/cena3_zvkjdf.jpg',
]

function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd(e) {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link to={`/produtos/${product.id}`} className="group block bg-[#111] rounded-sm overflow-hidden">
      <div className="relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
      </div>
      <div className="p-4">
        <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">{product.category}</p>
        <h3 className="text-sm font-medium text-white/90 mb-3 group-hover:text-[#C8F135] transition-colors">{product.name}</h3>
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
            {added ? '✓ Adicionado' : '+ Carrinho'}
          </button>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    productService.getAll()
      .then(res => setProducts(res.data.slice(0, 4)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-[#0a0a0a] min-h-screen">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#C8F135] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] inline-block"></span>
            Nova Coleção — SS25
          </span>
          <h1 style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-[88px] leading-[0.9] tracking-wide text-white mb-6">
            VISTA<br />O<br /><span className="text-[#C8F135]">FUTURO</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-10">
            Streetwear sem compromisso. Cada peça é uma declaração. Drop limitado toda semana.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/produtos" className="bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase px-8 py-4 hover:opacity-90 transition-opacity">
              Explorar coleção
            </Link>
            <Link to="/produtos" className="text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors flex items-center gap-2">
              Ver drops
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Hero visual — carrossel */}
        <div className="hidden md:block relative h-[520px] rounded-sm overflow-hidden">
          {HERO_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === heroIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={img} alt={`VHX Model ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`w-6 h-0.5 transition-all duration-300 ${
                  i === heroIndex ? 'bg-[#C8F135]' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Setas */}
          <button
            onClick={() => setHeroIndex(prev => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 transition-colors flex items-center justify-center z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => setHeroIndex(prev => (prev + 1) % HERO_IMAGES.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 transition-colors flex items-center justify-center z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Roupas',     count: '24 peças'   },
            { label: 'Acessórios', count: '12 peças'   },
            { label: 'Novidades',  count: 'Drops SS25' },
          ].map(({ label, count }) => (
            <Link
              key={label}
              to="/produtos"
              className="group relative h-32 bg-[#111] rounded-sm flex flex-col justify-end p-4 hover:bg-[#1a1a1a] transition-colors"
            >
              <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">{count}</p>
              <p style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-2xl tracking-widest text-white group-hover:text-[#C8F135] transition-colors">
                {label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUTOS DESTAQUE */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-baseline mb-8">
          <h2 style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-3xl tracking-widest text-white">Destaques</h2>
          <Link to="/produtos" className="text-[11px] tracking-widest uppercase text-[#C8F135] hover:opacity-70 transition-opacity">
            Ver tudo →
          </Link>
        </div>
        {loading ? (
          <p className="text-white/20 text-xs tracking-widest uppercase animate-pulse">Carregando...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* BANNER */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-[#C8F135] rounded-sm px-12 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[11px] tracking-widest uppercase text-black/50 mb-2">Novidade da semana</p>
            <h2 style={{fontFamily:'"Bebas Neue",sans-serif'}} className="text-5xl tracking-widest text-black">
              NOVO DROP<br />DISPONÍVEL
            </h2>
          </div>
          <Link to="/produtos" className="bg-black text-[#C8F135] text-xs font-medium tracking-widest uppercase px-8 py-4 hover:opacity-80 transition-opacity whitespace-nowrap">
            Ver coleção
          </Link>
        </div>
      </section>

    </div>
  )
}