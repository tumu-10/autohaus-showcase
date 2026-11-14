import { useEffect, useState } from "react";
import { createContext, useContext } from "react";

export const PRELOADER_DURATION_MS = 2200;
export const PRELOADER_EXIT_SECONDS = 0.45;
export const PreloaderContext = createContext(true);
export const useOpeningVisible = () => useContext(PreloaderContext);

export function wheelProgress(elapsedMs: number) {
  return Math.max(0, Math.min(1, elapsedMs / PRELOADER_DURATION_MS));
}

export function heroLetterDelay(line: number, letter: number) {
  return line * 0.16 + letter * 0.025;
}

/** One opening sequence per app mount; navigation never restarts it. */
export function usePreloader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), PRELOADER_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);
  return visible;
}