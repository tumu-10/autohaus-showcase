import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useCars } from "@/hooks/useCars";
import { CompareContext, type CompareContextValue } from "@/hooks/compare-context";
import type { Car } from "@/services/carsService";

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const cars = useCars();

  useEffect(() => {
    setSelectedIds((ids) => ids.filter((id) => cars.some((car) => car.id === id)));
  }, [cars]);

  const value = useMemo<CompareContextValue>(() => ({
    selectedIds,
    selectedCars: selectedIds
      .map((id) => cars.find((car) => car.id === id))
      .filter((car): car is Car => car !== undefined),
    toggle: (id) => {
      if (selectedIds.includes(id)) {
        setSelectedIds((ids) => ids.filter((selectedId) => selectedId !== id));
      } else if (selectedIds.length >= 2) {
        toast.error("Only 2 cars can be compared at a time.");
      } else {
        setSelectedIds((ids) => [...ids, id]);
      }
    },
    clear: () => setSelectedIds([]),
  }), [cars, selectedIds]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}
