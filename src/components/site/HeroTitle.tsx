import { motion, useReducedMotion } from "motion/react";
import { heroLetterDelay, useOpeningVisible } from "@/lib/preloader";

export function HeroTitle() {
  const opening = useOpeningVisible();
  const reducedMotion = useReducedMotion();
  return (
    <div className="pointer-events-none relative z-10 mx-auto select-none px-3 md:absolute md:inset-x-0 md:top-[14vh] md:px-10 lg:whitespace-nowrap">
      {["Drive your", "next chapter."].map((line, lineIndex) => (
        <div key={line} className="overflow-hidden">
          <h1 aria-label={line} className="display text-[clamp(3.125rem,15vw,4.75rem)] font-bold text-brand sm:text-[clamp(4rem,10vw,8rem)] sm:font-normal lg:text-[15vw]">
            <span aria-hidden="true">
              {Array.from(line).map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  initial={reducedMotion ? false : { y: "115%", rotate: 6, opacity: 0 }}
                  animate={opening && !reducedMotion ? { y: "115%", rotate: 6, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
                  transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : heroLetterDelay(lineIndex, index), ease: [0.16, 1, 0.3, 1] }}
                >
                  {letter === " " ? "\u00a0" : letter}
                </motion.span>
              ))}
            </span>
          </h1>
        </div>
      ))}
    </div>
  );
}