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

/** Shared mechanical timeline: burnout, dragged launch, drift, then a fast exit. */
export function wheelChoreography(value: number) {
  const progress = clamp01(value);
  const launch = smoothstep(0.01, 0.2, progress);
  const drive = smoothstep(0.16, 0.84, progress);
  const exit = smoothstep(0.82, 1, progress);
  const settled = smoothstep(0.58, 0.94, progress);

  return {
    travel: drive + exit * 0.24,
    spin: launch * 15 + drive * 38 + exit * 14,
    drift: Math.sin(smoothstep(0.2, 0.82, progress) * Math.PI) * (1 - exit),
    bounce: Math.sin(progress * 92) * 0.018 * smoothstep(0.12, 0.24, progress) * (1 - settled),
    slip: 1 - settled,
    smoke: smoothstep(0.025, 0.14, progress) * (1 - smoothstep(0.8, 1, progress)),
    speed: smoothstep(0.14, 0.42, progress),
  };
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
