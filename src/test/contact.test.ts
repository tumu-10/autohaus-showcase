import { describe, expect, it } from "vitest";
import { validateContact } from "@/lib/contact";

const ok = { name: "Amina", contact: "+256 700 123456", message: "I want to see the SUV.", consent: true };

describe("contact validation", () => {
  it("accepts a valid enquiry", () => expect(validateContact(ok)).toEqual({}));
  it("rejects invalid contact", () => expect(validateContact({ ...ok, contact: "abc" }).contact).toBeDefined());
  it("requires consent", () => expect(validateContact({ ...ok, consent: false }).consent).toBeDefined());
});
