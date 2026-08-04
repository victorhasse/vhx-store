import { useContext } from "react";

import { CurrencyContext } from "./CurrencyContext";
import { useRegion } from "./useRegion";

export function useCurrency() {
  const context = useContext(CurrencyContext);
  const { region } = useRegion();

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }
  function formatBrl(valueInBrl) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(valueInBrl || 0));
  }
  function formatPrice(valueInBrl) {
    const brlValue = Number(valueInBrl || 0);
    const canConvertToUsd =
      region.currency === "USD" && Number.isFinite(context.usdRate);

    const displayedValue = canConvertToUsd
      ? brlValue * context.usdRate
      : brlValue;

    const currency = canConvertToUsd ? "USD" : "BRL";
    const locale = canConvertToUsd ? "en-US" : "pt-BR";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(displayedValue);
  }

  return {
    formatPrice,
    formatBrl,
    usdRate: context.usdRate,
    rateError: context.rateError,
    isUsdEstimate:
      region.currency === "USD" && Number.isFinite(context.usdRate),
  };
}
