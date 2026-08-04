import { useRegion } from "../../context/useRegion";

export default function LanguageToggle() {
  const { regionCode, changeRegion } = useRegion();
  const isBR = regionCode === "BR";

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Selecionar região"
    >
      <button
        type="button"
        onClick={() => changeRegion("BR")}
        aria-pressed={isBR}
        className={`flex items-center gap-1 text-[11px] tracking-wider transition-all duration-200 ${
          isBR
            ? "text-brand-white"
            : "text-brand-muted hover:text-brand-white"
        }`}
      >
        <span aria-hidden="true">🇧🇷</span>
        <span>BR</span>
      </button>

      <span aria-hidden="true" className="text-[10px] text-brand-border">
        |
      </span>

      <button
        type="button"
        onClick={() => changeRegion("US")}
        aria-pressed={!isBR}
        className={`flex items-center gap-1 text-[11px] tracking-wider transition-all duration-200 ${
          !isBR
            ? "text-brand-white"
            : "text-brand-muted hover:text-brand-white"
        }`}
      >
        <span aria-hidden="true">🇺🇸</span>
        <span>US</span>
      </button>
    </div>
  );
}