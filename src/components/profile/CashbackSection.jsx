import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { cashbackService } from "../../services/cashbackService";

const TRANSACTION_LABELS = {
  earned: "cashback.transaction_earned",
  redeemed: "cashback.transaction_redeemed",
  reversed: "cashback.transaction_reversed",
  adjustment: "cashback.transaction_adjustment",
  expiration: "cashback.transaction_expiration",
};

const POSITIVE_TRANSACTION_TYPES = ["earned", "reversed", "adjustment"];

function parseMoney(value) {
  const amount = Number(value);

  return Number.isFinite(amount) ? amount : 0;
}

export default function CashbackSection() {
  const { t, i18n } = useTranslation();

  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const locale = i18n.resolvedLanguage === "en" ? "en-US" : "pt-BR";

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  });

  const formatMoney = (value) => currencyFormatter.format(parseMoney(value));

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const loadCashback = useCallback(
    async (page = 1) => {
      try {
        const [balanceResponse, transactionsResponse] = await Promise.all([
          cashbackService.getBalance(),
          cashbackService.getTransactions(page, 10),
        ]);

        setBalance(balanceResponse.data);
        setTransactions(transactionsResponse.data.transactions ?? []);
        setPagination(
          transactionsResponse.data.pagination ?? {
            page,
            limit: 10,
            totalItems: 0,
            totalPages: 0,
          },
        );
      } catch {
        setError(t("cashback.error_load"));
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    Promise.all([
      cashbackService.getBalance(),
      cashbackService.getTransactions(1, 10),
    ]);
  }, [t]);

  if (loading && !balance) {
    return (
      <section className="bg-[#111] rounded-sm p-6 mb-6">
        <p className="text-white/30 text-xs tracking-widest uppercase animate-pulse">
          {t("cashback.loading")}
        </p>
      </section>
    );
  }

  function handleLoadCashback(page) {
    setLoading(true);
    setError(null);
    loadCashback(page);
  }

  if (error && !balance) {
    return (
      <section className="bg-[#111] rounded-sm p-6 mb-6">
        <p className="text-red-400 text-sm mb-4">{error}</p>

        <button
          type="button"
          onClick={() => handleLoadCashback(1)}
          className="text-[#C8F135] text-xs tracking-widest uppercase"
        >
          {t("common.try_again")}
        </button>
      </section>
    );
  }

  const totalPages = pagination.totalPages || 0;
  const currentPage = pagination.page || 1;

  return (
    <section className="bg-[#111] rounded-sm p-6 mb-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
            }}
            className="text-2xl tracking-widest text-white"
          >
            {t("cashback.title")}
          </p>

          <p className="text-white/30 text-xs mt-1">{t("cashback.subtitle")}</p>
        </div>

        <span className="bg-[#C8F135] text-black text-[10px] font-bold tracking-widest uppercase px-2 py-1">
          5%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-[#0a0a0a] border border-[#C8F135]/30 p-4 rounded-sm">
          <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">
            {t("cashback.available")}
          </p>

          <p
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
            }}
            className="text-3xl tracking-wider text-[#C8F135]"
          >
            {formatMoney(balance?.available)}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-sm">
          <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">
            {t("cashback.pending")}
          </p>

          <p
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
            }}
            className="text-3xl tracking-wider text-white"
          >
            {formatMoney(balance?.pending)}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-sm">
          <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">
            {t("cashback.expiring")}
          </p>

          <p
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
            }}
            className="text-3xl tracking-wider text-white"
          >
            {formatMoney(balance?.expiringSoon)}
          </p>

          {balance?.expiringSoonDate && (
            <p className="text-[10px] text-white/30 mt-1">
              {t("cashback.expires_on", {
                date: formatDate(balance.expiringSoonDate),
              })}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
          }}
          className="text-xl tracking-widest text-white"
        >
          {t("cashback.statement")}
        </p>

        {loading && (
          <span className="text-[10px] tracking-widest uppercase text-white/20 animate-pulse">
            {t("common.loading")}
          </span>
        )}
      </div>

      {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

      {!transactions.length ? (
        <div className="border border-dashed border-white/10 px-4 py-8 text-center">
          <p className="text-white/30 text-sm">{t("cashback.empty")}</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {transactions.map((transaction) => {
            const positive = POSITIVE_TRANSACTION_TYPES.includes(
              transaction.type,
            );

            const amount = formatMoney(transaction.amount);

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <p className="text-sm text-white/70">
                    {t(
                      TRANSACTION_LABELS[transaction.type] ??
                        "cashback.transaction_unknown",
                    )}
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                    <span className="text-[10px] text-white/25">
                      {formatDate(transaction.createdAt)}
                    </span>

                    {transaction.order_id && (
                      <span className="text-[10px] text-white/25">
                        {t("cashback.order_number", {
                          id: transaction.order_id,
                        })}
                      </span>
                    )}

                    {transaction.expires_at &&
                      transaction.status === "available" && (
                        <span className="text-[10px] text-white/25">
                          {t("cashback.valid_until", {
                            date: formatDate(transaction.expires_at),
                          })}
                        </span>
                      )}
                  </div>
                </div>

                <p
                  className={`flex-shrink-0 text-sm font-medium ${
                    positive ? "text-[#C8F135]" : "text-red-400"
                  }`}
                >
                  {positive ? "+" : "−"}
                  {amount}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-4">
          <button
            type="button"
            disabled={currentPage <= 1 || loading}
            onClick={() => handleLoadCashback(currentPage - 1)}
            className="text-xs tracking-widest uppercase text-white/50 hover:text-[#C8F135] disabled:opacity-20 disabled:pointer-events-none transition-colors"
          >
            {t("cashback.previous")}
          </button>

          <span className="text-[10px] tracking-widest uppercase text-white/30">
            {t("cashback.page", {
              current: currentPage,
              total: totalPages,
            })}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages || loading}
            onClick={() => handleLoadCashback(currentPage + 1)}
            className="text-xs tracking-widest uppercase text-white/50 hover:text-[#C8F135] disabled:opacity-20 disabled:pointer-events-none transition-colors"
          >
            {t("cashback.next")}
          </button>
        </div>
      )}
    </section>
  );
}
