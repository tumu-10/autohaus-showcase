import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PRELOADER_DURATION_MS, PRELOADER_EXIT_SECONDS, useOpeningVisible, wheelChoreography } from "@/lib/preloader";
import { SportWheel } from "./SportWheel";

export function Preloader({ onReady }: { onReady: () => void }) {
  const visible = useOpeningVisible();
  const reducedMotion = useReducedMotion();
  const [wheelReady, setWheelReady] = useState(false);
  const [percent, setPercent] = useState(0);
  const handleReady = useCallback(() => {
    setWheelReady(true);
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (!wheelReady) return;
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      const el = document.querySelector<HTMLElement>("[data-wheel-progress]");
      const fromWheel = Number(el?.dataset["wheelProgress"]);
      const p = Number.isFinite(fromWheel) && el ? fromWheel : Math.min(1, (performance.now() - start) / PRELOADER_DURATION_MS);
      setPercent(Math.round(wheelChoreography(p).travel * 100));
      if (p < 1 || performance.now() - start < PRELOADER_DURATION_MS) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [wheelReady]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading Shamran Motors"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ink text-ink-foreground"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : PRELOADER_EXIT_SECONDS, ease: "easeInOut" }}
        >
          <div className="w-[min(36rem,calc(100vw-2rem))]">
            <motion.img
              src="/logo-transparent.png"
              alt="Shamran Motors"
              width={757}
              height={392}
              className="mx-auto h-auto w-60 max-w-[calc(100vw-4rem)] object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }}
            />
            <div className="relative mt-2 h-40 sm:h-44" aria-hidden="true">
              <SportWheel reducedMotion={Boolean(reducedMotion)} onReady={handleReady} />
            </div>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-ink-foreground/50" aria-hidden="true">
              <span>Bugolobi · Kampala</span>
              <span className="tabular-nums text-ink-foreground">{String(percent).padStart(3, "0")}<span className="text-brand">%</span></span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
