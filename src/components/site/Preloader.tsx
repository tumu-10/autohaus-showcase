import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PRELOADER_DURATION_MS, PRELOADER_EXIT_SECONDS, useOpeningVisible } from "@/lib/preloader";
import { SportWheel } from "./SportWheel";

export function Preloader() {
  const visible = useOpeningVisible();
  const reducedMotion = useReducedMotion();
  const duration = PRELOADER_DURATION_MS / 1000;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading Shamran Motors"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink text-ink-foreground"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : PRELOADER_EXIT_SECONDS, ease: "easeInOut" }}
        >
          <div className="w-80 max-w-[calc(100vw-4rem)]">
            <motion.img
              src="/logo-transparent.png"
              alt="Shamran Motors"
              width={757}
              height={392}
              className="h-auto w-full object-contain"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 14, scale: reducedMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="relative mt-7 h-[88px]" aria-hidden="true">
              <div className="absolute inset-x-0 bottom-1 h-px bg-ink-foreground/20" />
              <motion.div
                className="absolute inset-x-0 bottom-1 h-px origin-left bg-brand"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reducedMotion ? 0 : duration, ease: "linear" }}
              />
              <SportWheel reducedMotion={Boolean(reducedMotion)} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}