import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { orderService } from "../../services/orderService";

const statusLabels = {
  pending: "Aguardando pagamento",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const statusStyles = {
  pending: "bg-yellow-400/10 text-yellow-300",
  confirmed: "bg-blue-400/10 text-blue-300",
  shipped: "bg-[#C8F135]/10 text-[#C8F135]",
  delivered: "bg-emerald-400/10 text-emerald-300",
  cancelled: "bg-red-400/10 text-red-300",
};

function createDraft(order) {
  return {
    tracking_code: order.tracking_code || "",
    tracking_carrier: order.tracking_carrier || "",
    tracking_url: order.tracking_url || "",
  };
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response =
        await orderService.getAdminOrders();

      setOrders(response.data);

      setDrafts(
        Object.fromEntries(
          response.data.map((order) => [
            order.id,
            createDraft(order),
          ]),
        ),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível carregar os pedidos.",
      );
    } finally {
      setLoading(false);
    }
  }

  function updateDraft(orderId, field, value) {
    setDrafts((current) => ({
      ...current,
      [orderId]: {
        ...current[orderId],
        [field]: value,
      },
    }));
  }

  async function updateOrder(order, status) {
    const draft = drafts[order.id] || {};

    if (
      status === "shipped" &&
      !draft.tracking_code?.trim()
    ) {
      setError(
        "Informe o código de rastreamento antes de marcar o pedido como enviado.",
      );
      setSuccess("");
      return;
    }

    try {
      setSavingId(order.id);
      setError("");
      setSuccess("");

      const payload =
        status === "shipped"
          ? {
              status,
              tracking_code:
                draft.tracking_code,
              tracking_carrier:
                draft.tracking_carrier,
              tracking_url:
                draft.tracking_url,
            }
          : { status };

      const response =
        await orderService.updateAdminOrder(
          order.id,
          payload,
        );

      const updatedOrder = response.data;

      setOrders((current) =>
        current.map((item) =>
          item.id === updatedOrder.id
            ? updatedOrder
            : item,
        ),
      );

      setDrafts((current) => ({
        ...current,
        [updatedOrder.id]:
          createDraft(updatedOrder),
      }));

      setSuccess(
        status === "delivered"
          ? `Pedido #${order.id} marcado como entregue.`
          : `Envio do pedido #${order.id} atualizado.`,
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Não foi possível atualizar o pedido.",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <Link
            to="/admin"
            className="mb-6 inline-flex text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-[#C8F135]"
          >
            ← Voltar ao painel
          </Link>

          <p className="mb-3 text-[11px] uppercase tracking-widest text-[#C8F135]">
            VHX Store
          </p>

          <h1
            style={{
              fontFamily:
                '"Bebas Neue", sans-serif',
            }}
            className="mb-2 text-5xl tracking-widest text-white md:text-6xl"
          >
            Pedidos
          </h1>

          <p className="text-sm text-white/30">
            Acompanhe pedidos, registre envios e
            confirme entregas.
          </p>
        </div>

        {error && (
          <div className="mb-6 border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 border border-[#C8F135]/20 bg-[#C8F135]/10 px-4 py-3 text-sm text-[#C8F135]">
            {success}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-white/40">
            Carregando pedidos...
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-sm bg-[#111] p-10 text-center">
            <p className="text-sm text-white/30">
              Nenhum pedido encontrado.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const draft =
                drafts[order.id] || {};

              const canManageShipping =
                order.status === "confirmed" ||
                order.status === "shipped";

              const canMarkDelivered =
                order.status === "shipped";

              return (
                <article
                  key={order.id}
                  className="rounded-sm bg-[#111] p-6"
                >
                  <div className="mb-6 flex flex-col gap-4 border-b border-white/5 pb-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p
                        style={{
                          fontFamily:
                            '"Bebas Neue", sans-serif',
                        }}
                        className="text-2xl tracking-widest text-white"
                      >
                        Pedido #
                        {String(order.id).padStart(
                          6,
                          "0",
                        )}
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        Criado em{" "}
                        {formatDate(
                          order.createdAt,
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-3 py-1 text-[10px] uppercase tracking-widest ${
                          statusStyles[
                            order.status
                          ] ||
                          "bg-white/10 text-white/50"
                        }`}
                      >
                        {statusLabels[
                          order.status
                        ] || order.status}
                      </span>

                      <span className="text-lg font-medium text-white">
                        {formatCurrency(
                          order.total,
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-8 lg:grid-cols-2">
                    <div>
                      <p className="mb-3 text-[10px] uppercase tracking-widest text-white/30">
                        Cliente
                      </p>

                      <p className="text-sm text-white">
                        {order.User?.name ||
                          "Cliente não identificado"}
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        {order.User?.email || "—"}
                      </p>

                      <p className="mb-3 mt-6 text-[10px] uppercase tracking-widest text-white/30">
                        Itens
                      </p>

                      <div className="space-y-3">
                        {order.items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between gap-4 border-b border-white/5 pb-3 text-sm"
                          >
                            <div>
                              <p className="text-white/80">
                                {item.product_name ||
                                  item.product
                                    ?.name ||
                                  "Produto"}
                              </p>

                              <p className="mt-1 text-xs text-white/30">
                                Quantidade:{" "}
                                {item.quantity}
                                {item.size
                                  ? ` · Tamanho: ${item.size}`
                                  : ""}
                                {item.color
                                  ? ` · Cor: ${item.color}`
                                  : ""}
                              </p>
                            </div>

                            <p className="shrink-0 text-white/60">
                              {formatCurrency(
                                Number(
                                  item.price,
                                ) *
                                  item.quantity,
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-[10px] uppercase tracking-widest text-white/30">
                        Rastreamento
                      </p>

                      {canManageShipping ? (
                        <div className="space-y-4">
                          <label className="block">
                            <span className="mb-2 block text-xs text-white/50">
                              Código de rastreamento *
                            </span>

                            <input
                              type="text"
                              maxLength={120}
                              value={
                                draft.tracking_code ||
                                ""
                              }
                              onChange={(event) =>
                                updateDraft(
                                  order.id,
                                  "tracking_code",
                                  event.target.value,
                                )
                              }
                              className="w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#C8F135]"
                              placeholder="BR123456789BR"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs text-white/50">
                              Transportadora
                            </span>

                            <input
                              type="text"
                              maxLength={100}
                              value={
                                draft.tracking_carrier ||
                                ""
                              }
                              onChange={(event) =>
                                updateDraft(
                                  order.id,
                                  "tracking_carrier",
                                  event.target.value,
                                )
                              }
                              className="w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#C8F135]"
                              placeholder="Correios"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs text-white/50">
                              Link de rastreamento
                            </span>

                            <input
                              type="url"
                              maxLength={500}
                              value={
                                draft.tracking_url ||
                                ""
                              }
                              onChange={(event) =>
                                updateDraft(
                                  order.id,
                                  "tracking_url",
                                  event.target.value,
                                )
                              }
                              className="w-full border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#C8F135]"
                              placeholder="https://..."
                            />
                          </label>

                          <div className="flex flex-wrap gap-3 pt-2">
                            <button
                              type="button"
                              disabled={
                                savingId === order.id
                              }
                              onClick={() =>
                                updateOrder(
                                  order,
                                  "shipped",
                                )
                              }
                              className="bg-[#C8F135] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-black transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {savingId === order.id
                                ? "Salvando..."
                                : order.status ===
                                    "shipped"
                                  ? "Atualizar rastreamento"
                                  : "Marcar como enviado"}
                            </button>

                            {canMarkDelivered && (
                              <button
                                type="button"
                                disabled={
                                  savingId === order.id
                                }
                                onClick={() =>
                                  updateOrder(
                                    order,
                                    "delivered",
                                  )
                                }
                                className="border border-white/15 px-5 py-3 text-xs uppercase tracking-widest text-white transition-colors hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Marcar como entregue
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-white/40">
                          {order.tracking_code ? (
                            <>
                              <p className="text-white/70">
                                {
                                  order.tracking_code
                                }
                              </p>

                              <p className="mt-1">
                                {order.tracking_carrier ||
                                  "Transportadora não informada"}
                              </p>

                              {order.tracking_url && (
                                <a
                                  href={
                                    order.tracking_url
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-3 inline-flex text-xs uppercase tracking-widest text-[#C8F135] hover:underline"
                                >
                                  Abrir rastreamento
                                </a>
                              )}
                            </>
                          ) : (
                            <p>
                              Rastreamento ainda não
                              disponível.
                            </p>
                          )}
                        </div>
                      )}

                      {(order.shipped_at ||
                        order.delivered_at) && (
                        <div className="mt-6 border-t border-white/5 pt-4 text-xs text-white/30">
                          {order.shipped_at && (
                            <p>
                              Enviado em:{" "}
                              {formatDate(
                                order.shipped_at,
                              )}
                            </p>
                          )}

                          {order.delivered_at && (
                            <p className="mt-1">
                              Entregue em:{" "}
                              {formatDate(
                                order.delivered_at,
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}