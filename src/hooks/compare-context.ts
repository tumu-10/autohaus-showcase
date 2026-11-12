import { createContext, useContext } from "react";
import type { Car } from "@/services/carsService";

export type CompareContextValue = {
  selectedIds: string[];
  selectedCars: Car[];
  toggle: (id: string) => void;
  clear: () => void;
};

export const CompareContext = createContext<CompareContextValue | null>(null);

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within a CompareProvider.");
  return context;
}
