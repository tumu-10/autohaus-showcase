import { motion, useReducedMotion } from "motion/react";
import { HERO_SCAN_DURATION_SECONDS, heroLetterDelay, useOpeningVisible } from "@/lib/preloader";

const lines = ["Drive your", "next chapter."];

export function HeroTitle() {
  const opening = useOpeningVisible();
  const reducedMotion = useReducedMotion();
  const waiting = opening && !reducedMotion;

  return (
    <div
      className="pointer-events-none relative z-10 mx-auto select-none px-3 md:absolute md:inset-x-0 md:top-[14vh] md:px-10 lg:whitespace-nowrap"
      data-title-revealed={!opening}
    >
      {lines.map((line, lineIndex) => (
        <div key={line} className="relative overflow-hidden">
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-20 bg-gradient-to-r from-transparent via-brand/15 to-transparent motion-reduce:hidden"
            initial={{ left: "-12%", opacity: 0 }}
            animate={waiting ? { left: "-12%", opacity: 0 } : { left: ["-12%", "105%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: reducedMotion ? 0 : HERO_SCAN_DURATION_SECONDS, delay: reducedMotion ? 0 : lineIndex * 0.17, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-30 w-px bg-brand motion-reduce:hidden"
            initial={{ left: "0%", opacity: 0 }}
            animate={waiting ? { left: "0%", opacity: 0 } : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: reducedMotion ? 0 : HERO_SCAN_DURATION_SECONDS * 0.82, delay: reducedMotion ? 0 : lineIndex * 0.17 + 0.04, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-1/2 z-20 h-px w-full origin-left bg-brand/35 motion-reduce:hidden"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={waiting ? { scaleX: 0, opacity: 0 } : { scaleX: [0, 1, 1], opacity: [0, 0.7, 0] }}
            transition={{ duration: reducedMotion ? 0 : 0.62, delay: reducedMotion ? 0 : lineIndex * 0.17 + 0.12, ease: "easeOut" }}
          />
          <h1 aria-label={line} className="display relative text-[clamp(3.125rem,15vw,4.75rem)] font-bold text-brand sm:text-[clamp(4rem,10vw,8rem)] sm:font-normal lg:text-[15vw]">
            <span aria-hidden="true">
              {Array.from(line).map((letter, index) => {
                const delay = heroLetterDelay(lineIndex, index);
                const character = letter === " " ? "\u00a0" : letter;
                const hidden = {
                  y: lineIndex === 0 ? "112%" : "-112%",
                  opacity: 0,
                  scaleX: 0.72,
                  skewX: lineIndex === 0 ? 12 : -12,
                  filter: "blur(8px)",
                };
                const assembled = { y: "0%", opacity: 1, scaleX: 1, skewX: 0, filter: "blur(0px)" };

                return (
                  <motion.span
                    key={index}
                    className="relative inline-block will-change-transform"
                    initial={hidden}
                    animate={waiting ? hidden : assembled}
                    transition={{ duration: reducedMotion ? 0 : 0.92, delay: reducedMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 text-foreground motion-reduce:hidden"
                      initial={{ opacity: 0, x: 0 }}
                      animate={waiting
                        ? { opacity: 0, x: 0 }
                        : { opacity: [0, 0.65, 0.28, 0], x: [0, -7, 5, 0], clipPath: ["inset(12% 0 62% 0)", "inset(48% 0 18% 0)", "inset(72% 0 4% 0)", "inset(0 0 0 0)"] }}
                      transition={{ duration: reducedMotion ? 0 : 0.46, delay: reducedMotion ? 0 : delay + 0.12, ease: "easeOut" }}
                    >
                      {character}
                    </motion.span>
                    <motion.span
                      className="relative inline-block"
                      initial={{ clipPath: "inset(0 0 100% 0)" }}
                      animate={waiting ? { clipPath: "inset(0 0 100% 0)" } : { clipPath: "inset(0 0 0% 0)" }}
                      transition={{ duration: reducedMotion ? 0 : 0.68, delay: reducedMotion ? 0 : delay + 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {character}
                    </motion.span>
                  </motion.span>
                );
              })}
            </span>
          </h1>
        </div>
      ))}
    </div>
  );
}
