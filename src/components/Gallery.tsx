import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Img } from "@/components/Img";

type GalleryItem = {
  slot: string;
  caption: string;
  span?: string;
};

const GALLERY: GalleryItem[] = [
  { slot: "shop-front", caption: "Our counter on Kumbharvada Road", span: "col-span-2 row-span-2" },
  { slot: "interior", caption: "Racks sorted by fabric and colour" },
  { slot: "steam-press", caption: "Steam finishing, piece by piece" },
  { slot: "saree-care", caption: "Sarees roll-folded after cleaning", span: "row-span-2" },
  { slot: "suit", caption: "Suits pressed on shaped formers" },
  { slot: "blanket", caption: "Razai & quilts fluffed and sanitised" },
  { slot: "dry-cleaning", caption: "Solvent cleaning room" },
  { slot: "wash-fold", caption: "Everyday laundry, banded and stacked" },
  { slot: "curtain", caption: "Curtains steamed panel by panel" },
  { slot: "carpet", caption: "Deep extraction for rugs" },
  { slot: "shirt", caption: "Shirts back on hangers" },
  { slot: "packaging", caption: "Kraft wrap before delivery", span: "col-span-2" },
];

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback((delta: number) => {
    setOpenIndex((current) => {
      if (current == null) return current;
      return (current + delta + GALLERY.length) % GALLERY.length;
    });
  }, []);

  useEffect(() => {
    if (openIndex == null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  const active = openIndex == null ? null : GALLERY[openIndex];

  return (
    <section id="gallery" className="section">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow">Inside the shop</span>
            <h2 className="h2 mt-4">Photos from a normal working day.</h2>
            <p className="lede mt-4">
              No stock imagery — this is the shop, the racks and the machines your clothes actually go through. Tap any
              photo to open it larger.
            </p>
          </div>
        </div>

        <div className="mt-10 grid auto-rows-[9.5rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {GALLERY.map((item, index) => (
            <button
              key={item.slot}
              type="button"
              onClick={() => setOpenIndex(index)}
              className={`group relative overflow-hidden rounded-3xl border border-line text-left shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift ${
                item.span ?? ""
              }`}
            >
              <Img
                slot={item.slot}
                alt={item.caption}
                fill
                imgClassName="transition duration-700 group-hover:scale-[1.07]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent opacity-80 transition group-hover:opacity-95"
              />
              <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-medium leading-snug text-cream">{item.caption}</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cream/20 text-cream opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div className="relative w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <Img
              slot={active.slot}
              alt={active.caption}
              ratio="aspect-[4/3]"
              priority
              className="rounded-3xl border border-cream/20"
            />
            <p className="mt-3 text-center text-[13px] font-medium text-cream/85">{active.caption}</p>

            <button
              type="button"
              onClick={close}
              aria-label="Close photo"
              className="absolute -top-3 right-0 grid h-10 w-10 place-items-center rounded-full bg-cream text-ink shadow-lift"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-ink shadow-lift transition hover:bg-cream"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-ink shadow-lift transition hover:bg-cream"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
