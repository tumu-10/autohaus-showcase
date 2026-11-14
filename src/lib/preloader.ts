import { useEffect, useState } from "react";

export const PRELOADER_DURATION_MS = 2200;
export const PRELOADER_EXIT_SECONDS = 0.45;

/** One opening sequence per app mount; navigation never restarts it. */
export function usePreloader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), PRELOADER_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);
  return visible;
}