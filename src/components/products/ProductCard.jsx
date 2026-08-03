import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useCart } from "../../context/CartContext";
import { useScrollFadeIn } from "../../hooks/useFadeIn";
import WishlistButton from "../ui/WishlistButton";

function getProductStock(product) {
  const variants = Array.isArray(product.variants)
    ? product.variants
    : [];

  if (variants.length > 0) {
    return variants.reduce(
      (total, variant) =>
        total + Number(variant.stock || 0),
      0,
    );
  }

  return Number(product.stock || 0);
}

function getProductImage(product) {
  const images = Array.isArray(product.images)
    ? product.images
    : [];

  const image =
    images.find((item) => item.is_primary) ||
    images[0];

  return (
    product.image_url ||
    image?.image_url ||
    null
  );
}

export default function ProductCard({
  product,
  index = 0,
}) {
  const { addItem } = useCart();
  const { t } = useTranslation();
  const { ref, visible } = useScrollFadeIn();

  const [added, setAdded] = useState(false);

  const categoryLabels = {
    camisetas: t("products.shirts"),
    calcas: t("products.pants"),
    moletons: t("products.hoodies"),
    acessorios: t("products.accessories"),
    tenis: t("products.sneakers"),
  };

  const variants = Array.isArray(product.variants)
    ? product.variants
    : [];

  const requiresSelection = variants.length > 0;
  const stock = getProductStock(product);
  const image = getProductImage(product);

  function handleAdd() {
    if (requiresSelection) {
      return;
    }

    addItem(product);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  return (
    <div
      ref={ref}
      className={`fade-in stagger-${Math.min(
        index + 1,
        8,
      )} ${
        visible ? "visible" : ""
      } group bg-[#111] rounded-sm overflow-hidden`}
    >
      <div className="relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden">
        <Link
          to={`/produtos/${product.id}`}
          className="block h-full w-full"
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
        </Link>

        {product.badge && (
          <span className="absolute top-2 left-2 bg-[#C8F135] text-black text-[10px] font-bold tracking-widest uppercase px-2 py-1 pointer-events-none">
            {product.badge}
          </span>
        )}

        <WishlistButton
          product={product}
          className="absolute right-3 top-3 z-10 h-10 w-10 rounded-full border"
        />

        {stock > 0 && stock <= 3 && (
          <span className="absolute bottom-2 right-2 bg-red-500/80 text-white text-[10px] tracking-widest uppercase px-2 py-1 pointer-events-none">
            {t("products.last_units")}
          </span>
        )}

        {stock === 0 && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white/60 text-[10px] tracking-widest uppercase px-2 py-1 pointer-events-none">
            {t("products.unavailable", {
              defaultValue: "Indisponível",
            })}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">
          {categoryLabels[product.category] ||
            product.category}
        </p>

        <Link to={`/produtos/${product.id}`}>
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
            R${" "}
            {Number(product.price)
              .toFixed(2)
              .replace(".", ",")}
          </span>

          {requiresSelection ? (
            <Link
              to={`/produtos/${product.id}`}
              className="text-[10px] tracking-widest uppercase px-3 py-1.5 border border-white/10 text-white/40 hover:border-[#C8F135] hover:text-[#C8F135] transition-all"
            >
              {t("products.options")}
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={stock === 0}
              className={`text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all ${
                added
                  ? "border-[#C8F135] text-[#C8F135]"
                  : "border-white/10 text-white/40 hover:border-[#C8F135] hover:text-[#C8F135]"
              } disabled:opacity-30 disabled:pointer-events-none`}
            >
              {added
                ? t("products.added")
                : t("products.add_cart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}