import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Chrome";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Shamran Motors" },
      { name: "description", content: "Terms for using the Shamran Motors website." },
      { property: "og:title", content: "Terms of Service — Shamran Motors" },
      { property: "og:description", content: "Website terms of use." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Terms" />
      <section className="mx-auto max-w-3xl space-y-4 px-5 pb-24 text-muted-foreground">
        <p>Vehicle listings marked "Demo listing" are illustrative and do not represent available stock.</p>
        <p>Prices, specifications and availability are subject to confirmation by Shamran Motors and may change without notice.</p>
        <p>Car hire rates, deposits, insurance and conditions are agreed individually and confirmed in writing before any booking.</p>
        <p>Nothing on this website is a binding offer of sale or hire.</p>
      </section>
    </>
  ),
});
