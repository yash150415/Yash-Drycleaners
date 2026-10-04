# Yash Dry Cleaners — Bhavnagar

Single-page marketing + booking site for a local dry-cleaning shop: ten services with photos, a drag-to-compare before/after, the real counter price list (photo card per garment + instant estimator), a gallery, reviews, FAQs, and a 4-step pickup booking flow that hands off to WhatsApp.

**Stack:** React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · lucide-react · vite-plugin-singlefile (deploys as one HTML file on Netlify, with every photo inlined).

## Develop & deploy

```bash
npm install
npm run dev              # local dev server
npm run build            # production build → dist/
npm run preview          # preview the production build
npm run typecheck        # tsc --noEmit
npm run optimize-images  # shrink everything in images/ (needs ImageMagick)
```

Netlify picks up `netlify.toml` automatically (build `dist`, SPA fallback, long-cache headers).

## Sections on the page

Hero (shop photo + promises) → Services (10 photo cards) → **Before & After** (draggable comparison + treatment notes) → How it works (4 photo steps) → **Prices** (3 photo categories — Men's Wear, Women's Wear, Household & Home Care — every line with its own photo, plus the instant estimator) → Gallery (masonry + lightbox) → Reviews → Booking (4 steps → WhatsApp) → FAQ → Footer (hours, address, areas).

## Swapping in real photos (zero code changes)

**Drop photos into the project-root `images/` folder** — that's the whole workflow. `src/lib/images.ts` auto-imports everything there and matches it to slots. Name matching is forgiving (case, spaces, `_`, `-`, `&` are ignored):

```
shop-front.jpg    interior.jpg     owner.jpg        saree-care.jpg
steam-press.jpg   suit.jpg         blanket.jpg      curtain.jpg
carpet.jpg        dry-cleaning.jpg wash-fold.jpg    trouser.jpg
shirt.jpg         pickup-delivery.jpg               packaging.jpg
stain-before.png  stain-after.png
```

Any of `.webp .avif .jpg .jpeg .png` works (`.webp` wins when a slot has several). Slots without a photo fall back to the bundled SVG illustrations (`src/assets/images/`) via the `<Img>` component — the site never shows a broken image.

Recommended sizes: service tiles ≈ 1100×880, `saree-care` 720×1290 portrait, `shop-front` 1100×600, `owner` 720×720, before/after 900×675, gallery tiles vary (they are cropped by `object-fit`).

The price cards reuse the same photos: each price line points at a slot through `PriceItem.slot` (shirt → `shirt.jpg`, suit → `suit.jpg`, blanket → `blanket.jpg` …), each category has a headline photo (`PriceCategory.slot`) plus a 3-tile strip (`PriceCategory.gallery`). Replace a file in `images/` and the price section updates with it — no code change.

### Before / after photos

The comparison slider needs **two separate files in the same framing**: `images/stain-before.png` (the stained garment) and `images/stain-after.png` (after cleaning). They must line up — shoot both from the same distance and angle before and after cleaning. Use **PNG** for these two so fine fabric detail and colour stay exact.

`images/logo.png` is only used as favicon material; the WhatsApp/Twitter preview is `public/og-image.jpg` (1200×630) — replace it with a real shop photo when you have one, keeping the same file name.

After adding or replacing photos, run:

```bash
npm run optimize-images && npm run build
```

## Where things live

| Path | Purpose |
| --- | --- |
| `src/lib/business.ts` | **Single source of truth** — contact info, hours, services, the real price list, FAQs, reviews, service areas, open/closed status |
| `src/lib/images.ts` | Auto-imports `images/`, matches files to slots, exposes `<Img slot="…">` lookups |
| `src/lib/bookingBus.ts` | Cross-component signals: service preselect + estimate ticket (sessionStorage + events) |
| `src/components/BeforeAfter.tsx` | Draggable before/after slider (`stain-before.png` / `stain-after.png`) |
| `src/components/Pricing.tsx` | Price table + interactive estimator → attaches an itemised ticket to the booking |
| `src/components/Booking.tsx` | 4-step pickup form → builds a WhatsApp message, with copy fallback |
| `src/components/Gallery.tsx` | Masonry gallery with keyboard-navigable lightbox |
| `src/index.css` | Tailwind 4 `@theme` design tokens + component layer (buttons, inputs, ticket motif) |
| `public/og-image.jpg`, `public/logo.png`, `public/apple-touch-icon.png` | Social preview + icons |
| `contact-sheet.html` | Scratch page for eyeballing the files in `images/` |

## Editing prices or services

Edit `PRICE_CATEGORIES` / `SERVICES` in `src/lib/business.ts` only — the price table, estimator, service badges, booking hints, booking-service chips, FAQs and the footer all read from there. Three kinds of price line are supported:

| Field | Renders as | Estimator |
| --- | --- | --- |
| `price: 50, unit: "per piece"` | `₹50 per piece` | totals at ₹50 |
| `from: 150, unit: "per piece"` | `from ₹150 per piece` (the “starting ₹…” lines) | totals at the starting rate |
| `quote: true` | `Ask for Quote` | added to the ticket as a quote line, not totalled |

The current card mirrors the printed rate list at the counter: **Men's Wear** (shirt ₹50, t-shirt ₹50, pant/trouser ₹50, pant + shirt ₹60, suit 2pc ₹150, sherwani ₹200), **Women's Wear** (saree from ₹150, silk saree from ₹250, lehenga from ₹250, kurtis from ₹120, salwar suit from ₹180, chiffon & georgette ₹200, embroidered wear ₹200, designer dress from ₹250, dupatta from ₹80, blouse from ₹100) and **Household & Home Care** (blanket ₹250, quilt/razai ₹250, curtain per panel — quote, carpet cleaning — quote). `SERVICES[*].from` feeds the “₹x+” badges on the service cards, so keep the two in sync.

## Deployment notes

- The build inlines all CSS, JS **and photos** into `dist/index.html`. Keep photos optimised (`npm run optimize-images`) so the page stays light.
- `netlify.toml` sets the SPA fallback; all navigation is in-page anchors, so refreshes work anywhere.
