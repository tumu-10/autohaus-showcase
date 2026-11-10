/** How long each hero photo stays on screen before the next one arrives. */
export const HERO_INTERVAL_MS = 3000;

/** Index of the hero photo shown after one interval has elapsed. */
export function nextSlide(current: number, count: number) {
  if (count <= 0) return 0;
  return (current + 1) % count;
}
