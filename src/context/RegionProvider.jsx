import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import i18n from "../i18n";
import { RegionContext } from "./RegionContext";

const REGION_STORAGE_KEY = "vhx_region";

const REGIONS = {
  BR: {
    code: "BR",
    language: "pt",
    locale: "pt-BR",
    currency: "BRL",
    measurementSystem: "metric",
  },
  US: {
    code: "US",
    language: "en",
    locale: "en-US",
    currency: "USD",
    measurementSystem: "imperial",
  },
};

function detectInitialRegion() {
  const storedRegion = localStorage.getItem(REGION_STORAGE_KEY);

  if (storedRegion && REGIONS[storedRegion]) {
    return storedRegion;
  }

  const browserLocale = navigator.language || "";
  return browserLocale.toLowerCase().startsWith("pt") ? "BR" : "US";
}

export function RegionProvider({ children }) {
  const [regionCode, setRegionCode] = useState(detectInitialRegion);
  const region = REGIONS[regionCode];

  useEffect(() => {
    localStorage.setItem(REGION_STORAGE_KEY, regionCode);
    i18n.changeLanguage(region.language);
    document.documentElement.lang = region.language;
  }, [region.language, regionCode]);

  const changeRegion = useCallback((nextRegionCode) => {
    if (REGIONS[nextRegionCode]) {
      setRegionCode(nextRegionCode);
    }
  }, []);

  const value = useMemo(
    () => ({
      region,
      regionCode,
      changeRegion,
    }),
    [changeRegion, region, regionCode],
  );

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
}