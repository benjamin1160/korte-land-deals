# Local land + home price map

A landing page for a Gainesville, FL dealership: an interactive map of every
county inside a 100-mile delivery radius, each marked with a red star and the
estimated monthly payment to get into a home **on land you own** there.

The pitch it makes, in order: here is what your county costs → land and home are
financed as **one loan** → but you have to pick the parcel before we can build
the deal → so get pre-approved first.

## Editing the numbers

Everything a shopper sees comes from **`app/lib/areas.ts`** — the map, the county
list, the detail card, the social preview image, and the structured data. Each
county carries its starting payment, typical lot price range, parcel size, and a
line of local context.

Mileage is not typed in; it is computed from the county's coordinates with a
great-circle formula, so it can never drift out of sync with the map.

Two other files worth knowing:

| File | What it holds |
| --- | --- |
| `app/lib/site.ts` | Brand, phone, email, hours, canonical URL. **The phone number is a placeholder.** |
| `app/lib/areas.ts` | Pricing, land ranges, and `PAYMENT_ASSUMPTIONS` (the disclaimer text) |

If you change payment assumptions — rate, term, down payment — update
`PAYMENT_ASSUMPTIONS` too. It is printed under the map and in the footer, and it
is the thing that keeps the estimates honest.

## Where the leads go

The pre-approval form posts to a Server Action in `app/actions.ts`. Set
`LEAD_WEBHOOK_URL` to forward each lead as JSON to your CRM:

```bash
LEAD_WEBHOOK_URL="https://services.leadconnectorhq.com/hooks/..."
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"   # used for canonical + OG URLs
```

Without it, leads are validated and logged to the server console rather than
dropped, so nothing is lost while the integration is being wired up.

## The map

The map is the page — it sits in the hero, above the fold, and everything else
supports it.

`app/lib/geo.ts` projects latitude/longitude into a flat plane where **one SVG
unit equals one mile**, which is why the service area is drawn as `r={100}`.
Across the field we render, that projection stays within half a mile of true
great-circle distance.

Counties are real US Census boundaries, not traced by hand. They are baked into
`app/lib/county-shapes.generated.ts` as SVG paths already projected into map
units, so the app never parses GeoJSON. Regenerate them with:

```bash
curl -o counties.json \
  https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json
python3 scripts/generate-county-shapes.py counties.json
```

Because the county polygons carry the true coastline, no hand-traced coast is
needed; `app/lib/map-shapes.ts` is down to the interstates alone.

Each served county is shaded by its starting payment on a five-step scale
(`PRICE_TIERS` in `areas.ts`). The ramp is **brightest at the cheapest end** —
the quantity being encoded is how easy a county is to get into, and running it
the other way made the priciest corner of the state the loudest thing on screen.
Every swatch is labelled with its band, and each county also carries its price in
figures, so the direction is stated rather than inferred.

The social preview image (`app/opengraph-image.tsx`) renders the same data
through `next/og`. It draws the map as an inline SVG with no `<text>` in it —
that pipeline has no fonts for embedded SVG — and composes the labels on top.
Fonts for it are checked into `assets/` as small subsets so builds need no
network.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # also renders the OG image
npm run lint
```
