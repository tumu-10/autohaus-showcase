import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatKm, formatPrice, whatsappLink, type Vehicle } from "@/lib/site";
import { CarShare } from "@/components/site/CarShare";

export function DemoBadge() {
  return <span className="eyebrow border border-brand px-2 py-1 text-[0.6rem] text-brand">Demo listing</span>;
}

export function VehicleCard({
  v,
  index,
  onOpen,
  onCompare,
  isCompared = false,
}: {
  v: Vehicle;
  index: number;
  onOpen: () => void;
  onCompare?: () => void;
  isCompared?: boolean;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <button onClick={onOpen} className="block w-full overflow-hidden bg-secondary text-left" aria-label={`View ${v.model} gallery`}>
        <img src={v.images[0]} alt={`${v.manufacturer} ${v.model}`} loading="lazy" width={1536} height={1024} className="aspect-[3/2] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
      </button>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">{v.manufacturingYear} · {v.bodyType}</p>
          <h3 className="display mt-1 text-4xl">{v.name}</h3>
        </div>
        <DemoBadge />
      </div>
      <dl className="mt-4 grid grid-cols-3 border-y py-3 text-sm">
        <div><dt className="eyebrow text-[0.6rem] text-muted-foreground">Gearbox</dt><dd>{v.transmission}</dd></div>
        <div><dt className="eyebrow text-[0.6rem] text-muted-foreground">Fuel</dt><dd>{v.fuelType}</dd></div>
        <div><dt className="eyebrow text-[0.6rem] text-muted-foreground">Mileage</dt><dd>{formatKm(v.mileage)}</dd></div>
      </dl>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-semibold">{formatPrice(v.price, v.currency)}</p>
        <button onClick={onOpen} className="eyebrow inline-flex min-h-11 items-center link-line text-brand">View details →</button>
      </div>
      {onCompare && (
        <button
          type="button"
          onClick={onCompare}
          aria-pressed={isCompared}
          className={`eyebrow mt-3 min-h-11 w-full border px-4 py-3 text-left transition-colors ${isCompared ? "border-brand text-brand" : "hover:border-foreground"}`}
        >
          {isCompared ? "Selected to compare ✓" : "Compare"}
        </button>
      )}
    </motion.article>
  );
}

export function VehicleLightbox({ v, onClose }: { v: Vehicle | null; onClose: () => void }) {
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [v]);
  useEffect(() => {
    if (!v) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((x) => (x + 1) % v.images.length);
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + v.images.length) % v.images.length);
    };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [v, onClose]);

  return (
    <AnimatePresence>
      {v && (
        <motion.div role="dialog" aria-modal="true" aria-label={`${v.name} gallery`} className="fixed inset-0 z-50 overflow-y-auto bg-ink text-ink-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="mx-auto grid min-h-full max-w-[1440px] gap-8 px-5 py-16 md:grid-cols-[1.6fr_1fr] md:px-10">
            <button onClick={onClose} aria-label="Close" className="fixed right-5 top-5 z-10 flex min-h-11 min-w-11 items-center justify-center bg-brand text-primary-foreground"><X /></button>
            <div>
              <div className="relative overflow-hidden bg-secondary">
                <AnimatePresence mode="wait">
                  <motion.img key={i} src={v.images[i]} alt={`${v.name} photo ${i + 1}`} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="aspect-[3/2] w-full object-cover" />
                </AnimatePresence>
                <button aria-label="Previous photo" onClick={() => setI((i - 1 + v.images.length) % v.images.length)} className="absolute left-3 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center bg-background text-foreground"><ChevronLeft /></button>
                <button aria-label="Next photo" onClick={() => setI((i + 1) % v.images.length)} className="absolute right-3 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center bg-background text-foreground"><ChevronRight /></button>
              </div>
              <div className="mt-3 flex gap-3">
                {v.images.map((src, n) => (
                  <button key={n} onClick={() => setI(n)} aria-label={`Show photo ${n + 1}`} className={`w-24 overflow-hidden border-2 ${n === i ? "border-brand" : "border-transparent opacity-60"}`}>
                    <img src={src} alt="" className="aspect-[3/2] w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="eyebrow w-fit border border-brand px-2 py-1 text-[0.6rem] text-brand">Demo listing — not actual stock</span>
              <p className="eyebrow mt-6 opacity-60">{v.manufacturer} · {v.manufacturingYear}</p>
              <h2 className="display mt-2 text-6xl md:text-7xl">{v.name}</h2>
              <p className="mt-4 text-2xl font-semibold">{formatPrice(v.price, v.currency)}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <CarShare car={v} dark />
                <Link to="/cars/$id/details" params={{ id: v.id }} onClick={onClose} className="eyebrow inline-flex min-h-11 items-center bg-brand px-5 py-3 text-primary-foreground transition-colors hover:bg-background hover:text-foreground">
                  View more details
                </Link>
              </div>
              <dl className="mt-8 grid grid-cols-2 gap-y-5 border-t border-ink-foreground/15 pt-6 text-sm">
                {[["Year", v.manufacturingYear], ["Transmission", v.transmission], ["Fuel", v.fuelType], ["Mileage", formatKm(v.mileage)], ["Body", v.bodyType]].map(([k, val]) => (
                  <div key={k as string}><dt className="eyebrow text-[0.6rem] opacity-60">{k}</dt><dd className="mt-1">{val}</dd></div>
                ))}
              </dl>
              <p className="mt-8 opacity-80">{v.description}</p>
              <a href={whatsappLink(`Hello Shamran Motors, I'm interested in the ${v.manufacturingYear} ${v.manufacturer} ${v.model} (${v.id}).`)} target="_blank" rel="noreferrer" className="eyebrow mt-10 bg-brand px-6 py-4 text-center text-primary-foreground transition-colors hover:bg-background hover:text-foreground">
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
