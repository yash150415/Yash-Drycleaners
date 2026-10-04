import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { ArrowRight, MoveHorizontal, Sparkles } from "lucide-react";
import { Img } from "@/components/Img";
import { scrollToSection } from "@/lib/bookingBus";

const TREATMENTS = [
  {
    title: "Stain mapping",
    blurb: "Every stain is marked and treated separately before the main wash — oil, ink, turmeric and old food spills included.",
    slot: "carpet",
  },
  {
    title: "Fabric-safe solvent",
    blurb: "Colour-locked, pH-neutral cleaning that keeps zari, embroidery and woollen weaves from dulling or shrinking.",
    slot: "dry-cleaning",
  },
  {
    title: "Hand-checked press",
    blurb: "Steam finished on shaped formers, then inspected under daylight before it is packed for delivery.",
    slot: "steam-press",
  },
];

export function BeforeAfter() {
  const [position, setPosition] = useState(58);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = (clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateFromClientX(event.clientX);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(event.clientX);
  };

  const stopDragging = () => setDragging(false);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 4;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((value) => Math.max(0, value - step));
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((value) => Math.min(100, value + step));
    }
    if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  };

  return (
    <section id="before-after" className="section">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <span className="eyebrow">Before &amp; after</span>
            <h2 className="h2 mt-4">The stain that would not go away.</h2>
            <p className="lede mt-4">
              A coffee-and-oil spill on a light cotton shirt, treated the way we treat every piece that comes through the
              shop: mapped, spot-treated, cleaned gently and pressed by hand.
            </p>

            <ul className="mt-6 space-y-3 text-[14px] text-ink-soft">
              <li className="flex gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                Photo proof of condition at intake — you see what we see.
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                Stain work is always included, never an extra charge.
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                Honest answers on old dye or bleach marks before we start.
              </li>
            </ul>

            <button type="button" className="btn-primary mt-7" onClick={() => scrollToSection("booking")}>
              Send us your stained piece
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div>
            <div
              ref={frameRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={stopDragging}
              onPointerLeave={stopDragging}
              onPointerCancel={stopDragging}
              className={`relative aspect-[4/3] touch-none select-none overflow-hidden rounded-[2rem] border border-line shadow-lift ${
                dragging ? "cursor-grabbing" : "cursor-grab"
              }`}
            >
              <Img slot="stain-after" alt="Shirt fabric spotless after dry cleaning" fill priority />
              <Img
                slot="stain-before"
                alt="Shirt fabric with a coffee and oil stain before cleaning"
                fill
                priority
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
              />

              <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cream backdrop-blur">
                Before
              </span>
              <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-teal-deep/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                After
              </span>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-[3px] bg-cream/90 shadow-[0_0_18px_rgba(13,27,36,0.35)]"
                style={{ left: `${position}%` }}
              />

              <div
                role="slider"
                tabIndex={0}
                aria-label="Drag to compare before and after cleaning"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(position)}
                onKeyDown={onKeyDown}
                onDoubleClick={() => setPosition(58)}
                className="absolute top-1/2 z-10 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-cream bg-ink text-cream shadow-lift"
                style={{ left: `${position}%` }}
              >
                <MoveHorizontal className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>

            <p className="mt-3 text-center text-[12.5px] text-muted">
              Drag the handle — or use ← → keys — to compare. Real customer shirt, cleaned in our Bhavnagar shop.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TREATMENTS.map((item) => (
            <article key={item.title} className="card overflow-hidden">
              <Img slot={item.slot} alt={item.title} ratio="aspect-[16/10]" className="border-b border-line" />
              <div className="p-5">
                <h3 className="font-display text-lg text-ink">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
