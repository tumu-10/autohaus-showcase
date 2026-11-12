import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TextPressure } from "@/components/site/TextPressure";
import { VehicleCard, VehicleLightbox } from "@/components/site/VehicleGallery";
import { useCars } from "@/hooks/useCars";
import { useCompare } from "@/hooks/compare-context";
import { formatPrice } from "@/lib/site";
import type { Car } from "@/services/carsService";

const BODIES = ["All", "SUV", "Sedan", "Hatchback", "Pickup", "Van", "Coupe", "Wagon"] as const;

export const Route = createFileRoute("/cars/")({
  validateSearch: (s: Record<string, unknown>): { body?: string | undefined } => ({
    body: typeof s["body"] === "string" ? s["body"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Our Cars | Shamran Motors" },
      { name: "description", content: "Browse vehicles at Shamran Motors, Kampala: photos, specifications and prices in UGX." },
      { property: "og:title", content: "Our Cars. | Shamran Motors" },
      { property: "og:description", content: "Browse the Shamran Motors vehicle showroom." },
    ],
  }),
  component: Cars,
});

function filterVehicles(list: Car[], q: string, body: string, fuel: string, gearbox: string) {
  const term = q.trim().toLowerCase();
  return list.filter(
    (car) =>
      (!term || `${car.manufacturer} ${car.name} ${car.model} ${car.manufacturingYear}`.toLowerCase().includes(term)) &&
      (body === "All" || car.bodyType === body) &&
      (fuel === "All" || car.fuelType === fuel) &&
      (gearbox === "All" || car.transmission === gearbox),
  );
}

function Cars() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const cars = useCars();
  const { selectedIds, selectedCars, toggle, clear } = useCompare();
  const [q, setQ] = useState("");
  const [body, setBody] = useState<string>(search.body ?? "All");
  const [fuel, setFuel] = useState("All");
  const [gearbox, setGearbox] = useState("All");
  const [open, setOpen] = useState<Car | null>(null);
  const list = useMemo(() => filterVehicles(cars, q, body, fuel, gearbox), [cars, q, body, fuel, gearbox]);

  const select = "min-h-11 border bg-background px-3 py-3 text-sm";
  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 pb-12 pt-32 md:px-10 md:pt-40">
        <p className="eyebrow text-brand">The showroom</p>
        <div className="mt-4 h-[clamp(3.75rem,15vw,5.5rem)] w-full md:h-[10vw] md:max-h-36 md:w-1/2 md:max-w-[720px]">
          <TextPressure text="Our cars" textColor="var(--foreground)" minFontSize={28} className="display" />
        </div>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">All listings below are demonstration content until current inventory is supplied.</p>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
        <div className="sticky top-16 z-20 flex flex-col gap-4 border-y bg-background py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {BODIES.map((item) => (
              <button key={item} onClick={() => setBody(item)} className={`eyebrow min-h-11 px-4 py-2 transition-colors ${body === item ? "bg-ink text-ink-foreground" : "border hover:border-foreground"}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 border px-3 sm:flex-none">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input aria-label="Search vehicles" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search make, model, year" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none sm:w-48" />
            </label>
            <select aria-label="Fuel" value={fuel} onChange={(e) => setFuel(e.target.value)} className={select}>
              {["All", "Petrol", "Diesel", "Hybrid", "Electric"].map((item) => <option key={item} value={item}>{item === "All" ? "Any fuel" : item}</option>)}
            </select>
            <select aria-label="Transmission" value={gearbox} onChange={(e) => setGearbox(e.target.value)} className={select}>
              {["All", "Automatic", "Manual"].map((item) => <option key={item} value={item}>{item === "All" ? "Any gearbox" : item}</option>)}
            </select>
          </div>
        </div>
        <p className="eyebrow mt-6 text-muted-foreground">{list.length} vehicle{list.length === 1 ? "" : "s"}</p>
        <div className="mt-8 grid gap-x-10 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((car, index) => (
              <VehicleCard
                key={car.id}
                v={car}
                index={index}
                onOpen={() => setOpen(car)}
                onCompare={() => toggle(car.id)}
                isCompared={selectedIds.includes(car.id)}
              />
            ))}
          </AnimatePresence>
        </div>
        {list.length === 0 && (
          <div className="py-20 text-center">
            <p className="display text-5xl">No matches</p>
            <button onClick={() => { setQ(""); setBody("All"); setFuel("All"); setGearbox("All"); }} className="eyebrow link-line mt-4 text-brand">Clear filters</button>
          </div>
        )}
      </section>
      <VehicleLightbox v={open} onClose={() => setOpen(null)} />
      {selectedCars.length > 0 && (
        <aside aria-label="Selected cars for comparison" className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 shadow-lg backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center md:px-10">
            <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
              <span className="eyebrow shrink-0 text-muted-foreground">Compare ({selectedCars.length}/2)</span>
              {selectedCars.map((car) => (
                <div key={car.id} className="flex min-w-0 shrink-0 items-center gap-2">
                  <img src={car.images[0]} alt="" className="h-10 w-14 object-cover" />
                  <span className="max-w-32 truncate text-sm">{car.name}</span>
                </div>
              ))}
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={clear} className="eyebrow min-h-11 border px-4 py-3">Clear</button>
              <button
                type="button"
                disabled={selectedCars.length !== 2}
                onClick={() => navigate({ to: "/cars/compare", search: { ids: selectedIds.join(",") } })}
                className="eyebrow min-h-11 bg-brand px-5 py-3 text-primary-foreground transition-colors enabled:hover:bg-ink disabled:cursor-not-allowed disabled:opacity-45"
              >
                Compare
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
