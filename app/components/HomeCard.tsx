import Image from "next/image";

import type { Home } from "../lib/homes";

/** One home on the lot: photo, specs, floor plan, and a strip of interiors. */
export default function HomeCard({ home: h }: { home: Home }) {
  const specs = [
    { label: "Beds", value: h.beds },
    { label: "Baths", value: h.baths },
    { label: "Sq. ft.", value: h.sqft.toLocaleString("en-US") },
    { label: "Feet", value: h.size },
  ];

  return (
    <article
      id={`home-${h.slug}`}
      className="overflow-hidden rounded-2xl border border-line bg-panel"
    >
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-full">
          <Image
            src={h.hero.src}
            alt={h.hero.alt}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            {h.maker} · {h.series} · {h.sections}
          </p>
          <h3 className="mt-2 font-display text-4xl uppercase leading-none text-bone">
            {h.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-muted">Model {h.model}</p>

          <dl className="mt-6 grid grid-cols-4 gap-2">
            {specs.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-line bg-ink/60 px-2 py-3 text-center"
              >
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted">
                  {s.label}
                </dt>
                <dd className="mt-1 whitespace-nowrap font-display text-lg tabular-nums text-gold sm:text-2xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-sm leading-relaxed text-muted">{h.blurb}</p>

          <ul className="mt-5 space-y-2 text-sm text-bone">
            {h.highlights.map((x) => (
              <li key={x} className="flex gap-3">
                <span aria-hidden className="text-flag">
                  ★
                </span>
                {x}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#pre-approval"
              className="inline-flex items-center justify-center rounded-xl bg-flag px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff5548]"
            >
              Put {h.name.replace(/^The /, "the ")} on your land
            </a>
            <a
              href={h.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-bone/25 px-5 py-3 text-sm font-bold text-bone transition hover:border-bone/60"
            >
              Full specs ↗
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-t border-line p-4 sm:p-6 lg:grid-cols-[1fr_1.25fr]">
        <figure className="rounded-xl bg-white p-3">
          <Image
            src={h.floorPlan.src}
            alt={h.floorPlan.alt}
            placeholder="blur"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="h-auto w-full"
          />
          <figcaption className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
            Floor plan · {h.size} ft
          </figcaption>
        </figure>

        <ul className="grid content-center grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {h.gallery.map((p) => (
            <li
              key={p.src.src}
              className="relative aspect-[16/9] overflow-hidden rounded-xl border border-line"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1280px) 15vw, (min-width: 640px) 30vw, 50vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>

      <p className="border-t border-line px-6 py-3 text-xs text-muted/80">
        Photos may show optional features. Floor plans, specs, and features vary
        by state and are subject to change.
      </p>
    </article>
  );
}
