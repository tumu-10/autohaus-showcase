import hero from "@/assets/hero-suv.jpg";
import defender from "@/assets/hero-defender.jpg";
import g63 from "@/assets/hero-g63.jpg";
import sedan from "@/assets/car-sedan.jpg";
import coupe from "@/assets/car-coupe.jpg";
import pickup from "@/assets/car-pickup.jpg";

export const SITE = {
  name: "Shamran Motors",
  location: "Bugolobi, Kampala Modernity",
  email: "mohammedshamsi17@gmail.com",
  instagram: "https://www.instagram.com/shamran_motors/",
  tiktok: "https://www.tiktok.com/@shamranmotors",
  whatsappNumber: "256706126660",
};

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message);
  return SITE.whatsappNumber
    ? `https://wa.me/${SITE.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  priceUGX: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid";
  mileageKm: number;
  body: "SUV" | "Sedan" | "Coupe" | "Pickup";
  description: string;
  images: string[];
};

/** DEMONSTRATION listings only — not actual stock. Replace with real inventory. */
export const VEHICLES: Vehicle[] = [
  { id: "demo-suv", make: "Demo", model: "Luxury SUV", year: 2022, priceUGX: 385_000_000, transmission: "Automatic", fuel: "Diesel", mileageKm: 28_000, body: "SUV", description: "Sample listing showing how a full-size luxury SUV would be presented. Details are placeholders.", images: [hero, sedan, pickup] },
  { id: "demo-sedan", make: "Demo", model: "Executive Sedan", year: 2021, priceUGX: 165_000_000, transmission: "Automatic", fuel: "Petrol", mileageKm: 41_500, body: "Sedan", description: "Sample listing for an executive saloon. Specifications are illustrative only.", images: [sedan, hero, coupe] },
  { id: "demo-coupe", make: "Demo", model: "Sports Coupe", year: 2023, priceUGX: 210_000_000, transmission: "Manual", fuel: "Petrol", mileageKm: 9_800, body: "Coupe", description: "Sample listing for a two-door sports coupe. Figures are placeholders.", images: [coupe, sedan, hero] },
  { id: "demo-pickup", make: "Demo", model: "Double Cab 4x4", year: 2020, priceUGX: 145_000_000, transmission: "Manual", fuel: "Diesel", mileageKm: 66_000, body: "Pickup", description: "Sample listing for a double-cab pickup. Details are for demonstration.", images: [pickup, hero, sedan] },
];

export const IMAGES = { hero, defender, g63, sedan, coupe, pickup };

/** Hero slideshow — shown one after another on the home page. */
export const HERO_SLIDES = [
  { id: "range-rover", src: hero, label: "Range Rover", alt: "Black luxury SUV in a white studio" },
  { id: "defender", src: defender, label: "Defender 2026", alt: "Army green Land Rover Defender 2026 in a white studio" },
  { id: "brabus-g63", src: g63, label: "Brabus G63", alt: "Red Brabus-tuned Mercedes G63 in a white studio" },
] as const;

export const formatUGX = (n: number) => "UGX " + n.toLocaleString("en-US");
export const formatKm = (n: number) => n.toLocaleString("en-US") + " km";
