import type { StaticImageData } from "next/image";

import mapleExterior from "@/assets/homes/maple/exterior.jpg";
import mapleExterior2 from "@/assets/homes/maple/exterior-2.jpg";
import mapleFloorPlan from "@/assets/homes/maple/floor-plan.jpg";
import mapleDining from "@/assets/homes/maple/dining.jpg";
import mapleKitchen from "@/assets/homes/maple/kitchen.jpg";
import mapleLiving from "@/assets/homes/maple/living-room.jpg";
import mapleBedroom from "@/assets/homes/maple/primary-bedroom.jpg";
import mapleBath from "@/assets/homes/maple/primary-bath.jpg";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HOMES ON THE LOT. Each entry renders as a card in the "Homes we set" section.
 *  Specs come from the manufacturer's sales sheet; photos live in
 *  `assets/homes/<slug>/` and are statically imported so Next.js knows their
 *  size and can serve them optimized.
 *
 *  No price is shown on purpose: the payment depends on the land, and the
 *  county numbers on the map already carry a home in them.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type HomePhoto = { src: StaticImageData; alt: string };

export type Home = {
  slug: string;
  name: string;
  model: string;
  series: string;
  maker: string;
  beds: number;
  baths: number;
  sqft: number;
  /** Nominal footprint in feet, width × length. */
  size: string;
  sections: "Single-section" | "Multi-section";
  blurb: string;
  highlights: string[];
  hero: HomePhoto;
  floorPlan: HomePhoto;
  gallery: HomePhoto[];
  /** The manufacturer's page for the model. */
  sourceUrl: string;
};

export const HOMES: Home[] = [
  {
    slug: "maple",
    name: "The Maple",
    model: "TRT28483MH",
    series: "TRU Origin",
    maker: "TRU Homes",
    beds: 3,
    baths: 2,
    sqft: 1264,
    size: "28×48",
    sections: "Multi-section",
    blurb:
      "A split-bedroom doublewide that puts the whole middle of the house to work: kitchen, dining, and a 19-foot living room in one open run, with the primary suite on one end and two bedrooms on the other.",
    highlights: [
      "Kitchen island with seating, open to dining and living",
      "Primary suite on its own end, with a walk-in closet",
      "Primary bath with walk-in shower — or swap in a soaking tub",
      "Separate utility room off the kitchen, with a back door",
      "Bedroom 3 can be built as an open flex room",
    ],
    hero: {
      src: mapleExterior,
      alt: "The Maple, a tan vinyl-sided doublewide with white shutters and a wooden front porch, set on a grassy lot",
    },
    floorPlan: {
      src: mapleFloorPlan,
      alt: "Maple floor plan: primary bedroom and bath on the left, open living room, kitchen with island, and dining in the center, bedrooms 2 and 3 with a second bath on the right",
    },
    gallery: [
      {
        src: mapleKitchen,
        alt: "Kitchen with white cabinets, an island with stools, black appliances, and a window over the sink",
      },
      { src: mapleLiving, alt: "Open living room in the Maple" },
      { src: mapleDining, alt: "Dining area between the kitchen and bedroom 2" },
      { src: mapleBedroom, alt: "Primary bedroom in the Maple" },
      { src: mapleBath, alt: "Primary bathroom in the Maple" },
      {
        src: mapleExterior2,
        alt: "The Maple in gray siding with black shutters and white skirting",
      },
    ],
    sourceUrl: "https://owntru.com/models/trt28483mh/",
  },
];
