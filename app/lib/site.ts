/**
 * EDIT ME: business details. Everything user-facing reads from this file.
 * The phone number below is a placeholder in the reserved 555-01xx range —
 * swap it for the real line before this goes anywhere near an ad.
 */
export const SITE = {
  brand: "Mobile Home Guys",
  tagline: "Land + home, one loan.",
  city: "Gainesville",
  state: "FL",
  phone: "(352) 555-0142",
  phoneHref: "tel:+13525550142",
  email: "hello@mobilehomeguys.ai",
  hours: "Mon–Sat, 9–6",
  /** Used for absolute URLs in metadata. Set NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mobilehomeguys.ai",
} as const;
