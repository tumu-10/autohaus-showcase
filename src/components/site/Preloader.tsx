import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PRELOADER_DURATION_MS, PRELOADER_EXIT_SECONDS, usePreloader } from "@/lib/preloader";

function Tyre() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="var(--ink)" stroke="var(--muted-foreground)" strokeWidth="2" />
      <circle cx="32" cy="32" r="25" fill="none" stroke="var(--ink-foreground)" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="2 4" />
      <circle cx="32" cy="32" r="19" fill="var(--ink-foreground)" />
      <circle cx="32" cy="32" r="15" fill="var(--ink)" />
      {Array.from({ length: 5 }, (_, index) => (
        <path key={index} d="M29 29 L28 15 L33 15 L35 29 Z" fill="var(--ink-foreground)" transform={`rotate(${index * 72} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="6" fill="var(--brand)" />
      <circle cx="32" cy="32" r="2" fill="var(--ink-foreground)" />
    </svg>
  );
}

export function Preloader() {
  const visible = usePreloader();
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
            <div className="relative mt-10 h-14" aria-hidden="true">
              <div className="absolute inset-x-0 bottom-1 h-px bg-ink-foreground/20" />
              <motion.div
                className="absolute inset-x-0 bottom-1 h-px origin-left bg-brand"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reducedMotion ? 0 : duration, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 right-12"
                initial={{ x: 0 }}
                animate={{ x: reducedMotion ? 0 : "100%" }}
                transition={{ duration: reducedMotion ? 0 : duration, ease: "linear" }}
              >
                <motion.div
                  className="absolute bottom-1 left-0 h-12 w-12"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: reducedMotion ? 0 : 650 }}
                  transition={{ duration: reducedMotion ? 0 : duration, ease: "linear" }}
                >
                  <Tyre />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}