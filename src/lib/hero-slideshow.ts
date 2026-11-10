import { useEffect, useState } from "react";

/** How long each hero photo stays on screen before the next one arrives. */
export const HERO_INTERVAL_MS = 3000;

/** Index of the hero photo shown after one interval has elapsed. */
export function nextSlide(current: number, count: number) {
  if (count <= 0) return 0;
  return (current + 1) % count;
}

/** Cycles through the hero photos, advancing every HERO_INTERVAL_MS. */
export function useHeroSlideshow(count: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => nextSlide(i, count)), HERO_INTERVAL_MS);
    return () => clearInterval(t);
  }, [count]);

  return [index, setIndex] as const;
}
