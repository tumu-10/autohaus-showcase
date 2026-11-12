import hero from "@/assets/hero-suv.jpg";
import sedan from "@/assets/car-sedan.jpg";
import coupe from "@/assets/car-coupe.jpg";
import pickup from "@/assets/car-pickup.jpg";

export const CURRENCIES = ["UGX", "USD", "KES", "JPY", "KRW"] as const;
export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"] as const;
export const TRANSMISSIONS = ["Automatic", "Manual"] as const;
export const BODY_TYPES = ["SUV", "Sedan", "Hatchback", "Pickup", "Van", "Coupe", "Wagon"] as const;
export const DRIVE_TYPES = ["FWD", "RWD", "AWD", "4WD"] as const;
export const CONDITIONS = ["New", "Foreign Used", "Locally Used"] as const;
export const AVAILABILITIES = ["Available", "Reserved", "Sold", "Hired"] as const;
export const LOCATIONS = ["Kampala", "Mombasa", "Tokyo", "Seoul"] as const;

export type Currency = (typeof CURRENCIES)[number];
export type FuelType = (typeof FUEL_TYPES)[number];
export type Transmission = (typeof TRANSMISSIONS)[number];
export type BodyType = (typeof BODY_TYPES)[number];
export type DriveType = (typeof DRIVE_TYPES)[number];
export type Condition = (typeof CONDITIONS)[number];
export type Availability = (typeof AVAILABILITIES)[number];
export type Location = (typeof LOCATIONS)[number];

export type Car = {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  manufacturingYear: number;
  price: number;
  currency: Currency;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  engineCapacity: number;
  bodyType: BodyType;
  exteriorColor: string;
  interiorColor: string;
  seats: number;
  driveType: DriveType;
  condition: Condition;
  availability: Availability;
  location: Location;
  description: string;
  images: string[];
};

export type HireListing = {
  id: string;
  carId: string;
  dailyRate: number;
  currency: Currency;
  availability: "Available" | "Unavailable";
  location: Location;
  terms: string;
};

export const INITIAL_CARS: Car[] = [
  {
    id: "demo-suv",
    name: "Luxury SUV",
    model: "Range Rover Sport",
    manufacturer: "Demo Motors",
    manufacturingYear: 2022,
    price: 385_000_000,
    currency: "UGX",
    mileage: 28_000,
    fuelType: "Diesel",
    transmission: "Automatic",
    engineCapacity: 3000,
    bodyType: "SUV",
    exteriorColor: "Black",
    interiorColor: "Tan",
    seats: 5,
    driveType: "AWD",
    condition: "Foreign Used",
    availability: "Available",
    location: "Kampala",
    description: "Sample listing showing how a full-size luxury SUV would be presented. Details are placeholders.",
    images: [hero, sedan, pickup],
  },
  {
    id: "demo-sedan",
    name: "Executive Sedan",
    model: "Camry",
    manufacturer: "Demo Motors",
    manufacturingYear: 2021,
    price: 165_000_000,
    currency: "UGX",
    mileage: 41_500,
    fuelType: "Petrol",
    transmission: "Automatic",
    engineCapacity: 2500,
    bodyType: "Sedan",
    exteriorColor: "Silver",
    interiorColor: "Black",
    seats: 5,
    driveType: "FWD",
    condition: "Locally Used",
    availability: "Hired",
    location: "Kampala",
    description: "Sample listing for an executive saloon. Specifications are illustrative only.",
    images: [sedan, hero, coupe],
  },
  {
    id: "demo-coupe",
    name: "Sports Coupe",
    model: "86",
    manufacturer: "Demo Motors",
    manufacturingYear: 2023,
    price: 210_000_000,
    currency: "UGX",
    mileage: 9_800,
    fuelType: "Petrol",
    transmission: "Manual",
    engineCapacity: 2000,
    bodyType: "Coupe",
    exteriorColor: "Red",
    interiorColor: "Black",
    seats: 4,
    driveType: "RWD",
    condition: "New",
    availability: "Reserved",
    location: "Mombasa",
    description: "Sample listing for a two-door sports coupe. Figures are placeholders.",
    images: [coupe, sedan, hero],
  },
  {
    id: "demo-pickup",
    name: "Double Cab 4x4",
    model: "Hilux",
    manufacturer: "Demo Motors",
    manufacturingYear: 2020,
    price: 145_000_000,
    currency: "UGX",
    mileage: 66_000,
    fuelType: "Diesel",
    transmission: "Manual",
    engineCapacity: 2800,
    bodyType: "Pickup",
    exteriorColor: "White",
    interiorColor: "Gray",
    seats: 5,
    driveType: "4WD",
    condition: "Foreign Used",
    availability: "Sold",
    location: "Kampala",
    description: "Sample listing for a double-cab pickup. Details are for demonstration.",
    images: [pickup, hero, sedan],
  },
];

export const INITIAL_HIRE_LISTINGS: HireListing[] = [
  {
    id: "hire-demo-suv",
    carId: "demo-suv",
    dailyRate: 450_000,
    currency: "UGX",
    availability: "Available",
    location: "Kampala",
    terms: "Rates and terms are confirmed directly before booking.",
  },
];

const CARS_KEY = "shamran-demo-cars-v1";
const HIRE_KEY = "shamran-demo-hire-v1";
const listeners = new Set<() => void>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCar(value: unknown): value is Car {
  return isRecord(value)
    && typeof value["id"] === "string"
    && typeof value["name"] === "string"
    && typeof value["model"] === "string"
    && typeof value["manufacturer"] === "string"
    && typeof value["manufacturingYear"] === "number"
    && typeof value["price"] === "number"
    && typeof value["currency"] === "string"
    && typeof value["mileage"] === "number"
    && typeof value["fuelType"] === "string"
    && typeof value["transmission"] === "string"
    && typeof value["engineCapacity"] === "number"
    && typeof value["bodyType"] === "string"
    && typeof value["exteriorColor"] === "string"
    && typeof value["interiorColor"] === "string"
    && typeof value["seats"] === "number"
    && typeof value["driveType"] === "string"
    && typeof value["condition"] === "string"
    && typeof value["availability"] === "string"
    && typeof value["location"] === "string"
    && typeof value["description"] === "string"
    && Array.isArray(value["images"])
    && value["images"].every((image) => typeof image === "string");
}

function isHireListing(value: unknown): value is HireListing {
  return isRecord(value)
    && typeof value["id"] === "string"
    && typeof value["carId"] === "string"
    && typeof value["dailyRate"] === "number"
    && typeof value["currency"] === "string"
    && (value["availability"] === "Available" || value["availability"] === "Unavailable")
    && typeof value["location"] === "string"
    && typeof value["terms"] === "string";
}

function readList<T>(key: string, initial: T[], isItem: (value: unknown) => value is T): T[] {
  if (typeof window === "undefined") return initial;
  const stored = window.localStorage.getItem(key);
  if (stored === null) return initial;

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed) || !parsed.every(isItem)) {
    throw new Error(`Saved demo data for "${key}" is invalid.`);
  }
  return parsed;
}

function writeList<T>(key: string, items: T[]) {
  if (typeof window === "undefined") throw new Error("Demo data can only be changed in a browser.");
  window.localStorage.setItem(key, JSON.stringify(items));
  listeners.forEach((listener) => listener());
}

export function listCars() {
  return readList(CARS_KEY, INITIAL_CARS, isCar);
}

export function listHireListings() {
  return readList(HIRE_KEY, INITIAL_HIRE_LISTINGS, isHireListing);
}

export function subscribeToDemoData(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === CARS_KEY || event.key === HIRE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function createCar(car: Car) {
  const cars = listCars();
  if (cars.some((item) => item.id === car.id)) throw new Error("A car with this ID already exists.");
  writeList(CARS_KEY, [...cars, car]);
}

export function updateCar(car: Car) {
  const cars = listCars();
  if (!cars.some((item) => item.id === car.id)) throw new Error("The car could not be found.");
  writeList(CARS_KEY, cars.map((item) => item.id === car.id ? car : item));
}

export function deleteCar(id: string) {
  const cars = listCars();
  if (!cars.some((item) => item.id === id)) throw new Error("The car could not be found.");
  writeList(CARS_KEY, cars.filter((item) => item.id !== id));
  writeList(HIRE_KEY, listHireListings().filter((listing) => listing.carId !== id));
}

export function createHireListing(listing: HireListing) {
  const listings = listHireListings();
  if (listings.some((item) => item.id === listing.id)) throw new Error("A hire listing with this ID already exists.");
  writeList(HIRE_KEY, [...listings, listing]);
}

export function updateHireListing(listing: HireListing) {
  const listings = listHireListings();
  if (!listings.some((item) => item.id === listing.id)) throw new Error("The hire listing could not be found.");
  writeList(HIRE_KEY, listings.map((item) => item.id === listing.id ? listing : item));
}

export function deleteHireListing(id: string) {
  const listings = listHireListings();
  if (!listings.some((item) => item.id === id)) throw new Error("The hire listing could not be found.");
  writeList(HIRE_KEY, listings.filter((item) => item.id !== id));
}
