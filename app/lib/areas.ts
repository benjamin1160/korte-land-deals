import { milesFromHQ } from "./geo";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDIT YOUR PRICING HERE. This file is the single source of truth for every
 *  number on the site — the map, the county list, and the social preview image
 *  all read from it.
 *
 *  `startingPayment`  estimated monthly payment on a land + home package, i.e.
 *                     the cheapest realistic way into that county today.
 *  `land`             what a buildable lot actually trades for in that county.
 *  `lotTypical`       the parcel size those numbers assume.
 *
 *  Payment estimates assume one loan covering land and home, 20% down, ~20–23
 *  year term, on approved credit. Update `PAYMENT_ASSUMPTIONS` below whenever
 *  rates or programs move, and keep the disclaimer honest.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const PAYMENT_ASSUMPTIONS =
  "Estimates assume a land-and-home package financed as one loan with 20% down over a 20–23 year term, taxes and insurance escrowed, on approved credit. Your rate, term, and payment depend on credit, down payment, land cost, and site work.";

export type Area = {
  slug: string;
  county: string;
  /** The town the marker sits on. */
  seat: string;
  /** Other towns buyers search in this county. */
  towns: string[];
  lat: number;
  lon: number;
  /** Estimated starting monthly payment, land + home, one loan. */
  startingPayment: number;
  /** Typical buildable-lot price range, in dollars. */
  land: { low: number; high: number };
  lotTypical: string;
  /** One line of local reality: zoning, utilities, what sells there. */
  note: string;
  /** Which side of the star its label sits on. */
  labelSide: "n" | "s" | "e" | "w";
  /** Optional fine-tuning of the label, in map units (miles). */
  dx?: number;
  dy?: number;
};

const RAW: Area[] = [
  {
    slug: "williamson",
    county: "Williamson",
    seat: "Georgetown",
    towns: ["Taylor", "Hutto", "Granger", "Coupland", "Thrall"],
    lat: 30.6333,
    lon: -97.6772,
    startingPayment: 2125,
    land: { low: 130000, high: 275000 },
    lotTypical: "1/2 – 2 acres",
    note: "Home county. Land east of Taylor toward Granger and Thrall is the only part that still pencils; the county has real subdivision rules, so we check the plat first.",
    labelSide: "w",
    dy: -3,
  },
  {
    slug: "milam",
    county: "Milam",
    seat: "Cameron",
    towns: ["Rockdale", "Thorndale", "Buckholts", "Milano"],
    lat: 30.8532,
    lon: -96.9769,
    startingPayment: 1495,
    land: { low: 38000, high: 75000 },
    lotTypical: "1 – 10 acres",
    note: "Straight up US-79 from the lot. Best acres-per-dollar inside 35 miles, and the county is easy to permit in.",
    labelSide: "e",
  },
  {
    slug: "travis",
    county: "Travis",
    seat: "Austin",
    towns: ["Manor", "Del Valle", "Pflugerville", "Elgin"],
    lat: 30.2672,
    lon: -97.7431,
    startingPayment: 2295,
    land: { low: 160000, high: 350000 },
    lotTypical: "1/4 – 1 acre",
    note: "Priciest dirt on this map, and city limits ban most manufactured homes outright. The eastern county line is where deals still happen.",
    labelSide: "w",
  },
  {
    slug: "bastrop",
    county: "Bastrop",
    seat: "Bastrop",
    towns: ["Elgin", "Smithville", "Cedar Creek", "Red Rock"],
    lat: 30.1105,
    lon: -97.3153,
    startingPayment: 1785,
    land: { low: 80000, high: 160000 },
    lotTypical: "1 – 5 acres",
    note: "Our busiest county after Williamson. Watch for wildfire-area restrictions and shared-drive access on the Lost Pines side.",
    labelSide: "s",
  },
  {
    slug: "bell",
    county: "Bell",
    seat: "Belton",
    towns: ["Temple", "Killeen", "Holland", "Rogers", "Bartlett"],
    lat: 31.0563,
    lon: -97.4642,
    startingPayment: 1665,
    land: { low: 65000, high: 130000 },
    lotTypical: "1 – 5 acres",
    note: "Fort Cavazos paychecks and country land prices. Holland, Rogers, and Bartlett are the affordable corner nearest us.",
    labelSide: "w",
  },
  {
    slug: "lee",
    county: "Lee",
    seat: "Giddings",
    towns: ["Lexington", "Dime Box", "Serbin"],
    lat: 30.1827,
    lon: -96.9364,
    startingPayment: 1585,
    land: { low: 55000, high: 110000 },
    lotTypical: "1 – 10 acres",
    note: "Light zoning, good septic ground, and acreage that still trades under six figures. Lexington is a 40-minute delivery.",
    labelSide: "s",
  },
  {
    slug: "burleson",
    county: "Burleson",
    seat: "Caldwell",
    towns: ["Somerville", "Snook", "Lyons"],
    lat: 30.5316,
    lon: -96.6939,
    startingPayment: 1575,
    land: { low: 50000, high: 105000 },
    lotTypical: "1 – 10 acres",
    note: "Due east on 79 then south. Big parcels, few restrictions, and Bryan–College Station work half an hour away.",
    labelSide: "e",
  },
  {
    slug: "caldwell",
    county: "Caldwell",
    seat: "Lockhart",
    towns: ["Luling", "Martindale", "Dale", "Maxwell"],
    lat: 29.8844,
    lon: -97.67,
    startingPayment: 1665,
    land: { low: 65000, high: 125000 },
    lotTypical: "1 – 5 acres",
    note: "SH-130 put Lockhart 45 minutes from us. Land is climbing but is still half of what Hays County asks.",
    labelSide: "e",
    dy: 4,
  },
  {
    slug: "burnet",
    county: "Burnet",
    seat: "Burnet",
    towns: ["Marble Falls", "Bertram", "Granite Shoals", "Briggs"],
    lat: 30.759,
    lon: -98.2281,
    startingPayment: 1885,
    land: { low: 90000, high: 190000 },
    lotTypical: "1 – 5 acres",
    note: "Hill Country rock means septic and driveway cost more here. Bertram and Briggs are the value end of the county.",
    labelSide: "w",
  },
  {
    slug: "fayette",
    county: "Fayette",
    seat: "La Grange",
    towns: ["Schulenburg", "Flatonia", "Fayetteville", "Carmine"],
    lat: 29.9052,
    lon: -96.8766,
    startingPayment: 1695,
    land: { low: 70000, high: 140000 },
    lotTypical: "1 – 10 acres",
    note: "Weekend-ranch money set the floor here, but deed restrictions vary block to block. Send us the restrictions before you offer.",
    labelSide: "e",
  },
  {
    slug: "lampasas",
    county: "Lampasas",
    seat: "Lampasas",
    towns: ["Kempner", "Lometa", "Adamsville"],
    lat: 31.0632,
    lon: -98.1817,
    startingPayment: 1585,
    land: { low: 55000, high: 105000 },
    lotTypical: "2 – 20 acres",
    note: "Where the Hill Country stops being expensive. Bigger parcels than Burnet at a third less per acre.",
    labelSide: "w",
  },
  {
    slug: "hays",
    county: "Hays",
    seat: "San Marcos",
    towns: ["Kyle", "Buda", "Wimberley", "Dripping Springs", "Niederwald"],
    lat: 29.8833,
    lon: -97.9414,
    startingPayment: 2045,
    land: { low: 115000, high: 250000 },
    lotTypical: "1/2 – 2 acres",
    note: "Growth corridor prices. The Niederwald and Uhland side off SH-21 is the realistic entry point for a land-and-home deal.",
    labelSide: "w",
  },
  {
    slug: "falls",
    county: "Falls",
    seat: "Marlin",
    towns: ["Rosebud", "Lott", "Chilton", "Golinda"],
    lat: 31.3082,
    lon: -96.8961,
    startingPayment: 1425,
    land: { low: 30000, high: 60000 },
    lotTypical: "2 – 20 acres",
    note: "The cheapest way onto your own land on this whole map. Blackland farm ground, almost no zoning friction.",
    labelSide: "e",
  },
  {
    slug: "brazos",
    county: "Brazos",
    seat: "Bryan",
    towns: ["College Station", "Wixon Valley", "Millican"],
    lat: 30.6744,
    lon: -96.37,
    startingPayment: 1725,
    land: { low: 70000, high: 140000 },
    lotTypical: "1 – 5 acres",
    note: "A&M keeps demand high. Manufactured homes fit outside the two city limits — we check the ETJ before you commit.",
    labelSide: "e",
  },
  {
    slug: "robertson",
    county: "Robertson",
    seat: "Franklin",
    towns: ["Hearne", "Calvert", "Bremond", "Wheelock"],
    lat: 31.0271,
    lon: -96.4855,
    startingPayment: 1465,
    land: { low: 35000, high: 70000 },
    lotTypical: "2 – 15 acres",
    note: "Cheap acreage 20 minutes off US-79, with Bryan work close enough to commute. One of our most common packages.",
    labelSide: "e",
  },
  {
    slug: "coryell",
    county: "Coryell",
    seat: "Gatesville",
    towns: ["Copperas Cove", "Oglesby", "Evant", "Flat"],
    lat: 31.4351,
    lon: -97.7439,
    startingPayment: 1545,
    land: { low: 45000, high: 90000 },
    lotTypical: "2 – 15 acres",
    note: "Ranch country west of Waco. Long delivery day, but the land is priced like nobody has found it yet.",
    labelSide: "w",
  },
  {
    slug: "blanco",
    county: "Blanco",
    seat: "Johnson City",
    towns: ["Blanco", "Round Mountain", "Hye"],
    lat: 30.2769,
    lon: -98.4114,
    startingPayment: 1955,
    land: { low: 100000, high: 210000 },
    lotTypical: "2 – 10 acres",
    note: "Beautiful and pricey. Budget for rock excavation, a deep well, and a longer driveway than you think.",
    labelSide: "w",
  },
  {
    slug: "washington",
    county: "Washington",
    seat: "Brenham",
    towns: ["Burton", "Chappell Hill", "Independence"],
    lat: 30.1669,
    lon: -96.3977,
    startingPayment: 1745,
    land: { low: 75000, high: 150000 },
    lotTypical: "1 – 10 acres",
    note: "Rolling country priced by Houston buyers. Deed restrictions here are the strictest we deal with — read them first.",
    labelSide: "s",
    dx: -8,
  },
  {
    slug: "mclennan",
    county: "McLennan",
    seat: "Waco",
    towns: ["Mart", "Riesel", "Moody", "Crawford", "Axtell"],
    lat: 31.5493,
    lon: -97.1467,
    startingPayment: 1595,
    land: { low: 55000, high: 110000 },
    lotTypical: "1 – 10 acres",
    note: "Big inventory outside the Waco city limits. Mart, Riesel, and Moody are where the numbers work.",
    labelSide: "w",
    dy: -3,
  },
  {
    slug: "gonzales",
    county: "Gonzales",
    seat: "Gonzales",
    towns: ["Nixon", "Waelder", "Smiley"],
    lat: 29.5027,
    lon: -97.4522,
    startingPayment: 1545,
    land: { low: 45000, high: 90000 },
    lotTypical: "2 – 20 acres",
    note: "South end of the radius and one of the last places with real acreage under $50k. Verify water-well depth.",
    labelSide: "e",
  },
  {
    slug: "comal",
    county: "Comal",
    seat: "New Braunfels",
    towns: ["Canyon Lake", "Bulverde", "Spring Branch", "Garden Ridge"],
    lat: 29.703,
    lon: -98.1245,
    startingPayment: 2065,
    land: { low: 120000, high: 260000 },
    lotTypical: "1/2 – 2 acres",
    note: "Most of this county is platted subdivisions with HOAs that exclude manufactured homes. We check the covenants first, always.",
    labelSide: "w",
  },
  {
    slug: "llano",
    county: "Llano",
    seat: "Llano",
    towns: ["Kingsland", "Buchanan Dam", "Tow", "Valley Spring"],
    lat: 30.7591,
    lon: -98.6753,
    startingPayment: 1845,
    land: { low: 85000, high: 180000 },
    lotTypical: "2 – 10 acres",
    note: "Lake country. Off-water tracts north of Llano are half the price of anything with a shoreline.",
    labelSide: "w",
  },
  {
    slug: "guadalupe",
    county: "Guadalupe",
    seat: "Seguin",
    towns: ["Marion", "Kingsbury", "McQueeney", "Geronimo"],
    lat: 29.5688,
    lon: -97.9647,
    startingPayment: 1755,
    land: { low: 75000, high: 150000 },
    lotTypical: "1 – 5 acres",
    note: "I-10 and SH-130 meet here, so it prices like San Antonio's edge. Kingsbury and the east side are the exception.",
    labelSide: "w",
  },
  {
    slug: "colorado",
    county: "Colorado",
    seat: "Columbus",
    towns: ["Eagle Lake", "Weimar", "Garwood"],
    lat: 29.7058,
    lon: -96.5397,
    startingPayment: 1615,
    land: { low: 60000, high: 120000 },
    lotTypical: "1 – 10 acres",
    note: "Flat, cleared, easy to set a home on. Check the flood map along the Colorado River bottoms before you buy.",
    labelSide: "e",
  },
  {
    slug: "austin",
    county: "Austin",
    seat: "Bellville",
    towns: ["Sealy", "Wallis", "Industry", "New Ulm"],
    lat: 29.9505,
    lon: -96.2572,
    startingPayment: 1725,
    land: { low: 70000, high: 145000 },
    lotTypical: "1 – 10 acres",
    note: "Houston commuters set the price along I-10. The Industry and New Ulm side is still country money.",
    labelSide: "e",
  },
  {
    slug: "lavaca",
    county: "Lavaca",
    seat: "Hallettsville",
    towns: ["Shiner", "Yoakum", "Moulton"],
    lat: 29.4441,
    lon: -96.9414,
    startingPayment: 1565,
    land: { low: 48000, high: 95000 },
    lotTypical: "2 – 15 acres",
    note: "Quiet county, almost no zoning, and acreage priced the way Fayette was a decade ago.",
    labelSide: "e",
  },
  {
    slug: "limestone",
    county: "Limestone",
    seat: "Groesbeck",
    towns: ["Mexia", "Thornton", "Kosse", "Coolidge"],
    lat: 31.5241,
    lon: -96.5344,
    startingPayment: 1445,
    land: { low: 32000, high: 65000 },
    lotTypical: "2 – 20 acres",
    note: "North edge of our radius. Land is cheap because nobody is looking, and the county lets you build.",
    labelSide: "e",
  },
  {
    slug: "grimes",
    county: "Grimes",
    seat: "Anderson",
    towns: ["Navasota", "Iola", "Bedias", "Todd Mission"],
    lat: 30.4877,
    lon: -95.9866,
    startingPayment: 1595,
    land: { low: 55000, high: 115000 },
    lotTypical: "1 – 10 acres",
    note: "Wooded acreage between Bryan and Houston. Budget for clearing and a longer driveway than the listing photos suggest.",
    labelSide: "e",
  },
  {
    slug: "san-saba",
    county: "San Saba",
    seat: "San Saba",
    towns: ["Richland Springs", "Cherokee", "Bend"],
    lat: 31.1935,
    lon: -98.7189,
    startingPayment: 1505,
    land: { low: 40000, high: 80000 },
    lotTypical: "5 – 40 acres",
    note: "Western edge of what we deliver to. Enormous parcels for the money, but plan on a well and a lot of caliche.",
    labelSide: "w",
  },
  {
    slug: "gillespie",
    county: "Gillespie",
    seat: "Fredericksburg",
    towns: ["Harper", "Stonewall", "Doss"],
    lat: 30.2752,
    lon: -98.872,
    startingPayment: 2015,
    land: { low: 110000, high: 240000 },
    lotTypical: "2 – 10 acres",
    note: "Wine-country pricing and the longest haul on the map. Harper and Doss are the only places the math still works.",
    labelSide: "w",
  },
  {
    slug: "leon",
    county: "Leon",
    seat: "Centerville",
    towns: ["Buffalo", "Normangee", "Jewett", "Oakwood"],
    lat: 31.2599,
    lon: -95.9788,
    startingPayment: 1435,
    land: { low: 30000, high: 62000 },
    lotTypical: "5 – 30 acres",
    note: "Timber and pasture at the far east edge of our radius. The cheapest acreage we haul to, if you do not mind the drive.",
    labelSide: "e",
  },
  {
    slug: "hamilton",
    county: "Hamilton",
    seat: "Hamilton",
    towns: ["Hico", "Evant", "Pottsville"],
    lat: 31.7025,
    lon: -98.1225,
    startingPayment: 1475,
    land: { low: 35000, high: 72000 },
    lotTypical: "2 – 20 acres",
    note: "Ranch country northwest of the radius. Long haul from the lot, but the land is still priced the way Burnet was a decade ago.",
    labelSide: "w",
  },
  {
    slug: "mills",
    county: "Mills",
    seat: "Goldthwaite",
    towns: ["Mullin", "Star", "Priddy"],
    lat: 31.4488,
    lon: -98.5717,
    startingPayment: 1485,
    land: { low: 35000, high: 75000 },
    lotTypical: "5 – 30 acres",
    note: "Big pastures and thin water. Get the well quoted before you sign anything out here.",
    labelSide: "w",
  },
  {
    slug: "bosque",
    county: "Bosque",
    seat: "Meridian",
    towns: ["Clifton", "Valley Mills", "Walnut Springs", "Iredell"],
    lat: 31.9227,
    lon: -97.6567,
    startingPayment: 1555,
    land: { low: 48000, high: 95000 },
    lotTypical: "2 – 20 acres",
    note: "North edge of the radius. The Iredell and Walnut Springs side is the affordable half of the county.",
    labelSide: "w",
  },
  {
    slug: "madison",
    county: "Madison",
    seat: "Madisonville",
    towns: ["Midway", "North Zulch", "Normangee"],
    lat: 30.9491,
    lon: -95.9116,
    startingPayment: 1475,
    land: { low: 35000, high: 72000 },
    lotTypical: "2 – 20 acres",
    note: "Easy county to permit in, and the acreage has not caught up to neighboring Grimes or Brazos yet.",
    labelSide: "s",
  },
  {
    slug: "waller",
    county: "Waller",
    seat: "Hempstead",
    towns: ["Waller", "Brookshire", "Prairie View", "Pattison"],
    lat: 30.098,
    lon: -96.0778,
    startingPayment: 1695,
    land: { low: 70000, high: 140000 },
    lotTypical: "1 – 10 acres",
    note: "Houston's western edge, and the prices show it. City ETJ rules along US-290 are strict — send us the parcel first.",
    labelSide: "e",
    dy: -3,
  },
  {
    slug: "kendall",
    county: "Kendall",
    seat: "Boerne",
    towns: ["Comfort", "Sisterdale", "Waring"],
    lat: 29.7947,
    lon: -98.732,
    startingPayment: 2115,
    land: { low: 130000, high: 280000 },
    lotTypical: "2 – 10 acres",
    note: "Boerne money, and nearly every subdivision here has covenants that exclude manufactured homes. The outlying tracts are the exception.",
    labelSide: "w",
  },
];

/** Every area, with mileage from the dealership computed, not typed by hand. */
export const AREAS: (Area & { miles: number })[] = RAW.map((a) => ({
  ...a,
  miles: Math.round(milesFromHQ(a.lat, a.lon)),
}));

export const CHEAPEST = AREAS.reduce((a, b) =>
  a.startingPayment <= b.startingPayment ? a : b
);

export const PAYMENT_FLOOR = CHEAPEST.startingPayment;
export const PAYMENT_CEILING = Math.max(...AREAS.map((a) => a.startingPayment));

export function areaBySlug(slug: string) {
  return AREAS.find((a) => a.slug === slug);
}

/**
 * Sequential scale for shading counties by starting payment.
 *
 * One hue, five steps, monotonically stepped in lightness so the map reads as a
 * magnitude rather than as five unrelated colors.
 *
 * The ramp runs **brightest at the cheapest end**. The quantity being encoded is
 * how easy a county is to get into, so the counties a shopper can actually
 * afford are the ones that carry weight on the map; running it the other way
 * made the priciest corner of the map the loudest thing on screen. Every
 * swatch is labelled with its band in the legend, so the direction is stated
 * rather than assumed, and each county also carries its price in figures.
 *
 * Even the darkest step stays clearly above `UNSERVED_FILL`, so "we deliver
 * here" never collapses into "we don't".
 *
 * Bands are round numbers rather than quantiles — a legend that reads
 * "under $1,500" is worth more to a shopper than equal-sized buckets.
 */
export const PRICE_TIERS = [
  { max: 1499, label: "Under $1,500", fill: "#4FA383" },
  { max: 1599, label: "$1,500–$1,599", fill: "#3F8A6E" },
  { max: 1799, label: "$1,600–$1,799", fill: "#33735B" },
  { max: 1999, label: "$1,800–$1,999", fill: "#2A5D4A" },
  { max: Infinity, label: "$2,000 and up", fill: "#224A3B" },
] as const;

/** Fill for land we do not deliver to: neutral, so it never reads as a tier. */
export const UNSERVED_FILL = "#1A1F22";
/** Fill for a county priced above the visitor's budget. */
export const OVER_BUDGET_FILL = "#1B211F";

export function tierOf(payment: number): number {
  const i = PRICE_TIERS.findIndex((t) => payment <= t.max);
  return i === -1 ? PRICE_TIERS.length - 1 : i;
}

export const tierFill = (payment: number) => PRICE_TIERS[tierOf(payment)].fill;

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

/** $28,000 → "$28k" */
export const shortMoney = (n: number) =>
  n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;

/** Counties sorted the way a shopper reads them: cheapest way in, first. */
export const BY_PRICE = [...AREAS].sort(
  (a, b) => a.startingPayment - b.startingPayment
);

/** The headline counties for the social preview image. */
export const OG_FEATURED = BY_PRICE.slice(0, 6);
