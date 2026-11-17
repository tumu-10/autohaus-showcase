import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const PRELOADER_DURATION_MS = 3200;
export const PRELOADER_EXIT_SECONDS = 0.5;
export const PRELOADER_FALLBACK_MS = 5000;
export const HERO_SCAN_DURATION_SECONDS = 0.9;
export const PreloaderContext = createContext(true);
export const useOpeningVisible = () => useContext(PreloaderContext);

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (from: number, to: number, value: number) => {
  const progress = clamp01((value - from) / (to - from));
  return progress * progress * (3 - 2 * progress);
};

export function wheelProgress(elapsedMs: number) {
  return clamp01(elapsedMs / PRELOADER_DURATION_MS);
}

/** Calm, precise roll: the tyre's position is the loading progress. */
export function wheelChoreography(value: number) {
  const progress = clamp01(value);
  const travel = smoothstep(0, 1, progress);
  return { travel, spin: travel * 14, drift: 0, bounce: 0, slip: 0, smoke: 0, speed: travel };
}

export function heroLetterDelay(line: number, letter: number) {
  return line * 0.17 + letter * 0.021;
}

/** One opening sequence per app mount; the full timeline begins when the wheel can draw. */
export function usePreloader() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const signalReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), ready ? PRELOADER_DURATION_MS : PRELOADER_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [ready]);
  return { visible, signalReady };
}
