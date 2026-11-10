import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/Chrome";
import { VehicleCard, VehicleLightbox } from "@/components/site/VehicleGallery";
import { HERO_SLIDES, IMAGES, SITE, VEHICLES, whatsappLink, type Vehicle } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shamran Motors | Drive Your Next Chapter" },
      { name: "description", content: "Discover exceptional vehicles and flexible car hire with Shamran Motors, Bugolobi, Kampala." },
      { property: "og:title", content: "Shamran Motors | Drive Your Next Chapter" },
      { property: "og:description", content: "Vehicle sales, car hire and automotive showcases in Kampala." },
    ],
  }),
  component: Home,
});

const ease = [0.16, 1, 0.3, 1] as const;

function Home() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const carY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textX = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const [open, setOpen] = useState<Vehicle | null>(null);

  return (
    <>
      {/* 01 — Cinematic showroom */}
      <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-background pt-16">
        <motion.div style={{ x: textX }} className="pointer-events-none absolute inset-x-0 top-[14vh] select-none whitespace-nowrap px-5 md:px-10">
          {["Drive your", "next chapter."].map((l, i) => (
            <div key={l} className="overflow-hidden">
              <motion.h1 initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 1.3 + i * 0.12, ease }} className="display text-[14vw] text-brand md:text-[15vw]">
                {l}
              </motion.h1>
            </div>
          ))}
        </motion.div>
        <motion.img
          style={{ y: carY }}
          initial={{ opacity: 0, x: 120 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.6, delay: 1.5, ease }}
          src={IMAGES.hero}
          alt="Black luxury SUV in a white studio"
          width={1920}
          height={1088}
          className="relative z-10 mx-auto mt-[30vh] w-[135%] max-w-none -translate-x-[10%] mix-blend-multiply md:mt-[16vh] md:w-full md:translate-x-[8%]"
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 2, ease }} className="relative z-20 mx-auto -mt-[8vw] flex max-w-[1440px] flex-col gap-6 px-5 pb-12 md:flex-row md:items-end md:justify-between md:px-10">
          <p className="max-w-sm text-base text-muted-foreground">
            Discover exceptional vehicles, explore flexible car hire and experience automotive excellence with Shamran Motors.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/cars" className="eyebrow bg-brand px-7 py-4 text-primary-foreground transition-colors hover:bg-ink">Explore our cars</Link>
            <Link to="/car-hire" className="eyebrow border border-foreground px-7 py-4 transition-colors hover:bg-ink hover:text-ink-foreground">Explore car hire</Link>
          </div>
        </motion.div>
        <div className="relative z-20 mx-auto grid max-w-[1440px] grid-cols-2 border-t px-5 md:grid-cols-4 md:px-10">
          {(["SUV", "Sedan", "Coupe", "Pickup"] as const).map((b, i) => (
            <Link key={b} to="/cars" search={{ body: b }} className="group flex items-center justify-between border-r py-5 pr-4 last:border-r-0">
              <span className="eyebrow text-muted-foreground">0{i + 1}</span>
              <span className="display text-2xl transition-colors group-hover:text-brand">{b}</span>
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
            {VEHICLES.map((v, i) => (
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
