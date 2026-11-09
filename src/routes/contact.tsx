import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/Chrome";
import { SITE, whatsappLink } from "@/lib/site";
import { validateContact, type ContactForm } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Shamran Motors" },
      { name: "description", content: "Contact Shamran Motors in Bugolobi, Kampala by WhatsApp, email, Instagram or TikTok." },
      { property: "og:title", content: "Contact | Shamran Motors" },
      { property: "og:description", content: "Get in touch with Shamran Motors." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [f, setF] = useState<ContactForm>({ name: "", contact: "", message: "", consent: false });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateContact(f);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const body = `Name: ${f.name}\nContact: ${f.contact}\n\n${f.message}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`;
  }

  const field = "w-full border-b bg-transparent py-3 outline-none focus:border-brand";
  return (
    <>
      <PageHero eyebrow="Contact" title="Say hello." />
      <section className="mx-auto grid grid-cols-1 max-w-[1440px] gap-16 px-5 pb-24 md:grid-cols-2 md:px-10">
        <div className="space-y-8">
          <div><p className="eyebrow text-muted-foreground">Visit</p><p className="display mt-2 text-4xl">{SITE.location}</p></div>
          <div className="min-w-0"><p className="eyebrow text-muted-foreground">Email</p><a href={`mailto:${SITE.email}`} className="link-line mt-2 inline-block max-w-full break-all text-xl">{SITE.email}</a></div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink("Hello Shamran Motors, I have an enquiry.")} target="_blank" rel="noreferrer" className="eyebrow bg-brand px-6 py-4 text-primary-foreground">WhatsApp</a>
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="eyebrow border px-6 py-4 hover:border-foreground">Instagram</a>
            <a href={SITE.tiktok} target="_blank" rel="noreferrer" className="eyebrow border px-6 py-4 hover:border-foreground">TikTok</a>
          </div>
        </div>
        <form onSubmit={submit} noValidate className="space-y-6">
          {(["name", "contact"] as const).map((k) => (
            <div key={k}>
              <label htmlFor={k} className="eyebrow">{k === "name" ? "Your name" : "Phone or email"}</label>
              <input id={k} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={field} maxLength={120} />
              {errors[k] && <p className="mt-1 text-sm text-destructive">{errors[k]}</p>}
            </div>
          ))}
          <div>
            <label htmlFor="message" className="eyebrow">Message</label>
            <textarea id="message" rows={5} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={field} maxLength={2000} />
            {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message}</p>}
          </div>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input type="checkbox" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} className="mt-1 accent-[var(--brand)]" />
            <span>I agree my details are used only to reply to this enquiry, per the <Link to="/privacy" className="underline">Privacy Policy</Link>.</span>
          </label>
          {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
          <button type="submit" className="eyebrow bg-ink px-8 py-4 text-ink-foreground transition-colors hover:bg-brand">Send enquiry</button>
          <p className="text-xs text-muted-foreground">Sending opens your email app with the message ready.</p>
        </form>
      </section>
    </>
  );
}
