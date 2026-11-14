import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { HireForm } from "@/components/admin/HireForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCars, useHireListings } from "@/hooks/useCars";
import { formatPrice } from "@/lib/site";
import {
  createHireListing,
  deleteHireListing,
  updateHireListing,
  type HireListing,
} from "@/services/carsService";

export const Route = createFileRoute("/admin/hire")({
  head: () => ({ meta: [
    { title: "Manage Hire Listings | Shamran Motors" },
    { name: "description", content: "Manage demonstration car hire listings for Shamran Motors." },
    { property: "og:title", content: "Manage Hire Listings | Shamran Motors" },
    { property: "og:description", content: "Manage demonstration car hire listings for Shamran Motors." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AdminHire,
});

function AdminHire() {
  const cars = useCars();
  const listings = useHireListings();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<HireListing | undefined>();
  const [deleting, setDeleting] = useState<HireListing | null>(null);

  function openCreate() {
    setEditing(undefined);
    setEditorOpen(true);
  }

  function openEdit(listing: HireListing) {
    setEditing(listing);
    setEditorOpen(true);
  }

  function save(listing: HireListing) {
    try {
      if (editing) updateHireListing(listing);
      else createHireListing(listing);
      toast.success(editing ? "Hire listing updated." : "Hire listing created.");
      setEditorOpen(false);
    } catch (error) {
      console.error("Unable to save demo hire listing.", error);
      toast.error(error instanceof Error ? error.message : "Unable to save this listing.");
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    try {
      deleteHireListing(deleting.id);
      toast.success("Hire listing deleted.");
      setDeleting(null);
    } catch (error) {
      console.error("Unable to delete demo hire listing.", error);
      toast.error(error instanceof Error ? error.message : "Unable to delete this listing.");
    }
  }

  return (
    <>
      <AdminPageTitle
        eyebrow="Rental inventory"
        title="Car Hire"
        action={<button type="button" onClick={openCreate} disabled={cars.length === 0} className="eyebrow min-h-11 bg-brand px-5 py-3 text-primary-foreground disabled:opacity-50">Create listing</button>}
      />
      <section className="border bg-background p-4 sm:p-6">
        <p className="mb-5 text-sm text-muted-foreground">{listings.length} hire listing{listings.length === 1 ? "" : "s"}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-y">
                {["Car", "Daily rate", "Availability", "Location", "Terms", "Actions"].map((label) => <th key={label} className="eyebrow px-3 py-3 text-[0.6rem] text-muted-foreground">{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => {
                const car = cars.find((item) => item.id === listing.carId);
                return (
                  <tr key={listing.id} className="border-b transition-colors duration-200 hover:bg-secondary/60">
                    <td className="max-w-52 px-3 py-4">
                      <p className="truncate font-medium">{car ? `${car.manufacturer} ${car.name}` : "Car removed"}</p>
                      <p className="truncate text-muted-foreground">{car?.model ?? listing.carId}</p>
                    </td>
                    <td className="px-3 py-4">{formatPrice(listing.dailyRate, listing.currency)}</td>
                    <td className="px-3 py-4">{listing.availability}</td>
                    <td className="px-3 py-4">{listing.location}</td>
                    <td className="max-w-56 px-3 py-4"><p className="line-clamp-2">{listing.terms}</p></td>
                    <td className="px-3 py-4">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit(listing)} className="eyebrow min-h-11 border px-3 py-2">Edit</button>
                        <button type="button" onClick={() => setDeleting(listing)} className="eyebrow min-h-11 px-3 py-2 text-destructive">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {listings.length === 0 && <tr><td colSpan={6} className="px-3 py-12 text-center text-muted-foreground">No hire listings have been added.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle className="display text-3xl">{editing ? "Update hire listing" : "Create hire listing"}</DialogTitle></DialogHeader>
          <HireForm key={editing?.id ?? "new-hire"} {...(editing ? { initial: editing } : {})} cars={cars} onSave={save} onCancel={() => setEditorOpen(false)} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={deleting !== null}
        title="Delete hire listing?"
        description="This removes the hire listing from this browser's demo data."
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
