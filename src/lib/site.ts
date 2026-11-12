import hero from "@/assets/hero-suv.jpg";
import defender from "@/assets/hero-defender.jpg";
import g63 from "@/assets/hero-g63.jpg";
import g63White from "@/assets/hero-g63.jpg";
import sedan from "@/assets/car-sedan.jpg";
import coupe from "@/assets/car-coupe.jpg";
import pickup from "@/assets/car-pickup.jpg";
export { INITIAL_CARS as VEHICLES } from "@/services/carsService";
export type { Car as Vehicle } from "@/services/carsService";

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

export const IMAGES = { hero, defender, g63, sedan, coupe, pickup };

/** Hero slideshow — shown one after another on the home page. */
export const HERO_SLIDES = [
  { id: "range-rover", src: hero, label: "Range Rover", alt: "Black luxury SUV in a white studio" },
  { id: "defender", src: defender, label: "Defender 2026", alt: "Army green Land Rover Defender 2026 in a white studio" },
  { id: "brabus-g63", src: g63, label: "Brabus G63", alt: "Red Brabus-tuned Mercedes G63 in a white studio" },
] as const;

export const formatPrice = (n: number, currency: string) => `${currency} ${n.toLocaleString("en-US")}`;
export const formatUGX = (n: number) => formatPrice(n, "UGX");
export const formatKm = (n: number) => n.toLocaleString("en-US") + " km";
