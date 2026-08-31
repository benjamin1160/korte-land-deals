import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { AREAS, CHEAPEST, money, areaBySlug } from "./lib/areas";
import { HQ, SERVICE_RADIUS_MI, starPath } from "./lib/geo";
import { pixelFor, serviceAreaDataUri } from "./lib/static-map";
import { SITE } from "./lib/site";

export const alt = `Map of ${AREAS.length} North Florida counties within ${SERVICE_RADIUS_MI} miles of ${HQ.city}, with starting monthly payments for land-and-home packages`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MAP_W = 600;
const MAP_H = size.height;

const BONE = "#F4F1E9";
const MUTED = "#93A09A";
const FLAG = "#FF3B2F";
const GOLD = "#FFC24A";

/** Counties called out by name on the preview, and where their label sits. */
const CALLOUTS: { slug: string; as?: string; place: "above" | "below"; dy?: number }[] =
  [
    { slug: "taylor", place: "above" },
    { slug: "suwannee", place: "above", dy: -28 },
    { slug: "dixie", place: "below" },
    { slug: "alachua", as: "Gainesville", place: "above" },
    { slug: "marion", place: "above" },
    { slug: "citrus", place: "below" },
    { slug: "st-johns", place: "above" },
    { slug: "flagler", place: "below" },
  ];

const starMark = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-11 -11 22 22"><path d="${starPath(
    0,
    0,
    10
  )}" fill="${FLAG}"/></svg>`
)}`;

export default async function Image() {
  const [anton, inter, interBold] = await Promise.all([
    readFile(join(process.cwd(), "assets/anton.ttf")),
    readFile(join(process.cwd(), "assets/inter-400.ttf")),
    readFile(join(process.cwd(), "assets/inter-700.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#070B0A",
          fontFamily: "Inter",
          color: BONE,
        }}
      >
        {/* ── Left: the pitch ── */}
        <div
          style={{
            width: size.width - MAP_W,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 48px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={starMark} width={26} height={26} alt="" />
            <div
              style={{
                display: "flex",
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              {SITE.brand.toUpperCase()}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Anton",
                fontSize: 82,
                lineHeight: 0.94,
                letterSpacing: 0.5,
              }}
            >
              <div style={{ display: "flex" }}>LAND + HOME.</div>
              <div style={{ display: "flex", color: FLAG }}>ONE LOAN.</div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                fontSize: 23,
                lineHeight: 1.35,
                color: MUTED,
                maxWidth: 480,
              }}
            >
              What it takes to get into a home on your own land — {AREAS.length}{" "}
              counties inside {SERVICE_RADIUS_MI} miles of {HQ.city}.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: MUTED,
                }}
              >
                FROM
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Anton",
                  fontSize: 76,
                  color: GOLD,
                }}
              >
                {money(CHEAPEST.startingPayment)}
              </div>
              <div style={{ display: "flex", fontSize: 26, color: MUTED }}>
                /mo
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 20, color: MUTED }}>
              {CHEAPEST.county} County · land and home in one payment
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                width: 46,
                height: 4,
                backgroundColor: FLAG,
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: 2.4,
                color: BONE,
              }}
            >
              SEE YOUR COUNTY. GET PRE-APPROVED.
            </div>
          </div>
        </div>

        {/* ── Right: the map ── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            width: MAP_W,
            height: MAP_H,
          }}
        >
          <img
            src={serviceAreaDataUri(MAP_W, MAP_H)}
            width={MAP_W}
            height={MAP_H}
            alt=""
          />

          {CALLOUTS.map(({ slug, as, place, dy = 0 }) => {
            const a = areaBySlug(slug);
            if (!a) return null;
            const p = pixelFor(a.lat, a.lon, MAP_W, MAP_H);
            const isHQ = slug === "alachua";
            return (
              <div
                key={slug}
                style={{
                  position: "absolute",
                  left: p.left - 66,
                  top: p.top + (place === "above" ? -54 : 14) + dy,
                  width: 132,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Anton",
                    fontSize: 27,
                    lineHeight: 1,
                    color: GOLD,
                  }}
                >
                  {money(a.startingPayment)}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: 3,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1.4,
                    color: isHQ ? GOLD : BONE,
                  }}
                >
                  {(as ?? a.county).toUpperCase()}
                </div>
              </div>
            );
          })}

          <div
            style={{
              position: "absolute",
              left: 26,
              top: MAP_H - 58,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 2,
                color: FLAG,
              }}
            >
              {SERVICE_RADIUS_MI}-MILE DELIVERY RADIUS
            </div>
            <div style={{ display: "flex", fontSize: 14, color: MUTED }}>
              {HQ.city}, {HQ.state}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: anton, style: "normal", weight: 400 },
        { name: "Inter", data: inter, style: "normal", weight: 400 },
        { name: "Inter", data: interBold, style: "normal", weight: 700 },
      ],
    }
  );
}
