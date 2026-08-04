const EXCHANGE_RATE_URL =
  "https://api.frankfurter.dev/v2/rate/BRL/USD";

const CACHE_KEY = "vhx_brl_usd_rate";
const CACHE_DURATION = 12 * 60 * 60 * 1000;

function readCachedRate() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));

    if (
      Number.isFinite(cached?.rate) &&
      cached.rate > 0 &&
      Date.now() - cached.savedAt < CACHE_DURATION
    ) {
      return cached.rate;
    }
  } catch {
    localStorage.removeItem(CACHE_KEY);
  }

  return null;
}

function saveCachedRate(rate) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      rate,
      savedAt: Date.now(),
    }),
  );
}

export const exchangeRateService = {
  getCachedRate: readCachedRate,

  async getBrlToUsdRate() {
    const cachedRate = readCachedRate();

    if (cachedRate) {
      return cachedRate;
    }

    const response = await fetch(EXCHANGE_RATE_URL);

    if (!response.ok) {
      throw new Error("Não foi possível obter a cotação BRL/USD");
    }

    const data = await response.json();
    const rate = Number(data.rate);

    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("A API retornou uma cotação inválida");
    }

    saveCachedRate(rate);

    return rate;
  },
};