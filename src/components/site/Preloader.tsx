import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PRELOADER_DURATION_MS, PRELOADER_EXIT_SECONDS, useOpeningVisible } from "@/lib/preloader";
import { SportWheel } from "./SportWheel";

export function Preloader() {
  const visible = useOpeningVisible();
  const reducedMotion = useReducedMotion();
  const startedAt = useRef(0);
  const duration = PRELOADER_DURATION_MS / 1000;

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
            <div className="relative mx-auto w-72 max-w-[calc(100vw-4rem)]">
              <motion.img
                src="/logo-transparent.png"
                alt="Shamran Motors"
                width={757}
                height={392}
                className="relative z-10 h-auto w-full object-contain"
                initial={{ opacity: 0, y: 18, scale: 0.94, filter: "blur(9px)" }}
                animate={{ opacity: 1, y: 0, scale: reducedMotion ? 1 : [0.94, 1, 1.018, 1], filter: "blur(0px)" }}
                transition={{ duration: reducedMotion ? 0 : 1.15, times: [0, 0.62, 0.84, 1], ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-ink-foreground/70 to-transparent motion-reduce:hidden"
                style={{
                  maskImage: "url('/logo-transparent.png')",
                  maskSize: "100% 100%",
                  WebkitMaskImage: "url('/logo-transparent.png')",
                  WebkitMaskSize: "100% 100%",
                }}
                initial={{ x: "-115%", opacity: 0 }}
                animate={{ x: ["-115%", "115%"], opacity: [0, 0.85, 0] }}
                transition={{ duration: reducedMotion ? 0 : 1.05, delay: reducedMotion ? 0 : 0.2, ease: "easeInOut" }}
              />
              <motion.img
                aria-hidden="true"
                src="/logo-transparent.png"
                alt=""
                width={757}
                height={392}
                className="absolute inset-0 z-30 h-auto w-full object-contain motion-reduce:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.65, 0], scale: [1, 1.012, 1] }}
                transition={{ duration: reducedMotion ? 0 : 0.38, delay: reducedMotion ? 0 : duration * 0.74, ease: "easeOut" }}
              />
            </div>

            <div className="relative mt-1 h-44 sm:h-48" aria-hidden="true">
              <div className="absolute inset-x-[8%] bottom-4 h-10 rounded-full bg-brand/10 blur-2xl" />
              <div className="absolute inset-x-0 bottom-[23px] h-px bg-ink-foreground/15" />
              <motion.div
                className="absolute inset-x-0 bottom-[23px] z-20 h-px origin-left bg-brand"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reducedMotion ? 0 : duration, ease: "linear" }}
              />
              <SportWheel reducedMotion={Boolean(reducedMotion)} startedAt={startedAt.current} />
              <motion.div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[22px] z-30 h-[3px] origin-left bg-brand/30 blur-sm motion-reduce:hidden"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 0.7, 1], opacity: [0, 0.8, 0] }}
                transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : duration * 0.72, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
