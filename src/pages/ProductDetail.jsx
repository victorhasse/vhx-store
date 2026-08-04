import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productService } from "../services/productService";
import { useTranslation } from "react-i18next";
import WishlistButton from "../components/ui/WishlistButton";
import ProductCard from "../components/products/ProductCard";
import { useCurrency } from "../context/useCurrency";

import {
  findSelectedVariant,
  getAvailableSizes,
  getColorImages,
  getPrimaryImage,
  getProductColors,
  getProductVariants,
  getVariantPrice,
  getVariantsForColor,
} from "../utils/productVariants";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  const SIZES = [
    { value: "S", label: t("product.sizes.S") },
    { value: "M", label: t("product.sizes.M") },
    { value: "L", label: t("product.sizes.L") },
    { value: "XL", label: t("product.sizes.XL") },
  ];

  const CATEGORY_LABELS = {
    camisetas: t("products.shirts"),
    calcas: t("products.pants"),
    moletons: t("products.hoodies"),
    acessorios: t("products.accessories"),
    tenis: t("products.sneakers"),
  };

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [optionError, setOptionError] = useState("");
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    productService
      .getById(id)
      .then((res) => {
        const loadedProduct = res.data;

        setProduct(loadedProduct);
        setActiveImage(getPrimaryImage(loadedProduct, null));
      })
      .catch(() => setError(t("product.not_found")))
      .finally(() => setLoading(false));
  }, [id, t]);

  useEffect(() => {
    let isCurrentRequest = true;

    setRecommendations([]);

    productService
      .getRecommendations(id)
      .then((res) => {
        if (!isCurrentRequest) {
          return;
        }

        setRecommendations(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (isCurrentRequest) {
          setRecommendations([]);
        }
      });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    return () => {
      isCurrentRequest = false;
    };
  }, [id, t]);
  const colors = getProductColors(product);
  const variants = getProductVariants(product);

  const variantsForColor = getVariantsForColor(product, selectedColorId);

  const availableSizes = getAvailableSizes(variantsForColor);

  const selectedVariant = findSelectedVariant(variantsForColor, selectedSize);

  const selectedColor =
    colors.find((color) => Number(color.id) === Number(selectedColorId)) ||
    null;

  const displayedPrice = getVariantPrice(product, selectedVariant);

  const displayedStock = selectedVariant
    ? Number(selectedVariant.stock)
    : variants.length > 0
      ? variantsForColor.reduce(
          (total, variant) => total + Number(variant.stock),
          0,
        )
      : Number(product?.stock || 0);

  const displayedImages = getColorImages(product, selectedColorId);

  const sizeOptions =
    variants.length > 0
      ? availableSizes.map((value) => ({
          value,
          label: t(`product.sizes.${value}`, {
            defaultValue: value,
          }),
        }))
      : SIZES;

  function handleZoomMove(event) {
    const rectangle = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rectangle.left) / rectangle.width) * 100;

    const y = ((event.clientY - rectangle.top) / rectangle.height) * 100;

    event.currentTarget.style.setProperty("--zoom-x", `${x}%`);

    event.currentTarget.style.setProperty("--zoom-y", `${y}%`);
  }

  function handleColorSelect(color) {
    setSelectedColorId(color.id);
    setSelectedSize(null);
    setSizeError(false);
    setOptionError("");

    setActiveImage(getPrimaryImage(product, color.id));
  }
  function handleAdd() {
    if (variants.length > 0) {
      if (colors.length > 0 && !selectedColorId) {
        setOptionError("Selecione uma cor");
        return;
      }

      const hasSizedVariants = variantsForColor.some((variant) => variant.size);

      if (hasSizedVariants && !selectedSize) {
        setSizeError(true);

        setTimeout(() => setSizeError(false), 2000);

        return;
      }

      if (!selectedVariant || Number(selectedVariant.stock) <= 0) {
        setOptionError("Esta opção não está disponível");
        return;
      }

      addItem({
        ...product,
        variantId: selectedVariant.id,
        selectedSize: selectedVariant.size || null,
        selectedColor: selectedColor
          ? {
              id: selectedColor.id,
              name: selectedColor.name,
              slug: selectedColor.slug,
              hex_code: selectedColor.hex_code,
            }
          : null,
        sku: selectedVariant.sku,
        stock: Number(selectedVariant.stock),
        price: getVariantPrice(product, selectedVariant),
        image_url: activeImage || product.image_url,
      });
    } else {
      /*
       * Compatibilidade com o catálogo antigo.
       */
      if (!selectedSize) {
        setSizeError(true);

        setTimeout(() => setSizeError(false), 2000);

        return;
      }

      addItem({
        ...product,
        selectedSize,
      });
    }

    setAdded(true);
    setOptionError("");

    setTimeout(() => setAdded(false), 2000);
  }
  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white/20 text-xs tracking-widest uppercase animate-pulse">
          {t("common.loading")}
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <p
          style={{ fontFamily: '"Bebas Neue",sans-serif' }}
          className="text-6xl tracking-widest text-white/10"
        >
          404
        </p>
        <p className="text-white/40 text-sm tracking-widest uppercase">
          {t("product.not_found")}
        </p>
        <Link
          to="/produtos"
          className="text-xs tracking-widest uppercase text-[#C8F135] hover:opacity-70 transition-opacity"
        >
          {t("product.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-white/30 mb-12">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/produtos" className="hover:text-white transition-colors">
            {t("products.title")}
          </Link>
          <span>/</span>
          <span className="text-white/60">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Galeria */}
          <div>
            <div
              role={activeImage ? "button" : undefined}
              tabIndex={activeImage ? 0 : undefined}
              aria-label={
                activeImage ? `Ampliar imagem de ${product.name}` : undefined
              }
              onMouseEnter={() => {
                if (activeImage) {
                  setIsZoomed(true);
                }
              }}
              onMouseMove={handleZoomMove}
              onMouseLeave={() => setIsZoomed(false)}
              onClick={() => {
                if (activeImage) {
                  setIsLightboxOpen(true);
                }
              }}
              onKeyDown={(event) => {
                if (
                  activeImage &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  setIsLightboxOpen(true);
                }
              }}
              className={`relative aspect-square bg-[#111] rounded-sm flex items-center justify-center overflow-hidden ${
                activeImage ? "cursor-zoom-in" : ""
              }`}
            >
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={
                    selectedColor
                      ? `${product.name} - ${selectedColor.name}`
                      : product.name
                  }
                  draggable="false"
                  style={{
                    transformOrigin: "var(--zoom-x, 50%) var(--zoom-y, 50%)",
                  }}
                  className={`w-full h-full object-cover select-none will-change-transform transition-transform duration-150 ${
                    isZoomed ? "md:scale-[2]" : "scale-100"
                  }`}
                />
              ) : (
                <>
                  <p
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                    }}
                    className="text-[200px] text-white/5 tracking-tight select-none absolute"
                  >
                    VHX
                  </p>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-24 h-24 text-[#C8F135]/20 relative z-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={0.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                </>
              )}

              {activeImage && (
                <span className="absolute bottom-4 right-4 pointer-events-none bg-black/60 text-white/60 text-[9px] tracking-widest uppercase px-3 py-2">
                  Passe para ampliar · clique para abrir
                </span>
              )}

              {product.badge && (
                <span className="absolute top-4 left-4 pointer-events-none bg-[#C8F135] text-black text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                  {product.badge}
                </span>
              )}

              {displayedStock > 0 && displayedStock <= 3 && (
                <span className="absolute top-4 right-4 pointer-events-none bg-red-500/80 text-white text-[10px] tracking-widest uppercase px-3 py-1">
                  {t("product.last_units")} {displayedStock}{" "}
                  {t("product.units")}
                </span>
              )}
            </div>

            {displayedImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mt-3">
                {displayedImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => {
                      setActiveImage(image.image_url);

                      setIsZoomed(false);
                    }}
                    className={`aspect-square overflow-hidden border transition-colors ${
                      activeImage === image.image_url
                        ? "border-[#C8F135]"
                        : "border-white/10 hover:border-white/40"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-[11px] tracking-widest uppercase text-white/30 mb-3">
              {CATEGORY_LABELS[product.category] || product.category}
            </p>

            <h1
              style={{ fontFamily: '"Bebas Neue",sans-serif' }}
              className="text-5xl tracking-widest text-white mb-4"
            >
              {product.name}
            </h1>

            <p
              style={{ fontFamily: '"Bebas Neue",sans-serif' }}
              className="text-4xl tracking-wider text-[#C8F135] mb-8"
            >
              {formatPrice(displayedPrice)}
            </p>

            <p className="text-white/50 text-sm leading-relaxed mb-10">
              {product.description}
            </p>

            {colors.length > 0 && (
              <div className="mb-8">
                <p className="text-[11px] tracking-widest uppercase text-white/40 mb-3">
                  Cor
                  {selectedColor && (
                    <span className="text-white/70 ml-2">
                      {selectedColor.name}
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      title={color.name}
                      aria-label={`Selecionar cor ${color.name}`}
                      onClick={() => handleColorSelect(color)}
                      className={`w-11 h-11 p-1 border transition-all ${
                        Number(selectedColorId) === Number(color.id)
                          ? "border-[#C8F135]"
                          : "border-white/10 hover:border-white/40"
                      }`}
                    >
                      <span
                        className="block w-full h-full border border-white/10"
                        style={{
                          backgroundColor: color.hex_code,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tamanhos */}
            <div className="mb-8">
              <p className="text-[11px] tracking-widest uppercase text-white/40 mb-3">
                {t("product.size")}{" "}
                {sizeError && (
                  <span className="text-red-400 ml-2">
                    {t("product.size_error")}
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                {sizeOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setSelectedSize(value);
                      setSizeError(false);
                    }}
                    className={`w-12 h-12 text-sm tracking-widest border transition-all duration-150 ${
                      selectedSize === value
                        ? "bg-[#C8F135] border-[#C8F135] text-black font-medium"
                        : "border-white/10 text-white/40 hover:border-white/40 hover:text-white/70"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {optionError && (
              <p className="text-red-400 text-xs tracking-wider mb-5">
                {optionError}
              </p>
            )}
            {/* Botão */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                onClick={handleAdd}
                disabled={displayedStock <= 0}
                className={`min-h-14 px-6 py-4 text-sm font-medium uppercase tracking-widest transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                  added
                    ? "border border-[#C8F135] bg-[#C8F135]/20 text-[#C8F135]"
                    : "bg-[#C8F135] text-black hover:opacity-90 active:scale-[0.99]"
                }`}
              >
                {displayedStock <= 0
                  ? t("products.unavailable", {
                      defaultValue: "Indisponível",
                    })
                  : added
                    ? t("product.added")
                    : t("product.add_cart")}
              </button>

              <WishlistButton
                product={product}
                showLabel
                className="min-h-14 border px-6 py-4"
              />
            </div>

            {/* Detalhes */}
            <div className="mt-10 pt-8 border-t border-white/5 space-y-3">
              {[
                [
                  "SKU",
                  selectedVariant?.sku ||
                    `VHX-${String(product.id).padStart(4, "0")}`,
                ],
                [t("product.category"), product.category],
                [t("product.stock"), `${displayedStock} ${t("product.units")}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-white/30 tracking-wider">{label}</span>
                  <span className="text-white/60">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {recommendations.length > 0 && (
          <section className="mt-20 pt-12 border-t border-white/5">
            <div className="mb-8">
              <p className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-2">
                {t("product.recommendations_label", {
                  defaultValue: "Recomendações",
                })}
              </p>

              <h2
                style={{
                  fontFamily: '"Bebas Neue", sans-serif',
                }}
                className="text-3xl tracking-widest text-white"
              >
                {t("product.recommendations_title", {
                  defaultValue: "Você também pode gostar",
                })}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommendations.map((recommendedProduct, index) => (
                <ProductCard
                  key={recommendedProduct.id}
                  product={recommendedProduct}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}
        <div className="mt-20 pt-8 border-t border-white/5">
          <Link
            to="/produtos"
            className="text-[11px] tracking-widest uppercase text-white/30 hover:text-[#C8F135] transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            {t("product.back")}
          </Link>
        </div>
      </div>

      {isLightboxOpen && activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada de ${product.name}`}
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10"
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Fechar imagem ampliada"
            className="absolute top-5 right-5 w-11 h-11 border border-white/20 text-white text-xl hover:border-[#C8F135] hover:text-[#C8F135]"
          >
            ✕
          </button>

          <img
            src={activeImage}
            alt={
              selectedColor
                ? `${product.name} - ${selectedColor.name}`
                : product.name
            }
            onClick={(event) => event.stopPropagation()}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
