export const OPTIONS = {
  currency: ["UGX", "USD", "KES", "JPY", "KRW"],
  fuelType: ["Petrol", "Diesel", "Hybrid", "Electric"],
  transmission: ["Automatic", "Manual"],
  bodyType: ["SUV", "Sedan", "Hatchback", "Pickup", "Van", "Coupe", "Wagon"],
  driveType: ["FWD", "RWD", "AWD", "4WD"],
  condition: ["New", "Foreign Used", "Locally Used"],
  availability: ["Available", "Reserved", "Sold", "Hired"],
  location: ["Kampala", "Mombasa", "Tokyo", "Seoul"],
} as const;
export type Currency = typeof OPTIONS.currency[number];
export type VehicleFields = {
  name: string; model: string; manufacturer: string; manufacturingYear: number;
  price: number; currency: Currency; mileage: number;
  fuelType: typeof OPTIONS.fuelType[number]; transmission: typeof OPTIONS.transmission[number];
  engineCapacity: number; bodyType: typeof OPTIONS.bodyType[number]; exteriorColor: string;
  interiorColor: string; seats: number; driveType: typeof OPTIONS.driveType[number];
  condition: typeof OPTIONS.condition[number]; availability: typeof OPTIONS.availability[number];
  location: typeof OPTIONS.location[number]; description: string;
};
export const FIELD_GROUPS: { title: string; fields: (keyof VehicleFields)[] }[] = [
  { title: "Overview", fields: ["name", "model", "manufacturer", "manufacturingYear", "price", "currency", "mileage"] },
  { title: "Specifications", fields: ["fuelType", "transmission", "engineCapacity", "bodyType", "seats", "driveType"] },
  { title: "Appearance", fields: ["exteriorColor", "interiorColor", "condition"] },
  { title: "Availability and Location", fields: ["availability", "location"] },
  { title: "Description", fields: ["description"] },
];
export const LABELS: Record<keyof VehicleFields, string> = {
  name: "Vehicle name", model: "Model", manufacturer: "Manufacturer", manufacturingYear: "Manufacturing year",
  price: "Price", currency: "Currency", mileage: "Mileage (km)", fuelType: "Fuel type", transmission: "Transmission",
  engineCapacity: "Engine capacity (cc)", bodyType: "Body type", exteriorColor: "Exterior color", interiorColor: "Interior color",
  seats: "Seats", driveType: "Drive type", condition: "Condition", availability: "Availability", location: "Location", description: "Description",
};
export const NUMERIC_FIELDS = new Set<keyof VehicleFields>(["manufacturingYear", "price", "mileage", "engineCapacity", "seats"]);
export function formatMoney(price: number, currency: Currency) { return `${currency} ${price.toLocaleString("en-US")}`; }
export function fieldValue(v: VehicleFields, key: keyof VehicleFields) {
  if (key === "price") return formatMoney(v.price, v.currency);
  if (key === "mileage") return `${v.mileage.toLocaleString("en-US")} km`;
  if (key === "engineCapacity") return v.engineCapacity === 0 && v.fuelType === "Electric" ? "Electric" : `${v.engineCapacity.toLocaleString("en-US")} cc`;
  return String(v[key]);
}
export function toggleComparison(ids: string[], id: string) {
  if (ids.includes(id)) return { ids: ids.filter((x) => x !== id), limited: false };
  if (ids.length >= 2) return { ids, limited: true };
  return { ids: [...ids, id], limited: false };
}
export function parseCompareIds(value: string) { return [...new Set(value.split(",").filter(Boolean))].slice(0, 2); }
export function pageHead(title: string, description: string) {
  return { meta: [{ title: `${title} | Shamran Motors` }, { name: "description", content: description }, { property: "og:title", content: `${title} | Shamran Motors` }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
}
