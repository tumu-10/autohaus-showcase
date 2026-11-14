import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Reveal } from "@/components/site/Chrome";
import { IMAGES, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/car-hire")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Car Hire | Shamran Motors" },
      { name: "description", content: "Car hire in Kampala with Shamran Motors. Enquire on WhatsApp for availability and terms." },
      { property: "og:title", content: "Car Hire | Shamran Motors" },
      { property: "og:description", content: "Flexible car hire in Kampala." },
    ],
  }),
  component: CarHire,
});

const CATS = [
  { name: "Executive", img: IMAGES.sedan, text: "Saloons for business travel, airport runs and formal occasions." },
  { name: "SUV & Family", img: IMAGES.hero, text: "Space and comfort for family trips and upcountry journeys." },
  { name: "4x4 & Utility", img: IMAGES.pickup, text: "Capable vehicles for rough roads and working trips." },
  { name: "Weekend Statement", img: IMAGES.coupe, text: "Something special for an event, a shoot or a weekend." },
];

function CarHire() {
  return (
    <>
      <PageHero eyebrow="Car hire" title="Hire it." intro="Choose a category and send us your dates. Rates, deposits, insurance and availability are confirmed directly with you before booking." />
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
        {CATS.map((c, i) => (
          <Reveal key={c.name} className={`grid items-center gap-8 border-t py-12 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <img src={c.img} alt={`${c.name} hire category`} loading="lazy" width={1536} height={1024} className="aspect-[3/2] w-full bg-secondary object-cover" />
            <div>
              <p className="eyebrow text-brand">0{i + 1}</p>
              <h2 className="display mt-2 text-6xl md:text-8xl">{c.name}</h2>
              <p className="mt-4 max-w-md text-muted-foreground">{c.text}</p>
              <a href={whatsappLink(`Hello Shamran Motors, I'd like to hire a vehicle in the ${c.name} category. My dates are: `)} target="_blank" rel="noreferrer" className="eyebrow mt-8 inline-block bg-brand px-7 py-4 text-primary-foreground transition-colors hover:bg-ink">
                Enquire on WhatsApp
              </a>
            </div>
          </Reveal>
        ))}
        <div className="mt-8 bg-secondary p-8">
          <p className="eyebrow">Hire terms</p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Pricing, deposits, insurance cover, driver options, mileage limits and required documents vary by vehicle and period. All terms are subject to confirmation by Shamran Motors at the time of enquiry.</p>
        </div>
      </section>
    </>
  );
}
