"use client";

import { useMemo, useState } from "react";
import {
  AREAS,
  BY_PRICE,
  OVER_BUDGET_FILL,
  PAYMENT_CEILING,
  PAYMENT_FLOOR,
  PRICE_TIERS,
  UNSERVED_FILL,
  money,
  shortMoney,
  tierFill,
  type Area,
} from "../lib/areas";
import { COUNTY_SHAPES } from "../lib/county-shapes.generated";
import { HQ, SERVICE_RADIUS_MI, VIEW, project, starPath, toPath } from "../lib/geo";
import { HIGHWAYS } from "../lib/map-shapes";

const ROADS = HIGHWAYS.map((h) => ({
  ...h,
  d: toPath(h.path),
  at: project(h.labelAt[0], h.labelAt[1]),
}));

const PLACED = AREAS.map((a) => ({ ...a, ...project(a.lat, a.lon) }));

/** County outlines split by whether we price them, so they can be layered. */
const SERVED = COUNTY_SHAPES.flatMap((c) => {
  const area = c.slug ? PLACED.find((a) => a.slug === c.slug) : undefined;
  return area ? [{ ...c, area }] : [];
});
const CONTEXT = COUNTY_SHAPES.filter((c) => !c.slug);

const WATER = "#03080F";
const INK = "#0A1412";

/** Where a marker's two label lines sit, relative to its star. */
function labelLayout(side: Area["labelSide"]) {
  switch (side) {
    case "e":
      return { anchor: "start" as const, px: 5.5, py: -0.2, nx: 5.5, ny: 4.2 };
    case "w":
      return { anchor: "end" as const, px: -5.5, py: -0.2, nx: -5.5, ny: 4.2 };
    case "n":
      return { anchor: "middle" as const, px: 0, py: -8.6, nx: 0, ny: -4.2 };
    case "s":
      return { anchor: "middle" as const, px: 0, py: 8, nx: 0, ny: 12.4 };
  }
}

export default function AreaMap() {
  const [selected, setSelected] = useState("dixie");
  const [hovered, setHovered] = useState<string | null>(null);
  const [budget, setBudget] = useState(PAYMENT_CEILING);

  const active = useMemo(
    () => PLACED.find((a) => a.slug === selected) ?? PLACED[0],
    [selected]
  );
  const affordable = PLACED.filter((a) => a.startingPayment <= budget);
  const filtering = budget < PAYMENT_CEILING;
  const activeShape = SERVED.find((c) => c.slug === selected);
  const hoveredShape = SERVED.find((c) => c.slug === hovered);

  return (
    <div className="flex flex-col gap-4">
      {/* Budget filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-panel/70 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
        <label
          htmlFor="budget-filter"
          className="shrink-0 text-sm font-semibold text-bone"
        >
          What can you pay a month?
        </label>
        <input
          id="budget-filter"
          type="range"
          min={PAYMENT_FLOOR - 75}
          max={PAYMENT_CEILING}
          step={25}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="h-2 w-full grow cursor-pointer appearance-none rounded-full bg-white/10 accent-flag"
          aria-describedby="budget-readout"
        />
        <p
          id="budget-readout"
          className="shrink-0 text-sm text-muted"
          aria-live="polite"
        >
          <span className="text-base font-bold tabular-nums text-gold">
            {filtering ? `${money(budget)}/mo` : "Show everything"}
          </span>
          <span className="ml-2">
            {affordable.length} of {PLACED.length} counties
          </span>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_21rem]">
        {/* ── The map ── */}
        <figure className="relative -mx-4 overflow-hidden border-y border-line bg-[#03080F] sm:mx-0 sm:rounded-2xl sm:border">
          <svg
            viewBox={VIEW.viewBox}
            className="block w-full"
            role="img"
            aria-label={`Map of ${PLACED.length} Florida counties within ${SERVICE_RADIUS_MI} miles of ${HQ.city}, shaded and labelled by starting monthly payment.`}
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
                x={VIEW.minX}
                y={VIEW.minY}
              >
                <path
                  d="M10 0 L0 0 0 10"
                  fill="none"
                  stroke="#F4F1E9"
                  strokeOpacity="0.04"
                  strokeWidth="0.35"
                />
              </pattern>
              <filter id="starGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="2.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Water, then land drawn as real counties on top of it */}
            <rect
              x={VIEW.minX}
              y={VIEW.minY}
              width={VIEW.width}
              height={VIEW.height}
              fill={WATER}
            />

            {/* Counties we do not deliver to: context, not offers */}
            <g stroke={WATER} strokeWidth="0.35">
              {CONTEXT.map((c) => (
                <path
                  key={`${c.state}-${c.name}`}
                  d={c.d}
                  fill={c.state === "GA" ? "#15181A" : UNSERVED_FILL}
                />
              ))}
            </g>

            {/* Counties we price, shaded by starting payment */}
            <g stroke={INK} strokeWidth="0.35">
              {SERVED.map((c) => {
                const dim = c.area.startingPayment > budget;
                const isHot = c.slug === selected || c.slug === hovered;
                return (
                  <path
                    key={c.slug}
                    d={c.d}
                    fill={dim ? OVER_BUDGET_FILL : tierFill(c.area.startingPayment)}
                    className="cursor-pointer outline-none"
                    fillOpacity={dim ? 0.9 : isHot ? 1 : 0.92}
                    tabIndex={0}
                    role="button"
                    aria-pressed={c.slug === selected}
                    aria-label={`${c.area.county} County, ${c.area.miles} miles, from ${money(
                      c.area.startingPayment
                    )} a month`}
                    onClick={() => setSelected(c.slug!)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(c.slug!);
                      }
                    }}
                    onMouseEnter={() => setHovered(c.slug)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(c.slug)}
                    onBlur={() => setHovered(null)}
                  />
                );
              })}
            </g>

            {/* Everything below is decoration — never swallow a click */}
            <g pointerEvents="none">
              <rect
                x={VIEW.minX}
                y={VIEW.minY}
                width={VIEW.width}
                height={VIEW.height}
                fill="url(#grid)"
              />

              {/* Selected and hovered outlines, re-stroked above every fill */}
              {activeShape && (
                <path
                  d={activeShape.d}
                  fill="none"
                  stroke="#FF3B2F"
                  strokeOpacity="0.95"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              )}
              {hoveredShape && hovered !== selected && (
                <path
                  d={hoveredShape.d}
                  fill="none"
                  stroke="#F4F1E9"
                  strokeOpacity="0.6"
                  strokeWidth="0.9"
                  strokeLinejoin="round"
                />
              )}

              <text
                x={project(30.95, -83.15).x}
                y={project(30.95, -83.15).y}
                className="fill-bone/30 font-sans"
                fontSize="4.4"
                letterSpacing="1.2"
              >
                GEORGIA
              </text>

              {/* Interstates */}
              <g fill="none" stroke="#F4F1E9" strokeOpacity="0.14" strokeWidth="0.9">
                {ROADS.map((r) => (
                  <path key={r.id} d={r.d} />
                ))}
              </g>
              {ROADS.map((r) => (
                <g key={`${r.id}-label`}>
                  <rect
                    x={r.at.x - 3.4}
                    y={r.at.y - 2.6}
                    width="6.8"
                    height="5.2"
                    rx="1.4"
                    fill={INK}
                    stroke="#F4F1E9"
                    strokeOpacity="0.2"
                    strokeWidth="0.4"
                  />
                  <text
                    x={r.at.x}
                    y={r.at.y + 1.3}
                    textAnchor="middle"
                    fontSize="3.6"
                    className="fill-bone/45 font-sans"
                  >
                    {r.label}
                  </text>
                </g>
              ))}

              {/* Distance rings */}
              {[25, 50, 75].map((r) => (
                <circle
                  key={r}
                  r={r}
                  fill="none"
                  stroke="#F4F1E9"
                  strokeOpacity="0.11"
                  strokeWidth="0.5"
                  strokeDasharray="2 3"
                />
              ))}
              <circle
                r={SERVICE_RADIUS_MI}
                fill="none"
                stroke="#FF3B2F"
                strokeOpacity="0.6"
                strokeWidth="1.1"
                strokeDasharray="6 3.5"
              />
              <text
                x={-0.78 * 50}
                y={0.63 * 50}
                textAnchor="middle"
                fontSize="3.8"
                letterSpacing="0.8"
                className="fill-bone/35 font-sans"
              >
                50 MILES
              </text>
              <text
                x={-0.72 * (SERVICE_RADIUS_MI + 18)}
                y={0.69 * (SERVICE_RADIUS_MI + 18)}
                textAnchor="middle"
                fontSize="4.6"
                letterSpacing="0.8"
                className="fill-flag/85 font-sans font-bold"
              >
                100 MILES
              </text>
              <text
                x={-0.72 * (SERVICE_RADIUS_MI + 18)}
                y={0.69 * (SERVICE_RADIUS_MI + 18) + 5.6}
                textAnchor="middle"
                fontSize="3.4"
                letterSpacing="0.5"
                className="fill-flag/60 font-sans"
              >
                WE DELIVER TO HERE
              </text>

              {/* Dealership */}
              <circle r="7" fill="#FFC24A" fillOpacity="0.14" />
              <circle r="2.6" fill="#FFC24A" />
              <circle
                r="4.6"
                fill="none"
                stroke="#FFC24A"
                strokeOpacity="0.7"
                strokeWidth="0.6"
              />

              {/* Stars and price labels, above every fill */}
              {PLACED.map((a) => {
                const dim = a.startingPayment > budget;
                const isActive = a.slug === selected;
                const isHot = isActive || a.slug === hovered;
                const L = labelLayout(a.labelSide);
                return (
                  <g
                    key={a.slug}
                    transform={`translate(${a.x.toFixed(2)} ${a.y.toFixed(2)})`}
                    className={dim ? "opacity-40" : "opacity-100"}
                  >
                    {isActive && (
                      <circle
                        r="8.5"
                        fill="none"
                        stroke="#FF3B2F"
                        strokeOpacity="0.55"
                        strokeWidth="0.8"
                        className="animate-ping-slow origin-center"
                      />
                    )}
                    <path
                      d={starPath(0, 0, isHot ? 4.4 : 3.4)}
                      fill={dim ? "#7C8A85" : "#FF3B2F"}
                      stroke={INK}
                      strokeWidth="0.5"
                      filter={isHot ? "url(#starGlow)" : undefined}
                      className="transition-all"
                    />
                    {/* Haloed so labels stay legible over any county shade */}
                    <g
                      transform={`translate(${a.dx ?? 0} ${a.dy ?? 0})`}
                      stroke={INK}
                      strokeWidth="0.9"
                      strokeOpacity="0.85"
                      strokeLinejoin="round"
                      paintOrder="stroke"
                      className={isActive ? "" : "hidden sm:block"}
                    >
                      <text
                        x={L.px}
                        y={L.py}
                        textAnchor={L.anchor}
                        className={`font-sans text-[6.6px] font-bold tabular-nums sm:text-[4.6px] ${
                          isHot ? "fill-gold" : "fill-gold/90"
                        }`}
                      >
                        {money(a.startingPayment)}
                        <tspan className="fill-bone/50 text-[4px] sm:text-[2.9px]">
                          /mo
                        </tspan>
                      </text>
                      <text
                        x={L.nx}
                        y={L.ny}
                        textAnchor={L.anchor}
                        letterSpacing="0.3"
                        className={`text-[4.4px] sm:text-[3.1px] ${
                          isHot ? "fill-bone" : "fill-bone/65"
                        }`}
                      >
                        {a.county.toUpperCase()}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Legend: the sequential scale as one bar, then the marks */}
          <figcaption className="border-t border-line px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Shaded by starting payment
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-0.5 gap-y-2">
              {PRICE_TIERS.map((t) => (
                <li key={t.label} className="min-w-[5.5rem] flex-1">
                  <span
                    aria-hidden
                    className="block h-2.5 rounded-sm"
                    style={{ backgroundColor: t.fill }}
                  />
                  <span className="mt-1 block text-[0.7rem] leading-tight text-muted">
                    {t.label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-2.5 text-xs text-muted">
              <span className="inline-flex items-center gap-2">
                <svg viewBox="-6 -6 12 12" className="h-3.5 w-3.5">
                  <path d={starPath(0, 0, 5.5)} fill="#FF3B2F" />
                </svg>
                County seat
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                Our lot in {HQ.city}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-0 w-5 border-t-2 border-dashed border-flag/70" />
                {SERVICE_RADIUS_MI}-mile delivery radius
              </span>
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-3 w-5 rounded-sm ring-1 ring-inset ring-white/10"
                  style={{ backgroundColor: UNSERVED_FILL }}
                />
                Not served
              </span>
            </div>
          </figcaption>
        </figure>

        {/* ── Detail card ── */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-line bg-panel p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flag">
              {active.miles === 0 ? "Right here" : `${active.miles} miles out`}
            </p>
            <h3 className="mt-1 font-display text-3xl leading-none text-bone">
              {active.county} County
            </h3>
            <p className="mt-1 text-sm text-muted">
              {[active.seat, ...active.towns].slice(0, 4).join(" · ")}
            </p>

            <div className="mt-5 rounded-xl bg-flag/10 p-4 ring-1 ring-flag/25">
              <p className="text-xs uppercase tracking-wider text-bone/70">
                {active.lotTypical} + doublewide, one loan
              </p>
              <p className="text-4xl font-bold tabular-nums leading-tight text-gold">
                {money(active.startingPayment)}
                <span className="text-base font-normal text-bone/60">/mo</span>
              </p>
              <p className="text-xs text-bone/55">estimated starting payment</p>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3 border-b border-line pb-2">
                <dt className="text-muted">Typical lot price</dt>
                <dd className="tabular-nums text-bone">
                  {shortMoney(active.land.low)} – {shortMoney(active.land.high)}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-line pb-2">
                <dt className="text-muted">Parcel size</dt>
                <dd className="text-bone">{active.lotTypical}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">From our lot</dt>
                <dd className="text-bone">{active.miles} miles</dd>
              </div>
            </dl>

            <p className="mt-4 text-sm leading-relaxed text-muted">{active.note}</p>

            <a
              href="#pre-approval"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-flag px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#ff5548]"
            >
              Get pre-approved for {active.county} County
            </a>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3">
            {[
              ["Counties served", String(PLACED.length)],
              ["Cheapest way in", `${money(BY_PRICE[0].startingPayment)}/mo`],
              ["Lots from", shortMoney(Math.min(...PLACED.map((a) => a.land.low)))],
              ["Loans needed", "1"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line bg-panel/60 p-3">
                <dt className="text-[0.7rem] uppercase tracking-wider text-muted">
                  {k}
                </dt>
                <dd className="text-xl font-bold tabular-nums text-bone">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {/* ── Full price list ── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
          Every county, cheapest way in first
        </h3>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {BY_PRICE.map((a) => {
            const dim = a.startingPayment > budget;
            const isActive = a.slug === selected;
            return (
              <li key={a.slug}>
                <button
                  type="button"
                  onClick={() => setSelected(a.slug)}
                  onMouseEnter={() => setHovered(a.slug)}
                  onMouseLeave={() => setHovered(null)}
                  aria-pressed={isActive}
                  className={`flex w-full items-stretch gap-2.5 rounded-xl border p-3 text-left transition ${
                    isActive
                      ? "border-flag bg-flag/10"
                      : "border-line bg-panel/60 hover:border-bone/25"
                  } ${dim ? "opacity-40" : ""}`}
                >
                  <span
                    aria-hidden
                    className="w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: tierFill(a.startingPayment) }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-bone">
                      {a.county}
                    </span>
                    <span className="block text-lg font-bold tabular-nums text-gold">
                      {money(a.startingPayment)}
                      <span className="text-[0.6em] font-normal text-bone/50">
                        /mo
                      </span>
                    </span>
                    <span className="block text-xs text-muted">{a.miles} mi</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
