export type ContactForm = { name: string; contact: string; message: string; consent: boolean };

export function validateContact(f: ContactForm) {
  const e: Partial<Record<keyof ContactForm, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  const c = f.contact.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);
  const isPhone = /^\+?[\d\s-]{9,15}$/.test(c);
  if (!isEmail && !isPhone) e.contact = "Enter a valid phone number or email.";
  if (f.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
  if (!f.consent) e.consent = "Please agree so we can reply.";
  return e;
}
