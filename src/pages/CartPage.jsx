import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { t } = useTranslation();

  const CATEGORY_LABELS = {
    camisetas: t("products.shirts"),
    calcas: t("products.pants"),
    moletons: t("products.hoodies"),
    acessorios: t("products.accessories"),
    tenis: t("products.sneakers"),
  };

  function CartItem({ item }) {
    const { removeItem, updateQty } = useCart();
    const { t } = useTranslation();

    return (
      <div className="flex gap-6 py-6 border-b border-white/5">
        {/* Imagem */}
        <div className="w-24 h-24 bg-[#111] rounded-sm flex items-center justify-center flex-shrink-0">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white/10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">
                {CATEGORY_LABELS[item.category] || item.category}
              </p>
              <h3 className="text-sm font-medium text-white/90">{item.name}</h3>
              {item.selectedSize && (
                <p className="text-[11px] tracking-widest uppercase text-white/30 mt-1">
                  {t("product.size")} : {item.selectedSize}
                </p>
              )}
            </div>
            <button
              onClick={() => removeItem(item.cartItemKey)}
              className="text-white/20 hover:text-red-400 transition-colors ml-4"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            {/* Quantidade */}
            <div className="flex items-center border border-white/10">
              <button
                onClick={() =>
                  item.quantity > 1
                    ? updateQty(item.cartItemKey, item.quantity - 1)
                    : removeItem(item.cartItemKey)
                }
                className="w-8 h-8 text-white/40 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center text-lg"
              >
                −
              </button>
              <span className="w-8 text-center text-sm text-white/70">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQty(item.cartItemKey, item.quantity + 1)}
                className="w-8 h-8 text-white/40 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>

            {/* Preço */}
            <span
              style={{ fontFamily: '"Bebas Neue",sans-serif' }}
              className="text-xl tracking-wider text-[#C8F135]"
            >
              R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center gap-6">
        <p
          style={{ fontFamily: '"Bebas Neue",sans-serif' }}
          className="text-6xl tracking-widest text-white/10"
        >
          {t("cart.empty")}
        </p>
        <p className="text-white/30 text-sm tracking-wider">
          {t("cart.empty_sub")}
        </p>
        <Link
          to="/produtos"
          className="bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase px-8 py-4 hover:opacity-90 transition-opacity mt-2"
        >
          {t("cart.explore")}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <p className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3">
              VHX Store
            </p>
            <h1
              style={{ fontFamily: '"Bebas Neue",sans-serif' }}
              className="text-6xl tracking-widest text-white"
            >
              {t("cart.title")}
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-[11px] tracking-widest uppercase text-white/20 hover:text-red-400 transition-colors"
          >
            {t("cart.clear")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Lista de itens */}
          <div className="lg:col-span-2">
            {items.map((item) => (
              <CartItem key={item.cartItemKey} item={item} />
            ))}
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] rounded-sm p-6 sticky top-24">
              <p
                style={{ fontFamily: '"Bebas Neue",sans-serif' }}
                className="text-2xl tracking-widest text-white mb-6"
              >
                {t("cart.summary")}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40 tracking-wider">
                    {t("cart.items")} ({totalItems})
                  </span>
                  <span className="text-white/70">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#C8F135] text-xs tracking-widest uppercase">
                    {t("cart.calculated_at_checkout")}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mb-8">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-white/40 tracking-wider">
                    {t("cart.total")}
                  </span>
                  <span
                    style={{ fontFamily: '"Bebas Neue",sans-serif' }}
                    className="text-3xl tracking-wider text-[#C8F135]"
                  >
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-[#C8F135] text-black text-xs font-medium tracking-widest uppercase py-4 hover:opacity-90 active:scale-95 transition-all mb-3 text-center"
              >
                {t("cart.checkout")}
              </Link>

              <Link
                to="/produtos"
                className="block text-center text-[11px] tracking-widest uppercase text-white/20 hover:text-white/50 transition-colors py-2"
              >
                {t("cart.keep_shopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
