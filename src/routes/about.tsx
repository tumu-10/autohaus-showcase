import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Reveal } from "@/components/site/Chrome";
import { IMAGES } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Shamran Motors" },
      { name: "description", content: "Shamran Motors is a Kampala automotive business offering vehicle sales, car hire and showcases." },
      { property: "og:title", content: "About | Shamran Motors" },
      { property: "og:description", content: "Who we are and how we work." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="Made in Kampala." />
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-24 md:grid-cols-2 md:px-10">
        <Reveal>
          <p className="text-2xl leading-snug">Shamran Motors is an automotive business based in Bugolobi, Kampala. We sell vehicles, offer car hire and create showcases that present cars the way they deserve.</p>
          <p className="mt-6 text-muted-foreground">Our philosophy is simple: be clear about every vehicle, be personal with every customer and make the process feel effortless from first look to handover.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <img src={IMAGES.sedan} alt="White sedan in studio" loading="lazy" width={1536} height={1024} className="w-full" />
        </Reveal>
      </section>
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-[1440px] gap-px px-5 py-24 md:grid-cols-3 md:px-10">
          {["Vehicle sales", "Car hire & rental", "Automotive marketing"].map((t, i) => (
            <Reveal key={t} delay={i * 0.1} className="border-t border-ink-foreground/20 pt-6 md:pr-8">
              <p className="eyebrow text-brand">0{i + 1}</p>
              <h3 className="display mt-3 text-5xl">{t}</h3>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
