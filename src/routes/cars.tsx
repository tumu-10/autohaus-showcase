import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/site/Chrome";
import { VehicleCard, VehicleLightbox } from "@/components/site/VehicleGallery";
import { VEHICLES, type Vehicle } from "@/lib/site";

const BODIES = ["All", "SUV", "Sedan", "Coupe", "Pickup"] as const;

export const Route = createFileRoute("/cars")({
  validateSearch: (s: Record<string, unknown>): { body?: string | undefined } => ({
    body: typeof s["body"] === "string" ? (s["body"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Our Cars — Shamran Motors" },
      { name: "description", content: "Browse vehicles at Shamran Motors, Kampala: photos, specifications and prices in UGX." },
      { property: "og:title", content: "Our Cars — Shamran Motors" },
      { property: "og:description", content: "Browse the Shamran Motors vehicle showroom." },
    ],
  }),
  component: Cars,
});

export function filterVehicles(list: Vehicle[], q: string, body: string, fuel: string, gearbox: string) {
  const term = q.trim().toLowerCase();
  return list.filter(
    (v) =>
      (!term || `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(term)) &&
      (body === "All" || v.body === body) &&
      (fuel === "All" || v.fuel === fuel) &&
      (gearbox === "All" || v.transmission === gearbox),
  );
}

function Cars() {
  const search = Route.useSearch();
  const [q, setQ] = useState("");
  const [body, setBody] = useState<string>(search.body ?? "All");
  const [fuel, setFuel] = useState("All");
  const [gearbox, setGearbox] = useState("All");
  const [open, setOpen] = useState<Vehicle | null>(null);
  const list = useMemo(() => filterVehicles(VEHICLES, q, body, fuel, gearbox), [q, body, fuel, gearbox]);

  const select = "border bg-background px-3 py-3 text-sm";
  return (
    <>
      <PageHero eyebrow="The showroom" title="Our cars" intro="All listings below are demonstration content until current inventory is supplied." />
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
        <div className="sticky top-16 z-20 flex flex-col gap-4 border-y bg-background py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {BODIES.map((b) => (
              <button key={b} onClick={() => setBody(b)} className={`eyebrow px-4 py-2 transition-colors ${body === b ? "bg-ink text-ink-foreground" : "border hover:border-foreground"}`}>
                {b}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 border px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input aria-label="Search vehicles" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search make, model, year" className="w-48 bg-transparent py-3 text-sm outline-none" />
            </label>
            <select aria-label="Fuel" value={fuel} onChange={(e) => setFuel(e.target.value)} className={select}>
              {["All", "Petrol", "Diesel", "Hybrid"].map((f) => <option key={f} value={f}>{f === "All" ? "Any fuel" : f}</option>)}
            </select>
            <select aria-label="Transmission" value={gearbox} onChange={(e) => setGearbox(e.target.value)} className={select}>
              {["All", "Automatic", "Manual"].map((f) => <option key={f} value={f}>{f === "All" ? "Any gearbox" : f}</option>)}
            </select>
          </div>
        </div>
        <p className="eyebrow mt-6 text-muted-foreground">{list.length} vehicle{list.length === 1 ? "" : "s"}</p>
        <div className="mt-8 grid gap-x-10 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((v, i) => <VehicleCard key={v.id} v={v} index={i} onOpen={() => setOpen(v)} />)}
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
    </>
  );
}
