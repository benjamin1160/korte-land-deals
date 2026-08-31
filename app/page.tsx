import AreaMap from "./components/AreaMap";
import PreApprovalForm from "./components/PreApprovalForm";
import {
  AREAS,
  BY_PRICE,
  CHEAPEST,
  PAYMENT_ASSUMPTIONS,
  money,
  shortMoney,
} from "./lib/areas";
import { HQ, SERVICE_RADIUS_MI } from "./lib/geo";
import { ADDRESS_LINE, SITE } from "./lib/site";

const CHEAPEST_LAND = [...AREAS].sort((a, b) => a.land.low - b.land.low)[0];

const STEPS = [
  {
    n: "01",
    title: "Find your number",
    body: `Tap a county on the map. That figure is what it takes to get into a home there — the land payment is already inside it.`,
  },
  {
    n: "02",
    title: "Get pre-approved first",
    body: "Do this before you fall in love with a parcel. It takes minutes, it starts as a soft pull, and it tells you exactly how much land and how much house you can carry.",
  },
  {
    n: "03",
    title: "Pick the dirt",
    body: "Now go shop with a real budget. Send us the listing and we check the boring things that kill deals: legal access, septic and well, setbacks, flood zone, and whether the county will let a home sit there at all.",
  },
  {
    n: "04",
    title: "One loan, one closing",
    body: "We package the land and the home into a single loan, order the site work, set the home, and hand you keys to a place that is yours down to the property line.",
  },
];

const INCLUDED = [
  "The home itself",
  "The land, financed in the same loan",
  "Delivery and set within our radius",
  "Blocking, leveling, and tie-downs",
  "Taxes and insurance, escrowed",
];

const NOT_INCLUDED = [
  "Well, septic, or power if the lot has none",
  "Clearing, fill dirt, and driveway",
  "County impact and permit fees",
  "Your down payment",
];

const FAQ = [
  {
    q: "Can I really buy the land and the home together?",
    a: "Yes. That is the whole point of a land-and-home package: one loan, one payment, one closing. The catch is sequencing — the land has to be identified before we can put the deal together, because the lender is financing a specific parcel, not the idea of a parcel.",
  },
  {
    q: "So do I have to already own the land?",
    a: "No. You need it chosen, not owned. A signed contract or even a specific listing you have settled on is enough for us to start building the file. If you already own it free and clear, that equity usually becomes some or all of your down payment.",
  },
  {
    q: "Why do you push pre-approval so hard?",
    a: "Because land shopping without a number is how people waste a summer. Pre-approval tells you what you can actually carry, and it makes your offer on a parcel credible. It starts as a soft check and costs you nothing.",
  },
  {
    q: "How much do I need down?",
    a: "It depends on the program, your credit, and whether the land carries equity. Plenty of buyers land in the 5–20% range, and owning the lot already can shrink that a lot. Your pre-approval gives you the real figure instead of a guess.",
  },
  {
    q: "Can I put a doublewide on any piece of land?",
    a: "No, and this is where deals die. Zoning districts, minimum lot sizes, setbacks, deed restrictions, and flood zones all have opinions. Send us the parcel before you sign anything and we will check it.",
  },
  {
    q: "What does the land itself cost out there?",
    a: `It swings hard by county. Buildable lots start around ${shortMoney(
      CHEAPEST_LAND.land.low
    )} in ${CHEAPEST_LAND.county} County and run past ${shortMoney(
      Math.max(...AREAS.map((a) => a.land.high))
    )} in the Hill Country and the Austin metro. Every county card on the map shows its own range.`,
  },
  {
    q: "How long does the whole thing take?",
    a: "Most packages run 60 to 90 days from pre-approval to keys, and site work is usually the long pole — permits, septic, and power, not the home.",
  },
];

/**
 * Structured data: a local business that serves a 100-mile area, plus the FAQ.
 * Search engines use both — the service area drives local results, the FAQ can
 * surface as rich results.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE.url}#business`,
      name: SITE.brand,
      description: `Land and home packages financed as one loan across ${AREAS.length} Central Texas counties within ${SERVICE_RADIUS_MI} miles of ${HQ.city}.`,
      url: SITE.url,
      telephone: SITE.phone,
      email: SITE.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.street,
        addressLocality: SITE.city,
        addressRegion: SITE.state,
        postalCode: SITE.zip,
        addressCountry: "US",
      },
      geo: { "@type": "GeoCoordinates", latitude: HQ.lat, longitude: HQ.lon },
      areaServed: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: HQ.lat,
          longitude: HQ.lon,
        },
        geoRadius: SERVICE_RADIUS_MI * 1609.34,
      },
      makesOffer: AREAS.map((a) => ({
        "@type": "Offer",
        name: `Land and home package in ${a.county} County, TX`,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: a.startingPayment,
          priceCurrency: "USD",
          unitCode: "MON",
        },
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-flag text-sm font-black text-white">
              ★
            </span>
            <span className="font-display text-lg leading-none tracking-wide text-bone">
              {SITE.brand.toUpperCase()}
            </span>
          </a>
          <span className="hidden text-xs text-muted md:block">
            {HQ.city}, {HQ.state} · {SERVICE_RADIUS_MI}-mile delivery radius
          </span>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <a
              href={SITE.phoneHref}
              className="hidden text-sm font-semibold text-bone hover:text-gold sm:block"
            >
              {SITE.phone}
            </a>
            <a
              href="#pre-approval"
              className="rounded-lg bg-flag px-3.5 py-2 text-sm font-bold text-white transition hover:bg-[#ff5548] sm:px-4"
            >
              Get pre-approved
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* ── Hero: headline and the map itself, above the fold ── */}
        <section id="map" className="relative scroll-mt-16 overflow-hidden border-b border-line">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-flag/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-14">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.22em] text-flag">
              <span>
                {HQ.city}, {HQ.state}
              </span>
              <span className="text-line">/</span>
              <span className="text-muted">
                {AREAS.length} counties · {SERVICE_RADIUS_MI}-mile radius
              </span>
            </p>

            <div className="mt-5 grid gap-x-12 gap-y-6 lg:grid-cols-[1.05fr_1fr] lg:items-end">
              <h1 className="font-display text-[clamp(2.4rem,6.2vw,4.5rem)] leading-[0.92] uppercase text-bone">
                Own the dirt.
                <br />
                Own the house.
                <br className="sm:hidden" />
                <span className="whitespace-nowrap text-flag"> One loan.</span>
              </h1>

              <div>
                <p className="text-lg leading-relaxed text-muted">
                  No land yet? Fine. Tap any county — that number is what it
                  takes to get in there,{" "}
                  <span className="text-bone">land payment included</span>. From{" "}
                  <span className="font-bold tabular-nums text-gold">
                    {money(CHEAPEST.startingPayment)}/mo
                  </span>{" "}
                  in {CHEAPEST.county} County.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-row">
                  <a
                    href="#pre-approval"
                    className="inline-flex items-center justify-center rounded-xl bg-flag px-5 py-3.5 text-center text-[0.95rem] font-bold text-white transition hover:bg-[#ff5548] sm:px-6 sm:text-base"
                  >
                    Get pre-approved
                  </a>
                  <a
                    href="#how"
                    className="inline-flex items-center justify-center rounded-xl border border-bone/25 px-5 py-3.5 text-center text-[0.95rem] font-bold text-bone transition hover:border-bone/60 sm:px-6 sm:text-base"
                  >
                    How it works
                  </a>
                </div>

                <p className="mt-3 text-sm text-muted">
                  Or call{" "}
                  <a
                    href={SITE.phoneHref}
                    className="font-semibold text-bone underline decoration-flag underline-offset-4"
                  >
                    {SITE.phone}
                  </a>{" "}
                  · {SITE.hours}
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
            <AreaMap />
              <p className="mt-5 max-w-3xl text-xs leading-relaxed text-muted">
                Counties are shaded by starting payment; the red star sits on each
                county seat. {PAYMENT_ASSUMPTIONS}
              </p>
            </div>
          </div>
        </section>

        {/* ── The preface ── */}
        <section className="border-b border-line bg-panel/40">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <div className="flex flex-col gap-5 rounded-2xl border border-gold/30 bg-gold/[0.06] p-6 sm:flex-row sm:p-8">
              <p className="shrink-0 font-display text-xs uppercase tracking-[0.2em] text-gold sm:w-40">
                Read this first
              </p>
              <div className="space-y-3 text-base leading-relaxed text-bone">
                <p>
                  We can finance the <strong>land and the home together as one
                  loan</strong> — you do not need two lenders, two closings, or a
                  pile of cash for the lot.
                </p>
                <p className="text-muted">
                  The one thing we need from you: <strong className="text-bone">
                  the land has to be chosen before we can put the deal
                  together.</strong>{" "}Owning it already is great. Under contract
                  works. A specific listing you have settled on works. &ldquo;Somewhere
                  out past Elgin&rdquo; does not — that is a wish, not a parcel.
                </p>
                <p className="text-muted">
                  So start with the map: find your county and your number, get
                  pre-approved so you know what is real, then go pick the dirt. We
                  will vet it and build the package around it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how" className="scroll-mt-16 border-b border-line bg-panel/40">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-flag">
              How the deal comes together
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] text-bone">
              Four steps, in this order
            </h2>
            <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  className="rounded-2xl border border-line bg-ink/60 p-6 transition hover:border-bone/25"
                >
                  <p className="font-mono text-sm font-bold text-flag">{s.n}</p>
                  <h3 className="mt-3 font-display text-2xl uppercase leading-tight text-bone">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-ink/60 p-6">
                <h3 className="font-display text-xl uppercase text-bone">
                  In that payment
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-muted">
                  {INCLUDED.map((i) => (
                    <li key={i} className="flex gap-3">
                      <span aria-hidden className="text-gold">
                        ✓
                      </span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-ink/60 p-6">
                <h3 className="font-display text-xl uppercase text-bone">
                  Budget separately
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-muted">
                  {NOT_INCLUDED.map((i) => (
                    <li key={i} className="flex gap-3">
                      <span aria-hidden className="text-flag">
                        ·
                      </span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pre-approval ── */}
        <section id="pre-approval" className="scroll-mt-16 border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-flag">
                  Do this before you shop
                </p>
                <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] text-bone">
                  Get pre-approved
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted">
                  Ten minutes now saves you a season of looking at land you
                  cannot finance — or worse, land nobody can put a home on. You
                  get a real payment range, a down-payment target, and a
                  straight answer on what your credit supports.
                </p>
                <ul className="mt-7 space-y-3 text-sm text-bone">
                  {[
                    "Starts as a soft check — your score does not move",
                    "You shop land knowing your ceiling",
                    "Sellers take your offer seriously",
                    "We flag zoning and utility problems before you pay for them",
                  ].map((b) => (
                    <li key={b} className="flex gap-3">
                      <span aria-hidden className="text-flag">
                        ★
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-sm text-muted">
                  Rather talk to a person?{" "}
                  <a
                    href={SITE.phoneHref}
                    className="font-semibold text-bone underline decoration-flag underline-offset-4"
                  >
                    {SITE.phone}
                  </a>{" "}
                  · {SITE.hours}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
                <PreApprovalForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="scroll-mt-16 border-b border-line bg-panel/40">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] text-bone">
              Straight answers
            </h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-bone">
                    {f.q}
                    <span
                      aria-hidden
                      className="shrink-0 text-xl text-flag transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-8 text-sm leading-relaxed text-muted">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="border-b border-line">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24">
            <h2 className="mx-auto max-w-3xl font-display text-[clamp(2rem,6vw,4rem)] uppercase leading-[0.95] text-bone">
              The cheapest way in right now is{" "}
              <span className="text-gold">
                {money(BY_PRICE[0].startingPayment)}/mo
              </span>{" "}
              in {BY_PRICE[0].county} County
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
              Land and home, one loan, {BY_PRICE[0].miles} miles from{" "}
              {HQ.city}. Find out what you qualify for before somebody else
              buys the lot.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#pre-approval"
                className="inline-flex items-center justify-center rounded-xl bg-flag px-8 py-4 text-base font-bold text-white transition hover:bg-[#ff5548]"
              >
                Get pre-approved
              </a>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center rounded-xl border border-bone/25 px-8 py-4 text-base font-bold text-bone transition hover:border-bone/60"
              >
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-xl uppercase text-bone">
              {SITE.brand}
            </p>
            <p className="mt-1 text-sm text-muted">{ADDRESS_LINE}</p>
            <p className="mt-1 text-sm text-muted">
              Serving {AREAS.length} counties within {SERVICE_RADIUS_MI} miles
            </p>
          </div>
          <div className="text-sm text-muted">
            <a href={SITE.phoneHref} className="block font-semibold text-bone">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="block">
              {SITE.email}
            </a>
            <p className="mt-1">{SITE.hours}</p>
          </div>
        </div>
        <p className="mt-8 max-w-4xl text-xs leading-relaxed text-muted/80">
          Payment figures on this page are estimates for comparison between
          areas, not an offer to lend or a commitment to extend credit.{" "}
          {PAYMENT_ASSUMPTIONS} Land prices reflect recent asking prices for
          buildable parcels and move constantly. Zoning, minimum lot size,
          setbacks, flood zone, and utility availability vary parcel by parcel —
          confirm with us and with the county before you buy land.
        </p>
        <p className="mt-4 text-xs text-muted/60">
          © {new Date().getFullYear()} {SITE.brand}. All rights reserved.
        </p>
      </footer>
    </>
  );
}
