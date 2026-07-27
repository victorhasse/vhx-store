import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { couponService } from "../../services/couponService";

function formatCurrency(value) {
  return Number(value || 0)
    .toFixed(2)
    .replace(".", ",");
}

function formatDate(value) {
  if (!value) {
    return "Sem limite";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

function getCouponStatus(coupon) {
  const now = new Date();

  if (!coupon.active) {
    return {
      label: "Inativo",
      className:
        "border-white/10 bg-white/5 text-white/30",
    };
  }

  if (
    coupon.starts_at &&
    now < new Date(coupon.starts_at)
  ) {
    return {
      label: "Agendado",
      className:
        "border-blue-400/30 bg-blue-400/10 text-blue-300",
    };
  }

  if (
    coupon.expires_at &&
    now > new Date(coupon.expires_at)
  ) {
    return {
      label: "Expirado",
      className:
        "border-red-500/30 bg-red-500/10 text-red-400",
    };
  }

  return {
    label: "Ativo",
    className:
      "border-[#C8F135]/30 bg-[#C8F135]/10 text-[#C8F135]",
  };
}

export default function AdminCoupons() {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] =
    useState(null);
  const [error, setError] = useState("");

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await couponService.getAll();

      setCoupons(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível carregar os cupons.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  async function handleStatusChange(coupon) {
    setUpdatingId(coupon.id);
    setError("");

    try {
      const response =
        await couponService.updateStatus(
          coupon.id,
          !coupon.active,
        );

      setCoupons((currentCoupons) =>
        currentCoupons.map((currentCoupon) =>
          currentCoupon.id === coupon.id
            ? response.data
            : currentCoupon,
        ),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível atualizar o cupom.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/admin"
              className="mb-3 block text-[11px] uppercase tracking-widest text-[#C8F135] hover:opacity-70"
            >
              ← Voltar ao painel
            </Link>

            <h1
              style={{
                fontFamily:
                  '"Bebas Neue",sans-serif',
              }}
              className="text-6xl tracking-widest text-white"
            >
              Cupons
            </h1>
          </div>

          <Link
            to="/admin/cupons/novo"
            className="bg-[#C8F135] px-6 py-3 text-center text-xs font-medium uppercase tracking-widest text-black transition-opacity hover:opacity-90"
          >
            Novo cupom
          </Link>
        </div>

        {error && (
          <div className="mb-6 border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs tracking-wider text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <p className="animate-pulse text-xs uppercase tracking-widest text-white/20">
            Carregando...
          </p>
        ) : coupons.length === 0 ? (
          <div className="border border-white/10 bg-[#111] px-6 py-14 text-center">
            <p
              style={{
                fontFamily:
                  '"Bebas Neue",sans-serif',
              }}
              className="text-3xl tracking-widest text-white/30"
            >
              Nenhum cupom cadastrado
            </p>

            <p className="mt-2 text-xs text-white/20">
              Crie o primeiro cupom promocional da
              loja.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map((coupon) => {
              const status =
                getCouponStatus(coupon);

              return (
                <div
                  key={coupon.id}
                  className="flex flex-col gap-5 bg-[#111] p-5 md:flex-row md:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p
                        style={{
                          fontFamily:
                            '"Bebas Neue",sans-serif',
                        }}
                        className="text-2xl tracking-widest text-white"
                      >
                        {coupon.code}
                      </p>

                      <span
                        className={`border px-2 py-1 text-[9px] uppercase tracking-widest ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/20">
                          Desconto
                        </p>

                        <p className="mt-1 text-xs text-[#C8F135]">
                          {coupon.discount_type ===
                          "percentage"
                            ? `${Number(
                                coupon.discount_value,
                              )}%`
                            : `R$ ${formatCurrency(
                                coupon.discount_value,
                              )}`}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/20">
                          Pedido mínimo
                        </p>

                        <p className="mt-1 text-xs text-white/60">
                          R${" "}
                          {formatCurrency(
                            coupon.minimum_order_amount,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/20">
                          Validade
                        </p>

                        <p className="mt-1 text-xs text-white/60">
                          {formatDate(
                            coupon.expires_at,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/20">
                          Limite de usos
                        </p>

                        <p className="mt-1 text-xs text-white/60">
                          {coupon.usage_limit ??
                            "Sem limite"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/cupons/${coupon.id}/editar`,
                        )
                      }
                      className="border border-white/10 px-4 py-2 text-[10px] uppercase tracking-widest text-white/40 transition-all hover:border-[#C8F135] hover:text-[#C8F135]"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(coupon)
                      }
                      disabled={
                        updatingId === coupon.id
                      }
                      className={`border px-4 py-2 text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 ${
                        coupon.active
                          ? "border-red-500/20 text-red-400 hover:border-red-500/60"
                          : "border-[#C8F135]/20 text-[#C8F135] hover:border-[#C8F135]/60"
                      }`}
                    >
                      {updatingId === coupon.id
                        ? "..."
                        : coupon.active
                          ? "Desativar"
                          : "Ativar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}