import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Chrome";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Privacy Policy | Shamran Motors" },
      { name: "description", content: "How Shamran Motors handles enquiry information." },
      { property: "og:title", content: "Privacy Policy | Shamran Motors" },
      { property: "og:description", content: "How we handle your enquiry data." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Privacy" />
      <section className="mx-auto max-w-3xl space-y-4 px-5 pb-24 text-muted-foreground">
        <p>We collect only what you choose to send: your name, a phone number or email, and your message.</p>
        <p>This information is used solely to respond to your enquiry. It is not sold or shared for marketing.</p>
        <p>The website does not store form data itself; enquiries are sent through your own email or WhatsApp app.</p>
        <p>To ask for your data to be deleted, email {SITE.email}.</p>
      </section>
    </>
  ),
});
