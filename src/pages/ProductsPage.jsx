import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  useSearchParams,
} from 'react-router-dom'

import {
  useCart,
} from '../context/CartContext'

import {
  productService,
} from '../services/productService'

import {
  ProductCardSkeleton,
} from '../components/ui/Skeleton'

import {
  useScrollFadeIn,
} from '../hooks/useFadeIn'

import {
  useTranslation,
} from 'react-i18next'

function getProductStock(product) {
  const variants = Array.isArray(
    product.variants
  )
    ? product.variants
    : []

  if (variants.length > 0) {
    return variants.reduce(
      (total, variant) =>
        total +
        Number(variant.stock || 0),
      0
    )
  }

  return Number(product.stock || 0)
}

function getProductImage(product) {
  const images = Array.isArray(
    product.images
  )
    ? product.images
    : []

  const image =
    images.find(item =>
      item.is_primary
    ) ||
    images[0]

  return (
    product.image_url ||
    image?.image_url ||
    null
  )
}

function ProductCard({
  product,
  index,
}) {
  const { addItem } = useCart()
  const [added, setAdded] =
    useState(false)

  const {
    ref,
    visible,
  } = useScrollFadeIn()

  const { t } = useTranslation()

  const categoryLabels = {
    camisetas:
      t('products.shirts'),

    calcas:
      t('products.pants'),

    moletons:
      t('products.hoodies'),

    acessorios:
      t('products.accessories'),

    tenis:
      t('products.sneakers'),
  }

  const variants = Array.isArray(
    product.variants
  )
    ? product.variants
    : []

  const requiresSelection =
    variants.length > 0

  const stock =
    getProductStock(product)

  const image =
    getProductImage(product)

  function handleAdd() {
    if (requiresSelection) {
      return
    }

    addItem(product)
    setAdded(true)

    setTimeout(
      () => setAdded(false),
      1500
    )
  }

  return (
    <div
      ref={ref}
      className={`fade-in stagger-${Math.min(
        index + 1,
        8
      )} ${
        visible ? 'visible' : ''
      } group bg-[#111] rounded-sm overflow-hidden`}
    >
      <Link
        to={`/produtos/${product.id}`}
        className="block relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden"
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 text-sm">
            VHX
          </div>
        )}

        {product.badge && (
          <span className="absolute top-2 left-2 bg-[#C8F135] text-black text-[10px] font-bold tracking-widest uppercase px-2 py-1">
            {product.badge}
          </span>
        )}

        {stock > 0 && stock <= 3 && (
          <span className="absolute top-2 right-2 bg-red-500/80 text-white text-[10px] tracking-widest uppercase px-2 py-1">
            {t('products.last_units')}
          </span>
        )}

        {stock === 0 && (
          <span className="absolute top-2 right-2 bg-black/80 text-white/60 text-[10px] tracking-widest uppercase px-2 py-1">
            Indisponível
          </span>
        )}
      </Link>

      <div className="p-4">
        <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">
          {categoryLabels[
            product.category
          ] || product.category}
        </p>

        <Link
          to={`/produtos/${product.id}`}
        >
          <h3 className="text-sm font-medium text-white/90 mb-3 group-hover:text-[#C8F135] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-2">
          <span
            style={{
              fontFamily:
                '"Bebas Neue", sans-serif',
            }}
            className="text-xl tracking-wider text-[#C8F135]"
          >
            R${' '}
            {Number(product.price)
              .toFixed(2)
              .replace('.', ',')}
          </span>

          {requiresSelection ? (
            <Link
              to={`/produtos/${product.id}`}
              className="text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/10 text-white/40 hover:border-[#C8F135] hover:text-[#C8F135] transition-all"
            >
              Ver opções
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={stock === 0}
              className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all ${
                added
                  ? 'border-[#C8F135] text-[#C8F135]'
                  : 'border-white/10 text-white/40 hover:border-[#C8F135] hover:text-[#C8F135]'
              } disabled:opacity-30 disabled:pointer-events-none`}
            >
              {added
                ? t('products.added')
                : t(
                    'products.add_cart'
                  )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] =
    useSearchParams()

  const [products, setProducts] =
    useState([])

  const [filterOptions, setFilterOptions] =
    useState({
      colors: [],
      sizes: [],
    })

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [activeCategory, setActiveCategory] =
    useState(
      searchParams.get('category') || ''
    )

  const [search, setSearch] =
    useState(
      searchParams.get('search') || ''
    )

  const [color, setColor] =
    useState(
      searchParams.get('color') || ''
    )

  const [size, setSize] =
    useState(
      searchParams.get('size') || ''
    )

  const [minPrice, setMinPrice] =
    useState(
      searchParams.get('minPrice') || ''
    )

  const [maxPrice, setMaxPrice] =
    useState(
      searchParams.get('maxPrice') || ''
    )

  const {
    ref: headerRef,
    visible: headerVisible,
  } = useScrollFadeIn()

  const { t } = useTranslation()

  const categories = [
    {
      value: '',
      label: t('products.all'),
    },
    {
      value: 'camisetas',
      label: t('products.shirts'),
    },
    {
      value: 'calcas',
      label: t('products.pants'),
    },
    {
      value: 'moletons',
      label: t('products.hoodies'),
    },
    {
      value: 'acessorios',
      label:
        t('products.accessories'),
    },
    {
      value: 'tenis',
      label: t('products.sneakers'),
    },
  ]

  /*
   * Carrega as opções possíveis sem aplicar
   * os filtros escolhidos.
   */
  useEffect(() => {
    let active = true

    productService
      .getAll()
      .then(response => {
        if (!active) return

        const colorMap = new Map()
        const sizeSet = new Set()

        response.data.forEach(product => {
          product.colors?.forEach(
            item => {
              colorMap.set(
                item.slug,
                {
                  slug: item.slug,
                  name: item.name,
                  hex_code:
                    item.hex_code,
                }
              )
            }
          )

          product.variants?.forEach(
            variant => {
              if (
                variant.size &&
                Number(
                  variant.stock
                ) > 0
              ) {
                sizeSet.add(
                  String(variant.size)
                )
              }
            }
          )
        })

        setFilterOptions({
          colors: [
            ...colorMap.values(),
          ].sort((first, second) =>
            first.name.localeCompare(
              second.name,
              'pt-BR'
            )
          ),

          sizes: [
            ...sizeSet,
          ].sort((first, second) =>
            first.localeCompare(
              second,
              'pt-BR',
              {
                numeric: true,
              }
            )
          ),
        })
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  /*
   * Mantém filtros compartilháveis na URL.
   */
  useEffect(() => {
    const nextParams =
      new URLSearchParams()

    if (activeCategory) {
      nextParams.set(
        'category',
        activeCategory
      )
    }

    if (search.trim()) {
      nextParams.set(
        'search',
        search.trim()
      )
    }

    if (color) {
      nextParams.set('color', color)
    }

    if (size) {
      nextParams.set('size', size)
    }

    if (minPrice !== '') {
      nextParams.set(
        'minPrice',
        minPrice
      )
    }

    if (maxPrice !== '') {
      nextParams.set(
        'maxPrice',
        maxPrice
      )
    }

    setSearchParams(
      nextParams,
      {
        replace: true,
      }
    )
  }, [
    activeCategory,
    search,
    color,
    size,
    minPrice,
    maxPrice,
    setSearchParams,
  ])

  /*
   * Busca no servidor com pequeno debounce.
   */
  useEffect(() => {
    let active = true

    const timeoutId = setTimeout(
      async () => {
        const parsedMin =
          minPrice === ''
            ? null
            : Number(minPrice)

        const parsedMax =
          maxPrice === ''
            ? null
            : Number(maxPrice)

        if (
          parsedMin !== null &&
          parsedMax !== null &&
          parsedMin > parsedMax
        ) {
          setProducts([])
          setLoading(false)
          setError(
            'O preço mínimo não pode ser maior que o máximo'
          )
          return
        }

        setLoading(true)
        setError('')

        try {
          const params = {}

          if (activeCategory) {
            params.category =
              activeCategory
          }

          if (search.trim()) {
            params.search =
              search.trim()
          }

          if (color) {
            params.color = color
          }

          if (size) {
            params.size = size
          }

          if (minPrice !== '') {
            params.minPrice =
              minPrice
          }

          if (maxPrice !== '') {
            params.maxPrice =
              maxPrice
          }

          const response =
            await productService.getAll(
              params
            )

          if (active) {
            setProducts(
              response.data
            )
          }
        } catch (requestError) {
          if (active) {
            setError(
              requestError.response
                ?.data?.error ||
              t('products.error')
            )
          }
        } finally {
          if (active) {
            setLoading(false)
          }
        }
      },
      350
    )

    return () => {
      active = false
      clearTimeout(timeoutId)
    }
  }, [
    activeCategory,
    search,
    color,
    size,
    minPrice,
    maxPrice,
    t,
  ])

  const activeFilterCount = [
    activeCategory,
    search.trim(),
    color,
    size,
    minPrice,
    maxPrice,
  ].filter(Boolean).length

  function clearFilters() {
    setActiveCategory('')
    setSearch('')
    setColor('')
    setSize('')
    setMinPrice('')
    setMaxPrice('')
    setError('')
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div
          ref={headerRef}
          className={`fade-in ${
            headerVisible
              ? 'visible'
              : ''
          } mb-10`}
        >
          <p className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3">
            VHX Store
          </p>

          <h1
            style={{
              fontFamily:
                '"Bebas Neue", sans-serif',
            }}
            className="text-5xl md:text-6xl tracking-widest text-white mb-8"
          >
            {t('products.title')}
          </h1>

          <div className="relative max-w-2xl">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              />
            </svg>

            <input
              type="search"
              value={search}
              onChange={event =>
                setSearch(
                  event.target.value
                )
              }
              placeholder={
                t('products.search')
              }
              className="w-full h-14 bg-[#111] border border-white/10 text-white/80 pl-12 pr-12 outline-none focus:border-[#C8F135] transition-colors placeholder:text-white/20"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch('')
                }
                aria-label="Limpar busca"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <section className="bg-[#111] border border-white/5 p-5 mb-8">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs tracking-widest uppercase text-white/50">
              Filtros
              {activeFilterCount > 0 &&
                ` · ${activeFilterCount}`}
            </p>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[10px] tracking-widest uppercase text-[#C8F135] hover:opacity-70"
              >
                Limpar filtros
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap mb-5">
            {categories.map(category => (
              <button
                key={category.value}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    category.value
                  )
                }
                className={`text-[11px] tracking-widest uppercase px-4 py-2 border transition-all ${
                  activeCategory ===
                  category.value
                    ? 'bg-[#C8F135] border-[#C8F135] text-black'
                    : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={color}
              onChange={event =>
                setColor(
                  event.target.value
                )
              }
              aria-label="Filtrar por cor"
              className="h-12 bg-[#0a0a0a] border border-white/10 text-white/70 px-4 outline-none focus:border-[#C8F135]"
            >
              <option value="">
                Todas as cores
              </option>

              {filterOptions.colors.map(
                item => (
                  <option
                    key={item.slug}
                    value={item.slug}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>

            <select
              value={size}
              onChange={event =>
                setSize(
                  event.target.value
                )
              }
              aria-label="Filtrar por tamanho"
              className="h-12 bg-[#0a0a0a] border border-white/10 text-white/70 px-4 outline-none focus:border-[#C8F135]"
            >
              <option value="">
                Todos os tamanhos
              </option>

              {filterOptions.sizes.map(
                item => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            <input
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={event =>
                setMinPrice(
                  event.target.value
                )
              }
              placeholder="Preço mínimo"
              className="h-12 bg-[#0a0a0a] border border-white/10 text-white/70 px-4 outline-none focus:border-[#C8F135] placeholder:text-white/20"
            />

            <input
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={event =>
                setMaxPrice(
                  event.target.value
                )
              }
              placeholder="Preço máximo"
              className="h-12 bg-[#0a0a0a] border border-white/10 text-white/70 px-4 outline-none focus:border-[#C8F135] placeholder:text-white/20"
            />
          </div>
        </section>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <ProductCardSkeleton
                key={index}
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs tracking-widest uppercase text-[#C8F135]"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-xs tracking-widest uppercase text-white/20 mb-6">
              {products.length}{' '}
              {products.length === 1
                ? t(
                    'products.products_count'
                  )
                : t(
                    'products.products_count_plural'
                  )}
            </p>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(
                  (product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <p
                  style={{
                    fontFamily:
                      '"Bebas Neue", sans-serif',
                  }}
                  className="text-4xl tracking-widest text-white/10"
                >
                  {t(
                    'products.no_results'
                  )}
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs tracking-widest uppercase text-[#C8F135]"
                >
                  {t(
                    'products.clear_filters'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}