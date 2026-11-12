import { useState } from "react";
import { toast } from "sonner";
import type { Car } from "@/services/carsService";

export function CarShare({ car, dark = false }: { car: Car; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const url = () => new URL(`/cars/${encodeURIComponent(car.id)}/details`, window.location.origin).href;
  const message = (link: string) => `${car.name} - ${link}`;

  async function share() {
    const link = url();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: car.name, text: message(link), url: link });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        toast.error("Sharing is unavailable. Choose a share option instead.");
        setOpen(true);
      }
      return;
    }
    setOpen((isOpen) => !isOpen);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url());
      toast.success("Car link copied.");
      setOpen(false);
    } catch {
      toast.error("Unable to copy the link on this device.");
    }
  }

  const controlClass = dark
    ? "border border-ink-foreground/35 text-ink-foreground hover:bg-ink-foreground hover:text-ink"
    : "border border-foreground/35 text-foreground hover:bg-ink hover:text-ink-foreground";

  return (
    <div className="relative inline-block">
      <button type="button" aria-expanded={open} onClick={share} className={`eyebrow inline-flex min-h-11 items-center gap-2 px-4 py-3 transition-colors ${controlClass}`}>
        Share
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[60] mt-2 w-52 border bg-background p-2 text-foreground shadow-lg">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message(url()))}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="eyebrow flex min-h-11 items-center px-3 py-2 transition-colors hover:bg-secondary"
          >
            WhatsApp
          </a>
          <button type="button" onClick={copyLink} className="eyebrow min-h-11 w-full px-3 py-2 text-left transition-colors hover:bg-secondary">
            Copy link
          </button>
        </div>
      )}
    </div>
  );
}
