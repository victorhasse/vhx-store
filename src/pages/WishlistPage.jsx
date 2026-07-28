import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

function getProductImage(product) {
  const images = Array.isArray(product?.images) ? product.images : [];

  const primaryImage = images.find((image) => image.is_primary) || images[0];

  return product?.image_url || primaryImage?.image_url || null;
}

export default function WishlistPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const { items, loading, error, removeFromWishlist, loadWishlist } =
    useWishlist();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/wishlist" }} replace />;
  }

  if (loading) {
    return (
      <section className="min-h-[70vh] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
            {t("wishlist.loading", {
              defaultValue: "Carregando lista de desejos...",
            })}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-sm bg-[#111]"
              >
                <div className="aspect-[3/4] bg-white/5" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/3 bg-white/5" />
                  <div className="h-4 w-2/3 bg-white/5" />
                  <div className="h-5 w-1/4 bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70vh] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#C8F135]">
            VHX Store
          </p>

          <h1
            className="text-4xl uppercase tracking-wider text-white sm:text-5xl"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
            }}
          >
            {t("wishlist.title", {
              defaultValue: "Lista de desejos",
            })}
          </h1>

          <p className="mt-3 text-sm text-white/40">
            {t("wishlist.count", { count: items.length })}
          </p>
        </div>

        {error && (
          <div className="mb-8 border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm text-red-300">{error}</p>

            <button
              type="button"
              onClick={loadWishlist}
              className="mt-3 text-xs uppercase tracking-widest text-[#C8F135]"
            >
              {t("wishlist.try_again", {
                defaultValue: "Tentar novamente",
              })}
            </button>
          </div>
        )}

        {!error && items.length === 0 ? (
          <div className="border border-white/10 bg-[#111] px-6 py-20 text-center">
            <div aria-hidden="true" className="mb-5 text-5xl text-white/15">
              ♡
            </div>

            <h2
              className="text-2xl uppercase tracking-wider text-white"
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
              }}
            >
              {t("wishlist.empty_title", {
                defaultValue: "Sua lista está vazia",
              })}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/40">
              {t("wishlist.empty_text", {
                defaultValue:
                  "Explore nossos produtos e salve seus favoritos para encontrar tudo facilmente depois.",
              })}
            </p>

            <Link
              to="/produtos"
              className="mt-8 inline-flex bg-[#C8F135] px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-white"
            >
              {t("wishlist.explore", {
                defaultValue: "Explorar produtos",
              })}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const product = item.product;
              const image = getProductImage(product);
              const unavailable = Number(product?.stock || 0) === 0;

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-sm bg-[#111]"
                >
                  <div className="relative">
                    <Link
                      to={`/produtos/${product.id}`}
                      className="block aspect-[3/4] overflow-hidden bg-[#1a1a1a]"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-white/10">
                          VHX
                        </div>
                      )}
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label={t("wishlist.remove", {
                        defaultValue: "Remover da lista de desejos",
                      })}
                      title={t("wishlist.remove", {
                        defaultValue: "Remover da lista de desejos",
                      })}
                      className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#C8F135]/50 bg-black/80 text-xl text-[#C8F135] transition-all hover:scale-105 hover:bg-[#C8F135] hover:text-black"
                    >
                      ♥
                    </button>

                    {unavailable && (
                      <span className="absolute bottom-3 left-3 bg-black/80 px-2 py-1 text-[10px] uppercase tracking-widest text-white/60">
                        {t("products.unavailable", {
                          defaultValue: "Indisponível",
                        })}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="mb-1 text-[10px] uppercase tracking-widest text-white/30">
                      {product.category}
                    </p>

                    <Link to={`/produtos/${product.id}`}>
                      <h2 className="mb-3 text-sm font-medium text-white/90 transition-colors hover:text-[#C8F135]">
                        {product.name}
                      </h2>
                    </Link>

                    <div className="flex items-center justify-between gap-4">
                      <span
                        className="text-xl tracking-wider text-[#C8F135]"
                        style={{
                          fontFamily: '"Bebas Neue", sans-serif',
                        }}
                      >
                        R$ {Number(product.price).toFixed(2).replace(".", ",")}
                      </span>

                      <Link
                        to={`/produtos/${product.id}`}
                        className="border border-white/10 px-3 py-2 text-[10px] uppercase tracking-widest text-white/50 transition-all hover:border-[#C8F135] hover:text-[#C8F135]"
                      >
                        {t("wishlist.view_product", {
                          defaultValue: "Ver produto",
                        })}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
