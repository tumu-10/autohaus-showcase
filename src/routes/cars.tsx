import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Search, X, Scale } from "lucide-react";
import { PageHero } from "@/components/site/Chrome";
import { VehicleCard, VehicleLightbox } from "@/components/site/VehicleGallery";
import { type Vehicle } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toggleComparison } from "@/lib/vehicle-fields";
import { useInventory } from "@/services/carsService";

const BODIES = ["All", "SUV", "Sedan", "Coupe", "Pickup"] as const;

export const Route = createFileRoute("/cars")({
  validateSearch: (s: Record<string, unknown>): { body?: string; view?: string } => ({
    view: typeof s.view === "string" ? s.view : undefined,
    body: typeof s["body"] === "string" ? (s["body"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Our Cars | Shamran Motors" },
      { name: "description", content: "Browse vehicles at Shamran Motors, Kampala: photos, specifications and prices in UGX." },
      { property: "og:title", content: "Our Cars | Shamran Motors" },
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
  const { cars } = useInventory();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [body, setBody] = useState<string>(search.body ?? "All");
  const [fuel, setFuel] = useState("All");
  const [gearbox, setGearbox] = useState("All");
  const [open, setOpen] = useState<Vehicle | null>(null);
  const list = useMemo(() => filterVehicles(cars, q, body, fuel, gearbox), [cars, q, body, fuel, gearbox]);

  useEffect(() => { setOpen(cars.find((v) => v.id === search.view) ?? null); }, [cars, search.view]);
  useEffect(() => { setSelected((ids) => ids.filter((id) => cars.some((v) => v.id === id))); }, [cars]);
  const compared = selected.map((id) => cars.find((v) => v.id === id)).filter((v) => v !== undefined);
  function toggle(id: string) { const next = toggleComparison(selected, id); if (next.limited) toast.error("Only 2 cars can be compared at once."); else setSelected(next.ids); }
  function close() { setOpen(null); void navigate({ to: "/cars", search: { body: search.body }, replace: true }); }
  const select = "border bg-background px-3 py-3 text-sm";
  return (
    <>
      <PageHero eyebrow="The showroom" title="Our cars" intro="All listings below are demonstration content until current inventory is supplied." />
      <section className="mx-auto max-w-[1440px] px-5 pb-52 md:px-10">
        <div className="relative z-20 grid gap-4 border-y bg-background py-4 xl:grid-cols-[auto_minmax(0,1fr)]">
          <div className="flex flex-wrap gap-2">
            {BODIES.map((b) => (
              <Button variant="ghost" key={b} onClick={() => setBody(b)} className={`eyebrow px-4 py-2 transition-colors ${body === b ? "bg-ink text-ink-foreground" : "border hover:border-foreground"}`}>
                {b}
              </Button>
            ))}
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-2 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="col-span-2 flex min-w-0 items-center gap-2 border px-3 xl:col-span-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input aria-label="Search vehicles" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search make, model, year" className="w-full min-w-0 bg-transparent py-3 text-sm outline-none" />
            </label>
            <select aria-label="Fuel" value={fuel} onChange={(e) => setFuel(e.target.value)} className={select}>
              {["All", "Petrol", "Diesel", "Hybrid", "Electric"].map((f) => <option key={f} value={f}>{f === "All" ? "Any fuel" : f}</option>)}
            </select>
            <select aria-label="Transmission" value={gearbox} onChange={(e) => setGearbox(e.target.value)} className={select}>
              {["All", "Automatic", "Manual"].map((f) => <option key={f} value={f}>{f === "All" ? "Any gearbox" : f}</option>)}
            </select>
          </div>
        </div>
        <p className="eyebrow mt-6 text-muted-foreground">{list.length} vehicle{list.length === 1 ? "" : "s"}</p>
        <div className="mt-8 grid gap-x-10 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((v, i) => <VehicleCard key={v.id} v={v} index={i} onOpen={() => setOpen(v)} compared={selected.includes(v.id)} onCompare={() => toggle(v.id)} />)}
          </AnimatePresence>
        </div>
        {list.length === 0 && (
          <div className="py-20 text-center">
            <p className="display text-5xl">No matches</p>
            <Button variant="link" onClick={() => { setQ(""); setBody("All"); setFuel("All"); setGearbox("All"); }} className="eyebrow link-line mt-4 text-brand">Clear filters</Button>
          </div>
        )}
      </section>
      {compared.length > 0 && <aside aria-label="Selected cars" className="fixed inset-x-0 bottom-0 z-40 border-t bg-background shadow-lg"><div className="mx-auto grid max-w-[1440px] gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] md:px-10">
        <div className="grid min-w-0 grid-cols-2 gap-2">{compared.map((v) => <div key={v.id} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1"><div className="flex min-w-0 items-center gap-2"><img src={v.images[0]} alt="" className="hidden h-12 w-20 shrink-0 object-cover sm:block" /><span className="truncate text-sm">{v.name}</span></div><Button variant="ghost" size="icon" aria-label={`Remove ${v.name} from comparison`} onClick={() => toggle(v.id)}><X /></Button></div>)}</div>
        <div className="flex gap-2"><Button variant="outline" onClick={() => setSelected([])}>Clear</Button><Button disabled={compared.length !== 2} onClick={() => void navigate({ to: "/cars/compare", search: { ids: selected.join(",") } })}><Scale />Compare</Button></div>
      </div></aside>}
      <VehicleLightbox v={open} onClose={close} />
    </>
  );
}
