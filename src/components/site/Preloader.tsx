import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PRELOADER_EXIT_SECONDS, useOpeningVisible } from "@/lib/preloader";

const ease = [0.65, 0, 0.35, 1] as const;

/** Headlight reveal: lamps switch on, beams sweep over the logo, then the screen splits open. */
export function Preloader({ onReady }: { onReady: () => void }) {
  const visible = useOpeningVisible();
  const rm = Boolean(useReducedMotion());
  useEffect(() => onReady(), [onReady]);
  const t = (d: number) => (rm ? 0 : d);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div role="status" aria-label="Loading Shamran Motors" className="fixed inset-0 z-50 overflow-hidden" initial={false} exit={{ opacity: 1 }} transition={{ duration: t(PRELOADER_EXIT_SECONDS + 0.4) }}>
          {/* split doors */}
          {(["left", "right"] as const).map((side) => (
            <motion.div
              key={side}
              aria-hidden="true"
              className={`absolute inset-y-0 w-1/2 bg-ink ${side === "left" ? "left-0" : "right-0"}`}
              initial={false}
              exit={{ x: side === "left" ? "-100%" : "100%" }}
              transition={{ duration: t(0.9), ease }}
            />
          ))}

          <motion.div className="absolute inset-0" initial={false} exit={{ opacity: 0 }} transition={{ duration: t(0.35) }}>
            {/* beams sweeping up from the lamps */}
            {[-1, 1].map((dir) => (
              <motion.div
                key={dir}
                aria-hidden="true"
                className="absolute bottom-[18%] h-[90vh] w-[60vw] origin-bottom"
                style={{
                  left: `calc(50% + ${dir * 9}vw - 30vw)`,
                  background: "conic-gradient(from 165deg at 50% 100%, transparent 0deg, color-mix(in oklab, var(--color-ink-foreground) 22%, transparent) 15deg, transparent 30deg)",
                  filter: "blur(6px)",
                }}
                initial={{ opacity: 0, rotate: dir * 55 }}
                animate={{ opacity: [0, 1, 1, 0.55], rotate: [dir * 55, dir * 55, dir * -8, 0] }}
                transition={{ duration: t(2.2), times: [0, 0.2, 0.75, 1], delay: t(0.5), ease }}
              />
            ))}

            {/* headlamps */}
            {[-1, 1].map((dir) => (
              <motion.div
                key={dir}
                aria-hidden="true"
                className="absolute bottom-[18%] h-3 w-16 -translate-x-1/2 translate-y-1/2 rounded-full bg-ink-foreground sm:w-24"
                style={{ left: `calc(50% + ${dir * 9}vw)`, boxShadow: "0 0 24px 6px color-mix(in oklab, var(--color-ink-foreground) 70%, transparent), 0 0 80px 20px color-mix(in oklab, var(--color-ink-foreground) 25%, transparent)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.3, 1, 1] }}
                transition={{ duration: t(0.6), times: [0, 0.3, 0.45, 0.6, 1], delay: t(0.25 + (dir > 0 ? 0.08 : 0)) }}
              />
            ))}

            {/* logo lit by the beams */}
            <div className="absolute inset-0 flex items-center justify-center pb-[10vh]">
              <motion.img
                src="/logo-transparent.png"
                alt="Shamran Motors"
                width={757}
                height={392}
                className="h-auto w-64 max-w-[calc(100vw-4rem)] object-contain sm:w-80"
                initial={{ opacity: 0, filter: "brightness(0.2)" }}
                animate={{ opacity: 1, filter: "brightness(1)" }}
                transition={{ duration: t(1), delay: t(1.4), ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
