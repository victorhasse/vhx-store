import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../context/useAuth";
import { useWishlist } from "../../context/WishlistContext";

export default function WishlistButton({
  product,
  className = "",
  showLabel = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  const [busy, setBusy] = useState(false);

  const wished = isInWishlist(product.id);

  async function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from:
            location.pathname +
            location.search,
        },
      });

      return;
    }

    if (busy) {
      return;
    }

    setBusy(true);

    try {
      await toggleWishlist(product);
    } finally {
      setBusy(false);
    }
  }

  const label = wished
    ? t("wishlist.remove", {
        defaultValue:
          "Remover da lista de desejos",
      })
    : t("wishlist.add", {
        defaultValue:
          "Adicionar à lista de desejos",
      });

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={label}
      aria-pressed={wished}
      title={label}
      className={`flex items-center justify-center gap-2 transition-all disabled:cursor-wait disabled:opacity-50 ${
        wished
          ? "border-[#C8F135] bg-[#C8F135] text-black"
          : "border-white/20 bg-black/75 text-white hover:border-[#C8F135] hover:text-[#C8F135]"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="text-xl leading-none"
      >
        {wished ? "♥" : "♡"}
      </span>

      {showLabel && (
        <span className="text-xs font-medium uppercase tracking-widest">
          {wished
            ? t("wishlist.saved", {
                defaultValue: "Salvo",
              })
            : t("wishlist.save", {
                defaultValue: "Favoritar",
              })}
        </span>
      )}
    </button>
  );
}