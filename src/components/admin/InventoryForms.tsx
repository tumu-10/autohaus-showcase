import { useState } from "react";
import { toast } from "sonner";
import { Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { FIELD_GROUPS, LABELS, NUMERIC_FIELDS, OPTIONS } from "@/lib/vehicle-fields";
import type { Vehicle } from "@/lib/site";
import { carsService, type HireListing } from "@/services/carsService";
const inputClass = "min-h-11 w-full min-w-0 border bg-background px-3 py-2 text-sm outline-none focus:border-brand";
export function CarForm({ initial, onClose }: { initial: Vehicle; onClose: () => void }) {
  const [v, setV] = useState(initial); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function upload(files: FileList | null) {
    if (!files) return;
    setBusy(true);
    try {
      const images = await Promise.all(Array.from(files).map((file) => new Promise<string>((resolve, reject) => {
        if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { reject(new Error("Choose image files smaller than 5 MB.")); return; }
        const reader = new FileReader(); reader.onload = () => { const image = new Image(); image.onerror = () => reject(new Error("Could not read this image.")); image.onload = () => { const canvas = document.createElement("canvas"); const ratio = Math.min(1, 1200 / image.width); canvas.width = image.width * ratio; canvas.height = image.height * ratio; const ctx = canvas.getContext("2d"); if (!ctx) { reject(new Error("Image preview unavailable.")); return; } ctx.drawImage(image, 0, 0, canvas.width, canvas.height); resolve(canvas.toDataURL("image/jpeg", 0.8)); }; image.src = String(reader.result); }; reader.onerror = () => reject(new Error("Could not upload the image.")); reader.readAsDataURL(file);
      })));
      setV((car) => ({ ...car, images: [...car.images, ...images] })); setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Image upload failed."); } finally { setBusy(false); }
  }
  function save(e: React.FormEvent) { e.preventDefault(); try { carsService.saveCar(v); toast.success("Car saved"); onClose(); } catch (e) { setError(e instanceof Error ? e.message : "Could not save. Browser storage may be full."); } }
  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="max-h-[90svh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto"><DialogTitle className="display text-3xl text-brand">{initial.name ? "Edit car" : "Create car"}</DialogTitle><DialogDescription>Demo listing</DialogDescription>
    <form onSubmit={save} className="space-y-8">{FIELD_GROUPS.map((g) => <fieldset key={g.title} className="border-t pt-4"><legend className="eyebrow px-2">{g.title}</legend><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{g.fields.map((key) => {
      const choices = key in OPTIONS ? OPTIONS[key as keyof typeof OPTIONS] : undefined;
      return <label key={key} className={key === "description" ? "sm:col-span-2 lg:col-span-3" : "min-w-0"}><span className="mb-2 block text-sm">{LABELS[key]}</span>
        {choices ? <select required className={inputClass} value={String(v[key])} onChange={(e) => setV({ ...v, [key]: e.target.value })}>{choices.map((choice) => <option key={choice}>{choice}</option>)}</select> : key === "description" ? <textarea required rows={4} className={inputClass} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} /> : <input required type={NUMERIC_FIELDS.has(key) ? "number" : "text"} min={key === "seats" ? 1 : key === "manufacturingYear" ? 1886 : 0} max={key === "manufacturingYear" ? 2100 : undefined} step={key === "price" ? "0.01" : "1"} className={inputClass} value={String(v[key])} onChange={(e) => setV({ ...v, [key]: NUMERIC_FIELDS.has(key) ? Number(e.target.value) : e.target.value })} />}
      </label>;
    })}</div></fieldset>)}
    <fieldset className="border-t pt-4"><legend className="eyebrow">Vehicle photos</legend><label className="mt-3 flex min-h-11 cursor-pointer items-center gap-2 border p-3"><Upload className="h-4 w-4 shrink-0" /><span className="text-sm">Add photos</span><input aria-label="Upload vehicle photos" type="file" accept="image/*" multiple className="min-w-0 max-w-full text-xs" onChange={(e) => { void upload(e.target.files); e.target.value = ""; }} /></label><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{v.images.map((src, index) => <div className="relative" key={`${index}-${src.slice(0, 30)}`}><img src={src} alt={`Vehicle preview ${index + 1}`} className="aspect-[3/2] w-full object-cover" /><Button type="button" size="icon" variant="destructive" className="absolute right-0 top-0" aria-label={`Remove photo ${index + 1}`} onClick={() => setV({ ...v, images: v.images.filter((_, i) => i !== index) })}><X /></Button></div>)}</div></fieldset>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy}><Save />{busy ? "Uploading…" : initial.name ? "Update car" : "Create car"}</Button></div>
    </form></DialogContent></Dialog>;
}
export function HireForm({ initial, cars, onClose }: { initial: HireListing; cars: Vehicle[]; onClose: () => void }) {
  const [h, setH] = useState(initial); const [error, setError] = useState("");
  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="max-h-[90svh] w-[calc(100%-2rem)] overflow-y-auto"><DialogTitle className="display text-3xl text-brand">Car hire listing</DialogTitle><DialogDescription>Demo hire terms and rates</DialogDescription><form className="space-y-4" onSubmit={(e) => { e.preventDefault(); try { carsService.saveHire(h); toast.success("Hire listing saved"); onClose(); } catch (e) { setError(e instanceof Error ? e.message : "Could not save listing."); } }}>
    <label className="block text-sm">Car<select required className={`${inputClass} mt-2`} value={h.carId} onChange={(e) => setH({ ...h, carId: e.target.value })}><option value="">Select a car</option>{cars.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</select></label>
    <label className="block text-sm">Daily rate<input required type="number" min="0" step="0.01" className={`${inputClass} mt-2`} value={h.dailyRate} onChange={(e) => setH({ ...h, dailyRate: Number(e.target.value) })} /></label>
    {(["currency", "availability", "location"] as const).map((key) => <label className="block text-sm" key={key}>{LABELS[key]}<select className={`${inputClass} mt-2`} value={h[key]} onChange={(e) => setH({ ...h, [key]: e.target.value })}>{OPTIONS[key].map((val) => <option key={val}>{val}</option>)}</select></label>)}
    <label className="block text-sm">Terms<textarea required rows={4} className={`${inputClass} mt-2`} value={h.terms} onChange={(e) => setH({ ...h, terms: e.target.value })} /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit"><Save />Save listing</Button></div>
  </form></DialogContent></Dialog>;
}
