import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Reveal } from "@/components/site/Chrome";
import { VehicleCard, VehicleLightbox } from "@/components/site/VehicleGallery";
import { HERO_SLIDES, IMAGES, SITE, whatsappLink, type Vehicle } from "@/lib/site";
import { useHeroSlideshow } from "@/lib/hero-slideshow";
import { useCars } from "@/hooks/useCars";
import { HeroTitle } from "@/components/site/HeroTitle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Shamran Motors | Drive Your Next Chapter" },
      { name: "description", content: "Discover exceptional vehicles and flexible car hire with Shamran Motors, Bugolobi, Kampala." },
      { property: "og:title", content: "Shamran Motors | Drive Your Next Chapter" },
      { property: "og:description", content: "Vehicle sales, car hire and automotive showcases in Kampala." },
    ],
  }),
  component: Home,
});

function Home() {
  const [open, setOpen] = useState<Vehicle | null>(null);
  const [slide, setSlide] = useHeroSlideshow(HERO_SLIDES.length);
  const reduceMotion = useReducedMotion();
  const vehicles = useCars();

  return (
    <>
      {/* 01 — Cinematic showroom */}
      <section className="relative min-h-[100svh] overflow-hidden bg-background pt-16">
        <HeroTitle />
        <div className="relative z-0 mx-auto mt-1 h-[42svh] min-h-60 max-h-[360px] w-full max-w-[1440px] mix-blend-multiply md:absolute md:inset-x-0 md:top-[18vh] md:mt-0 md:h-[60svh] md:min-h-0 md:max-h-none md:w-full lg:relative lg:inset-auto lg:z-10 lg:mt-[18vh] lg:h-auto lg:w-full lg:translate-x-[8%]">
          <img src={HERO_SLIDES[0].src} alt="" aria-hidden="true" width={1920} height={1088} className="invisible h-full w-full object-contain lg:h-auto" />
          <AnimatePresence mode="sync" initial={false}>
            <motion.img
              key={slide}
              src={HERO_SLIDES[slide]?.src}
              alt={HERO_SLIDES[slide]?.alt}
              width={1920}
              height={1088}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </AnimatePresence>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] hidden bg-gradient-to-b from-background/80 via-background/60 to-background/95 md:block lg:hidden" />
        <div className="relative z-20 mx-auto mt-3 flex max-w-[1440px] flex-col gap-5 px-5 md:absolute md:inset-x-0 md:bottom-40 md:mt-0 lg:relative lg:bottom-auto lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:-mt-[8vw] lg:px-10 lg:pb-12">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((heroSlide, index) => (
                <button
                  key={heroSlide.id}
                  type="button"
                  onClick={() => setSlide(index)}
                  aria-label={`Show ${heroSlide.label}`}
                  aria-current={index === slide}
                  className="flex min-h-11 min-w-11 items-center justify-center"
                >
                  <span className={`block h-px ${index === slide ? "w-10 bg-brand" : "w-6 bg-foreground/30"}`} />
                </button>
              ))}
              <span className="eyebrow text-muted-foreground">{HERO_SLIDES[slide]?.label}</span>
            </div>
            <p className="max-w-sm text-lg text-muted-foreground sm:text-xl lg:text-base">
              Discover exceptional vehicles, explore flexible car hire and experience automotive excellence with Shamran Motors.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/cars" className="eyebrow min-h-12 bg-brand px-5 py-4 text-sm text-primary-foreground hover:bg-ink md:px-7">Explore our cars</Link>
            <Link to="/car-hire" className="eyebrow min-h-12 border border-foreground px-5 py-4 text-sm hover:bg-ink hover:text-ink-foreground md:px-7">Explore car hire</Link>
          </div>
        </div>
        <div className="relative inset-x-auto bottom-auto z-20 mx-auto mt-8 grid max-w-[1440px] grid-cols-2 border-t px-5 md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:px-10 lg:relative lg:bottom-auto lg:grid-cols-4">
          {(["SUV", "Sedan", "Coupe", "Pickup"] as const).map((b, i) => (
            <Link key={b} to="/cars" search={{ body: b }} className="group flex items-center justify-between border-r py-5 pr-4 last:border-r-0 last:pr-4 md:last:pr-20 lg:last:pr-4">
              <span className="eyebrow text-muted-foreground">0{i + 1}</span>
              <span className="display text-2xl group-hover:text-brand">{b}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 02 — Vehicle gallery */}
      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-brand">02 — The gallery</p>
              <h2 className="display mt-3 text-7xl md:text-9xl">Featured<br />vehicles</h2>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">Demonstration listings shown until current inventory is published. Tap any vehicle to browse photos and specifications.</p>
          </Reveal>
          <div className="mt-14 flex snap-x gap-6 overflow-x-auto pb-6 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-16 md:overflow-visible">
            {vehicles.map((v, i) => (
              <div key={v.id} className={`w-[85vw] shrink-0 snap-start md:w-auto ${i % 2 ? "md:mt-24" : ""}`}>
                <VehicleCard v={v} index={i} onOpen={() => setOpen(v)} />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/cars" className="eyebrow link-line text-brand">See the full showroom →</Link>
          </div>
        </div>
      </section>
      <VehicleLightbox v={open} onClose={() => setOpen(null)} />

      {/* Car hire intro */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-24 md:grid-cols-2 md:px-10">
          <Reveal>
            <p className="eyebrow text-brand">Car hire</p>
            <h2 className="display mt-3 text-7xl md:text-8xl">Hire for the<br />way you move.</h2>
            <p className="mt-6 max-w-md opacity-75">Executive travel, family trips, upcountry journeys or a weekend statement. Tell us your dates and we confirm availability and terms directly.</p>
            <Link to="/car-hire" className="eyebrow mt-8 inline-block bg-brand px-7 py-4 text-primary-foreground transition-colors hover:bg-background hover:text-foreground">Explore car hire</Link>
          </Reveal>
          <Reveal delay={0.15}>
            <img src={IMAGES.coupe} alt="Red sports coupe" loading="lazy" width={1536} height={1024} className="w-full" />
          </Reveal>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <p className="eyebrow text-brand">Why Shamran Motors</p>
        <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
          {[
            ["Sales", "A curated selection of vehicles, presented honestly with clear specifications."],
            ["Hire", "Flexible car hire with terms confirmed personally before you commit."],
            ["Showcase", "Automotive marketing and vehicle showcases that let cars speak for themselves."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.1} className="bg-background p-8">
              <p className="display text-brand text-6xl">0{i + 1}</p>
              <h3 className="display mt-6 text-4xl">{t}</h3>
              <p className="mt-3 text-muted-foreground">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Social */}
      <section className="border-t">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 py-24 md:flex-row md:items-center md:justify-between md:px-10">
          <h2 className="display text-6xl md:text-8xl">See it<br />in <span className="text-brand">motion.</span></h2>
          <div className="flex flex-col gap-3">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="display border-b py-3 text-4xl transition-colors hover:text-brand">Instagram ↗</a>
            <a href={SITE.tiktok} target="_blank" rel="noreferrer" className="display border-b py-3 text-4xl transition-colors hover:text-brand">TikTok ↗</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand text-primary-foreground">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <h2 className="display text-[16vw] md:text-[11vw]">Let's talk cars.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink("Hello Shamran Motors, I'd like to talk about a vehicle.")} target="_blank" rel="noreferrer" className="eyebrow bg-ink px-7 py-4 text-ink-foreground">WhatsApp us</a>
            <Link to="/contact" className="eyebrow border border-primary-foreground px-7 py-4">Contact page</Link>
          </div>
        </div>
      </section>
    </>
  );
}
