import { useEffect, useMemo, useState } from "react";

import { exchangeRateService } from "../services/exchangeRateService";
import { CurrencyContext } from "./CurrencyContext";

export function CurrencyProvider({ children }) {
  const [usdRate, setUsdRate] = useState(
    exchangeRateService.getCachedRate,
  );
  const [rateError, setRateError] = useState(false);

  useEffect(() => {
    let active = true;

    exchangeRateService
      .getBrlToUsdRate()
      .then((rate) => {
        if (active) {
          setUsdRate(rate);
          setRateError(false);
        }
      })
      .catch(() => {
        if (active) {
          setRateError(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      usdRate,
      rateError,
    }),
    [rateError, usdRate],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}