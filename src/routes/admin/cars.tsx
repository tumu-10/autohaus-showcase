import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { CarForm } from "@/components/admin/CarForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCars } from "@/hooks/useCars";
import { formatPrice } from "@/lib/site";
import { AVAILABILITIES, deleteCar, updateCar, createCar, type Car } from "@/services/carsService";

export const Route = createFileRoute("/admin/cars")({
  component: AdminCars,
});

const PAGE_SIZE = 5;

function AdminCars() {
  const cars = useCars();
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("All");
  const [page, setPage] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Car | undefined>();
  const [deleting, setDeleting] = useState<Car | null>(null);

  const filtered = useMemo(() => cars.filter((car) => {
    const term = query.trim().toLowerCase();
    return (!term || `${car.name} ${car.model} ${car.manufacturer} ${car.manufacturingYear}`.toLowerCase().includes(term))
      && (availability === "All" || car.availability === availability);
  }), [cars, query, availability]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  function openCreate() {
    setEditing(undefined);
    setEditorOpen(true);
  }

  function openEdit(car: Car) {
    setEditing(car);
    setEditorOpen(true);
  }

  function save(car: Car) {
    try {
      if (editing) updateCar(car);
      else createCar(car);
      toast.success(editing ? "Car updated." : "Car created.");
      setEditorOpen(false);
    } catch (error) {
      console.error("Unable to save demo car.", error);
      toast.error(error instanceof Error ? error.message : "Unable to save this car.");
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    try {
      deleteCar(deleting.id);
      toast.success("Car deleted.");
      setDeleting(null);
    } catch (error) {
      console.error("Unable to delete demo car.", error);
      toast.error(error instanceof Error ? error.message : "Unable to delete this car.");
    }
  }

  return (
    <>
      <AdminPageTitle
        eyebrow="Inventory"
        title="Cars"
        action={<button type="button" onClick={openCreate} className="eyebrow min-h-11 bg-brand px-5 py-3 text-primary-foreground">Create car</button>}
      />
      <section className="border bg-background p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Search cars</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Search name, model or manufacturer" className="min-h-11 w-full border bg-background px-3 text-base outline-none focus:border-brand" />
          </label>
          <label className="sm:w-52">
            <span className="sr-only">Filter availability</span>
            <select value={availability} onChange={(event) => { setAvailability(event.target.value); setPage(0); }} className="min-h-11 w-full border bg-background px-3 text-base">
              <option value="All">All availability</option>
              {AVAILABILITIES.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-y">
                {["Car", "Year", "Price", "Availability", "Location", "Actions"].map((label) => <th key={label} className="eyebrow px-3 py-3 text-[0.6rem] text-muted-foreground">{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {visible.map((car) => (
                <tr key={car.id} className="border-b transition-colors duration-200 hover:bg-secondary/60">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <img src={car.images[0]} alt="" className="h-12 w-16 shrink-0 object-cover" />
                      <div className="min-w-0">
                        <p className="max-w-56 truncate font-medium">{car.name}</p>
                        <p className="max-w-56 truncate text-muted-foreground">{car.manufacturer} · {car.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">{car.manufacturingYear}</td>
                  <td className="px-3 py-3">{formatPrice(car.price, car.currency)}</td>
                  <td className="px-3 py-3">{car.availability}</td>
                  <td className="px-3 py-3">{car.location}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEdit(car)} className="eyebrow min-h-11 border px-3 py-2">Edit</button>
                      <button type="button" onClick={() => setDeleting(car)} className="eyebrow min-h-11 px-3 py-2 text-destructive">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && <tr><td colSpan={6} className="px-3 py-12 text-center text-muted-foreground">No cars match your search.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-sm text-muted-foreground">{filtered.length} car{filtered.length === 1 ? "" : "s"}</p>
          <div className="flex items-center gap-2">
            <button type="button" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)} className="eyebrow min-h-11 border px-4 py-2 disabled:opacity-40">Previous</button>
            <span className="eyebrow px-2 text-[0.62rem]">{currentPage + 1} / {pageCount}</span>
            <button type="button" disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)} className="eyebrow min-h-11 border px-4 py-2 disabled:opacity-40">Next</button>
          </div>
        </div>
      </section>
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
          <DialogHeader><DialogTitle className="display text-3xl">{editing ? "Update car" : "Create car"}</DialogTitle></DialogHeader>
          <CarForm key={editing?.id ?? "new-car"} {...(editing ? { initial: editing } : {})} onSave={save} onCancel={() => setEditorOpen(false)} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={deleting !== null}
        title="Delete car?"
        description={`This will remove ${deleting?.name ?? "this car"} from this browser's demo inventory and remove its associated hire listing.`}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
