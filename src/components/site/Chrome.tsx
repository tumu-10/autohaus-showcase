import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE, whatsappLink } from "@/lib/site";

const NAV = [
  { to: "/cars", label: "Our Cars" },
  { to: "/car-hire", label: "Car Hire" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Wordmark() {
  return (
    <span className="display text-2xl tracking-wide">
      Shamran<span className="text-brand">.</span>
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? "border-b bg-background/90 backdrop-blur" : "bg-transparent"}`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10">
        <Link to="/" aria-label="Shamran Motors home" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="eyebrow link-line" activeProps={{ className: "text-brand" }}>
              {n.label}
            </Link>
          ))}
          <a href={whatsappLink("Hello Shamran Motors, I'd like to enquire.")} target="_blank" rel="noreferrer" className="eyebrow bg-ink px-4 py-2.5 text-ink-foreground transition-colors hover:bg-brand">
            Enquire
          </a>
        </nav>
        <button className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-b bg-background px-5 pb-8 md:hidden"
          >
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="display block py-2 text-5xl" activeProps={{ className: "text-brand" }}>
                {n.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10">
        <p className="display text-[18vw] leading-none md:text-[13vw]">
          Shamran<span className="text-brand">.</span>
        </p>
        <div className="mt-12 grid gap-8 border-t border-ink-foreground/15 pt-8 text-sm md:grid-cols-4">
          <div>
            <p className="eyebrow mb-3 opacity-60">Visit</p>
            <p>{SITE.location}</p>
          </div>
          <div>
            <p className="eyebrow mb-3 opacity-60">Write</p>
            <a className="link-line" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
          <div>
            <p className="eyebrow mb-3 opacity-60">Follow</p>
            <div className="flex flex-col gap-1">
              <a className="link-line w-fit" href={SITE.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a className="link-line w-fit" href={SITE.tiktok} target="_blank" rel="noreferrer">TikTok</a>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-3 opacity-60">Legal</p>
            <div className="flex flex-col gap-1">
              <Link className="link-line w-fit" to="/privacy">Privacy Policy</Link>
              <Link className="link-line w-fit" to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs opacity-50">© {new Date().getFullYear()} Shamran Motors. Vehicle listings shown are demonstration content.</p>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hello Shamran Motors, I have an enquiry.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center bg-brand text-primary-foreground shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle />
    </a>
  );
}

export function Preloader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink text-ink-foreground"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="w-64">
            <div className="overflow-hidden">
              <motion.p initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="display text-6xl">
                Shamran<span className="text-brand">.</span>
              </motion.p>
            </div>
            <motion.div className="mt-4 h-0.5 origin-left bg-brand" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, ease: "easeInOut" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-12 pt-32 md:px-10 md:pt-40">
      <p className="eyebrow text-brand">{eyebrow}</p>
      <div className="overflow-hidden">
        <motion.h1 initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="display mt-4 text-[17vw] md:text-[10vw]">
          {title}
        </motion.h1>
      </div>
      {intro && <p className="mt-6 max-w-xl text-lg text-muted-foreground">{intro}</p>}
    </section>
  );
}
