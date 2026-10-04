# Yash Dry Cleaners — Bhavnagar

Single-page marketing + booking site for a local dry-cleaning shop: services, real price list, an instant price estimator, and a 4-step pickup booking flow that hands off to WhatsApp.

**Stack:** React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · lucide-react · vite-plugin-singlefile (deploys as one HTML file on Netlify).

## Develop & deploy

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

Netlify picks up `netlify.toml` automatically (build `dist`, SPA fallback).

## Swapping in real photos (zero code changes)

**Drop photos into the project-root `images/` folder** — that's the whole workflow. `src/lib/images.ts` auto-imports everything there and matches it to slots. Name matching is forgiving (case, spaces, `_`, `-`, `&` are ignored):

```
shop-front.jpg    owner.jpg        saree-care.jpg
steam-press.jpg   suit.jpg         blanket.jpg
curtain.jpg       carpet.jpg       dry-cleaning.jpg
wash-fold.webp    trouser.webp     shirt.jpg
stain-before.jpg  stain-after.jpg
```

Any of `.webp .avif .jpg .jpeg .png` works (`.webp` wins when a slot has several). Slots with no photo fall back to the bundled SVG illustrations (`src/assets/images/`) via the `<Img>` component — the site never shows a broken image.

Recommended sizes: service tiles ≈ 640×420, `saree-care` 800×1000 portrait, `shop-front` 800×620, owner 200×200, before/after 470×480. Rebuild (`npm run build`) after adding photos.

Not yet mapped automatically: a single combined `before-after.jpg` (the site needs two separate files, `stain-before.jpg` + `stain-after.jpg`), and `logo.png` (used only as favicon material — replace `public/og-image.svg` with a 1200×630 PNG/JPG for WhatsApp/Twitter previews).

## Where things live

| Path | Purpose |
| --- | --- |
| `src/lib/business.ts` | **Single source of truth** — contact info, hours, services, the real price list, FAQs, open/closed status |
| `src/lib/bookingBus.ts` | Cross-component signals: service preselect + estimate ticket (sessionStorage + events) |
| `src/components/Estimator.tsx` | Interactive price estimator (Pricing section) → attaches an itemised ticket to the booking |
| `src/components/Booking.tsx` | 4-step pickup form → builds a WhatsApp message, copy fallback |
| `src/index.css` | Tailwind 4 `@theme` design tokens + component layer (buttons, inputs, ticket motif) |

## Editing prices or services

Edit `PRICE_CATEGORIES` / `SERVICES` in `src/lib/business.ts` only — the price table, estimator, service badges, and booking hints all read from there. Items with `price: "Ask for Quote"` (no `priceFrom`) are automatically quote-only in the estimator.
