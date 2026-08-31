/**
 * Map furniture that is not a county boundary.
 *
 * State lines and coastlines used to be hand-traced here; they now come for
 * free from the real county polygons in `county-shapes.generated.ts`, which
 * outline them far more accurately than a hand trace could. What is left is the
 * road network a Central Texas buyer navigates by — the two interstates plus
 * the two US highways that carry our deliveries — traced roughly through their
 * major exits. Enough for a local to orient themselves, not survey data.
 */

type Coord = readonly [number, number];

export const HIGHWAYS: readonly {
  id: string;
  label: string;
  labelAt: Coord;
  path: readonly Coord[];
}[] = [
  {
    id: "i35",
    label: "35",
    labelAt: [31.34, -97.24],
    path: [
      [29.42, -98.49],
      [29.7, -98.12],
      [29.88, -97.94],
      [30.09, -97.84],
      [30.27, -97.74],
      [30.51, -97.68],
      [30.63, -97.68],
      [30.82, -97.6],
      [30.95, -97.54],
      [31.06, -97.46],
      [31.1, -97.35],
      [31.24, -97.28],
      [31.55, -97.13],
      [32.01, -97.13],
    ],
  },
  {
    id: "i10",
    label: "10",
    labelAt: [29.66, -96.75],
    path: [
      [29.46, -98.42],
      [29.57, -97.96],
      [29.68, -97.65],
      [29.69, -97.31],
      [29.69, -97.11],
      [29.68, -96.9],
      [29.71, -96.54],
      [29.78, -96.16],
      [29.83, -95.94],
    ],
  },
  {
    id: "us79",
    label: "79",
    labelAt: [30.95, -96.53],
    path: [
      [30.51, -97.67],
      [30.54, -97.55],
      [30.57, -97.41],
      [30.61, -97.2],
      [30.65, -97.0],
      [30.71, -96.87],
      [30.88, -96.59],
      [31.03, -96.48],
      [31.46, -96.06],
    ],
  },
  {
    id: "us290",
    label: "290",
    labelAt: [30.19, -96.72],
    path: [
      [30.24, -97.72],
      [30.34, -97.56],
      [30.35, -97.37],
      [30.21, -97.11],
      [30.18, -96.94],
      [30.18, -96.6],
      [30.17, -96.4],
      [30.1, -96.08],
    ],
  },
];
