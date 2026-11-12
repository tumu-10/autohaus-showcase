import { useEffect, useState } from "react";
import { VEHICLES, type Vehicle } from "@/lib/site";
import { OPTIONS, type Currency, type VehicleFields } from "@/lib/vehicle-fields";

export type HireListing = { id: string; carId: string; dailyRate: number; currency: Currency; availability: VehicleFields["availability"]; location: VehicleFields["location"]; terms: string };
type Store = { cars: Vehicle[]; hires: HireListing[] };
const STORAGE_KEY = "shamran-demo-inventory-v1";
const AUTH_KEY = "shamran-demo-admin";
const INITIAL: Store = { cars: VEHICLES, hires: VEHICLES.slice(0, 2).map((v, i) => ({ id: `hire-${i}`, carId: v.id, dailyRate: i ? 200000 : 350000, currency: "UGX", availability: "Available", location: "Kampala", terms: "Demonstration rate only. Deposit, insurance, driver options and mileage limits confirmed before hire." })) };
let current = INITIAL;
const listeners = new Set<() => void>();
function notify() { listeners.forEach((fn) => fn()); }
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed.cars) && Array.isArray(parsed.hires) && parsed.cars.every((v: Vehicle) => v.id && v.name && v.currency && Array.isArray(v.images))) current = parsed; }
  } catch { /* An unavailable or corrupted demo store uses the original examples. */ }
}
function persist(next: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  current = next; notify();
}
export function normalizeVehicle(v: Vehicle): Vehicle {
  return { ...v, make: v.manufacturer, year: v.manufacturingYear, priceUGX: v.price, mileageKm: v.mileage, fuel: v.fuelType, body: v.bodyType };
}
export function validateVehicle(v: Vehicle) {
  if (![v.name, v.model, v.manufacturer, v.exteriorColor, v.interiorColor, v.description].every((s) => s.trim())) return "Complete all vehicle fields.";
  if (v.manufacturingYear < 1886 || v.manufacturingYear > 2100 || !Number.isInteger(v.manufacturingYear)) return "Enter a valid manufacturing year.";
  if (![v.price, v.mileage, v.engineCapacity].every((n) => Number.isFinite(n) && n >= 0) || !Number.isInteger(v.seats) || v.seats < 1) return "Enter valid prices, mileage, engine capacity and seats.";
  if (!v.images.length) return "Add at least one vehicle photo.";
  for (const key of Object.keys(OPTIONS) as (keyof typeof OPTIONS)[]) if (!(OPTIONS[key] as readonly string[]).includes(String(v[key]))) return `Choose a valid ${key}.`;
  return "";
}
export const carsService = {
  getCars: () => current.cars,
  saveCar(v: Vehicle) { const error = validateVehicle(v); if (error) throw new Error(error); const car = normalizeVehicle(v); persist({ ...current, cars: current.cars.some((x) => x.id === car.id) ? current.cars.map((x) => x.id === car.id ? car : x) : [...current.cars, car] }); },
  deleteCar(id: string) { persist({ cars: current.cars.filter((x) => x.id !== id), hires: current.hires.filter((x) => x.carId !== id) }); },
  saveHire(h: HireListing) {
    if (!current.cars.some((v) => v.id === h.carId) || !Number.isFinite(h.dailyRate) || h.dailyRate < 0 || !h.terms.trim()) throw new Error("Choose a car, enter a valid rate and complete the terms.");
    persist({ ...current, hires: current.hires.some((x) => x.id === h.id) ? current.hires.map((x) => x.id === h.id ? h : x) : [...current.hires, h] });
  },
  deleteHire(id: string) { persist({ ...current, hires: current.hires.filter((x) => x.id !== id) }); },
};
export function useInventory() {
  const [store, setStore] = useState(INITIAL);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    load(); setStore(current); setReady(true);
    const update = () => setStore(current); listeners.add(update);
    const storage = () => { current = INITIAL; load(); notify(); };
    window.addEventListener("storage", storage);
    return () => { listeners.delete(update); window.removeEventListener("storage", storage); };
  }, []);
  return { ...store, ready };
}
export function demoCredentialsValid(email: string, password: string) { return email.trim().toLowerCase() === "admin@demo.com" && password === "admin123"; }
export function demoLogin(email: string, password: string) { if (!demoCredentialsValid(email, password)) return false; localStorage.setItem(AUTH_KEY, "signed-in"); return true; }
export function demoLoggedIn() { return localStorage.getItem(AUTH_KEY) === "signed-in"; }
export function demoLogout() { localStorage.removeItem(AUTH_KEY); }
export function newVehicle(): Vehicle { return normalizeVehicle({ ...VEHICLES[0], id: crypto.randomUUID(), name: "", model: "", manufacturer: "", description: "", images: [], price: 0, mileage: 0, manufacturingYear: new Date().getFullYear() } as Vehicle); }
