/**
 * EDIT ME: business details. Everything user-facing reads from this file.
 * The phone number below is a placeholder in the reserved 555-01xx range —
 * swap it, and the email and domain, for the real ones before this goes
 * anywhere near an ad.
 */
export const SITE = {
  brand: "Korte Homes",
  tagline: "Land + home, one loan.",
  street: "3609 E 4th St",
  city: "Taylor",
  state: "TX",
  zip: "76574",
  phone: "(512) 555-0142",
  phoneHref: "tel:+15125550142",
  email: "hello@kortehomes.com",
  hours: "Mon–Sat, 9–6",
  /** Used for absolute URLs in metadata. Set NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kortehomes.com",
} as const;

/** The lot address on one line, for the footer and structured data. */
export const ADDRESS_LINE = `${SITE.street}, ${SITE.city}, ${SITE.state} ${SITE.zip}`;
