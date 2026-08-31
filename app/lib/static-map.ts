import { AREAS, UNSERVED_FILL, tierFill } from "./areas";
import { COUNTY_SHAPES } from "./county-shapes.generated";
import { SERVICE_RADIUS_MI, project, starPath, windowFor } from "./geo";

/**
 * A flat SVG of the service area, as a string.
 *
 * Used for the social preview image, which is rendered by satori/resvg — that
 * pipeline has no fonts loaded for embedded SVG, so this deliberately contains
 * **no `<text>`**. Labels are composed on top of it as regular elements.
 */
export function serviceAreaSvg(width: number, height: number): string {
  const win = windowFor(width, height);
  const priceOf = (slug: string | null) =>
    slug ? AREAS.find((a) => a.slug === slug)?.startingPayment : undefined;

  const counties = COUNTY_SHAPES.map((c) => {
    const payment = priceOf(c.slug);
    const fill =
      payment !== undefined
        ? tierFill(payment)
        : c.state === "GA"
          ? "#15181A"
          : UNSERVED_FILL;
    return `<path d="${c.d}" fill="${fill}" stroke="#0A1412" stroke-width="0.35"/>`;
  }).join("");

  const stars = AREAS.map((a) => {
    const p = project(a.lat, a.lon);
    return `<path d="${starPath(p.x, p.y, 4.6)}" fill="#FF3B2F" stroke="#0A1412" stroke-width="0.6"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${win.minX} ${win.minY} ${win.width} ${win.height}" preserveAspectRatio="none">
  <rect x="${win.minX}" y="${win.minY}" width="${win.width}" height="${win.height}" fill="#03080F"/>
  ${counties}
  <circle cx="0" cy="0" r="50" fill="none" stroke="#F4F1E9" stroke-opacity="0.12" stroke-width="0.6" stroke-dasharray="2 3"/>
  <circle cx="0" cy="0" r="${SERVICE_RADIUS_MI}" fill="none" stroke="#FF3B2F" stroke-opacity="0.75" stroke-width="1.4" stroke-dasharray="7 4"/>
  ${stars}
  <circle cx="0" cy="0" r="8" fill="#FFC24A" fill-opacity="0.18"/>
  <circle cx="0" cy="0" r="3.4" fill="#FFC24A"/>
</svg>`;
}

/** The same SVG as an inline data URI. */
export function serviceAreaDataUri(width: number, height: number): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(serviceAreaSvg(width, height))}`;
}

/** Where an area lands, in pixels, inside a `width × height` render of the map. */
export function pixelFor(
  lat: number,
  lon: number,
  width: number,
  height: number
): { left: number; top: number } {
  const p = project(lat, lon);
  const win = windowFor(width, height);
  return {
    left: ((p.x - win.minX) / win.width) * width,
    top: ((p.y - win.minY) / win.height) * height,
  };
}
