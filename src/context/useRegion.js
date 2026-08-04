import { useContext } from "react";
import { RegionContext } from "./RegionContext";

export function useRegion() {
  const context = useContext(RegionContext);

  if (!context) {
    throw new Error("useRegion must be used inside RegionProvider");
  }

  return context;
}