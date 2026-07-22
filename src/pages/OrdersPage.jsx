import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/orderService";
import { OrderCardSkeleton } from "../components/ui/Skeleton";
import { useTranslation } from "react-i18next";

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const STATUS_MAP = {
    pending: {
      label: t("orders.pending"),
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    confirmed: {
      label: t("orders.confirmed"),
      color: "text-[#C8F135]",
      bg: "bg-[#C8F135]/10",
    },
    shipped: {
      label: t("orders.shipped"),
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    delivered: {
      label: t("orders.delivered"),
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    cancelled: {
      label: t("orders.cancelled"),
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    orderService
      .getAll()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <Link
            to="/perfil"
            className="text-[11px] tracking-widest uppercase text-[#C8F135] mb-3 block hover:opacity-70"
          >
            {t("orders.back")}
          </Link>
          <h1
            style={{ fontFamily: '"Bebas Neue",sans-serif' }}
            className="text-6xl tracking-widest text-white"
          >
            {t("orders.title")}
          </h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <p
              style={{ fontFamily: '"Bebas Neue",sans-serif' }}
              className="text-4xl tracking-widest text-white/10"
            >
              {t("orders.empty")}
            </p>
            <Link
              to="/produtos"
              className="text-xs tracking-widest uppercase text-[#C8F135] hover:opacity-70"
            >
              {t("orders.explore")}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_MAP[order.status] || STATUS_MAP.pending;
              return (
                <Link
                  key={order.id}
                  to={`/pedido/${order.id}`}
                  className="block bg-[#111] rounded-sm p-6 hover:bg-[#1a1a1a] transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs tracking-widest uppercase text-white/30 mb-1">
                        {t("orders.order")} #{String(order.id).padStart(6, "0")}
                      </p>
                      <p className="text-xs text-white/30">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs tracking-widest uppercase px-2 py-1 rounded-sm ${status.bg} ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {order.items?.slice(0, 4).map((item) => {
                      const itemImage =
                        item.image_url || item.product?.image_url;

                      const itemName =
                        item.product_name || item.product?.name || "Produto";

                      return (
                        <div
                          key={item.id}
                          title={[itemName, item.color, item.size]
                            .filter(Boolean)
                            .join(" · ")}
                          className="w-10 h-10 bg-[#1a1a1a] rounded-sm overflow-hidden flex-shrink-0"
                        >
                          {itemImage ? (
                            <img
                              src={itemImage}
                              alt={itemName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10 text-[9px]">
                              VHX
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-white/30">
                      {order.items?.length}{" "}
                      {order.items?.length === 1
                        ? t("orders.items")
                        : t("orders.items_plural")}
                    </p>
                    <p
                      style={{ fontFamily: '"Bebas Neue",sans-serif' }}
                      className="text-xl tracking-wider text-[#C8F135]"
                    >
                      R$ {Number(order.total).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
