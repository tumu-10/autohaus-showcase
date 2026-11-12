import { useState, type FormEvent } from "react";
import {
  CURRENCIES,
  LOCATIONS,
  type Car,
  type Currency,
  type HireListing,
  type Location,
} from "@/services/carsService";

type Props = {
  initial?: HireListing;
  cars: Car[];
  onSave: (listing: HireListing) => void;
  onCancel: () => void;
};

export function HireForm({ initial, cars, onSave, onCancel }: Props) {
  const [listing, setListing] = useState<HireListing>(() => initial ?? {
    id: "",
    carId: cars[0]?.id ?? "",
    dailyRate: 0,
    currency: "UGX",
    availability: "Available",
    location: "Kampala",
    terms: "",
  });
  const set = <K extends keyof HireListing>(key: K, value: HireListing[K]) => setListing((current) => ({ ...current, [key]: value }));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ ...listing, id: initial?.id ?? `demo-hire-${Date.now()}` });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block">
        <span id="hire-car-label" className="eyebrow mb-2 block text-[0.6rem]">Car</span>
        <select aria-labelledby="hire-car-label" required disabled={cars.length === 0} value={listing.carId} onChange={(event) => set("carId", event.target.value)} className="min-h-11 w-full border bg-background px-3 text-base disabled:opacity-50">
          {cars.map((car) => <option key={car.id} value={car.id}>{car.manufacturer} {car.name} · {car.model}</option>)}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow mb-2 block text-[0.6rem]">Daily rate</span>
          <input required min={0} step={1} type="number" value={listing.dailyRate} onChange={(event) => set("dailyRate", Number(event.target.value))} className="min-h-11 w-full border bg-background px-3 text-base" />
        </label>
        <label className="block">
          <span id="hire-currency-label" className="eyebrow mb-2 block text-[0.6rem]">Currency</span>
          <select aria-labelledby="hire-currency-label" value={listing.currency} onChange={(event) => set("currency", event.target.value as Currency)} className="min-h-11 w-full border bg-background px-3 text-base">
            {CURRENCIES.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
          </select>
        </label>
        <label className="block">
          <span id="hire-availability-label" className="eyebrow mb-2 block text-[0.6rem]">Availability</span>
          <select aria-labelledby="hire-availability-label" value={listing.availability} onChange={(event) => set("availability", event.target.value as HireListing["availability"])} className="min-h-11 w-full border bg-background px-3 text-base">
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </label>
        <label className="block">
          <span id="hire-location-label" className="eyebrow mb-2 block text-[0.6rem]">Location</span>
          <select aria-labelledby="hire-location-label" value={listing.location} onChange={(event) => set("location", event.target.value as Location)} className="min-h-11 w-full border bg-background px-3 text-base">
            {LOCATIONS.map((location) => <option key={location} value={location}>{location}</option>)}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="eyebrow mb-2 block text-[0.6rem]">Terms</span>
        <textarea required value={listing.terms} onChange={(event) => set("terms", event.target.value)} rows={4} className="w-full border bg-background p-3 text-base" />
      </label>
      <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
        <button type="button" onClick={onCancel} className="eyebrow min-h-11 border px-5 py-3">Cancel</button>
        <button type="submit" disabled={cars.length === 0} className="eyebrow min-h-11 bg-brand px-5 py-3 text-primary-foreground disabled:opacity-50">Save listing</button>
      </div>
    </form>
  );
}
