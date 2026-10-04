import { useMemo, useState } from "react";
import { Check, Info, Minus, Plus, ReceiptText, RotateCcw, Send, Sparkles } from "lucide-react";
import { Img } from "@/components/Img";
import type { Estimate, EstimateLine } from "@/lib/bookingBus";
import { clearEstimate, scrollToSection, setEstimate as publishEstimate } from "@/lib/bookingBus";
import { BUSINESS, PRICE_CATEGORIES, PRICE_ITEMS, priceLabel, whatsappHref } from "@/lib/business";

function Stepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-paper p-0.5">
      <button
        type="button"
        aria-label={`Remove one ${label}`}
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        className="grid h-7 w-7 place-items-center rounded-full text-ink-soft transition hover:bg-teal/12 hover:text-teal-deep disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span className="w-6 text-center text-[13px] font-semibold tabular-nums text-ink">{value}</span>
      <button
        type="button"
        aria-label={`Add one ${label}`}
        onClick={() => onChange(Math.min(99, value + 1))}
        className="grid h-7 w-7 place-items-center rounded-full text-ink-soft transition hover:bg-teal/12 hover:text-teal-deep"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

export function Pricing() {
  const [activeCategory, setActiveCategory] = useState(PRICE_CATEGORIES[0].id);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const category = PRICE_CATEGORIES.find((c) => c.id === activeCategory) ?? PRICE_CATEGORIES[0];

  const setQuantity = (id: string, next: number) => {
    setQuantities((current) => {
      const copy = { ...current };
      if (next <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  };

  const estimate: Estimate = useMemo(() => {
    const lines: EstimateLine[] = PRICE_ITEMS.filter((item) => item.price != null && quantities[item.id]).map(
      (item) => ({
        id: item.id,
        name: item.name,
        qty: quantities[item.id],
        rate: item.price as number,
        unit: item.unit,
      }),
    );
    const quoteOnly = PRICE_ITEMS.filter((item) => item.quote && quantities[item.id]).map((item) => item.name);
    const total = lines.reduce((sum, line) => sum + line.qty * line.rate, 0);
    return { lines, total, quoteOnly, createdAt: Date.now() };
  }, [quantities]);

  const itemCount = estimate.lines.reduce((sum, line) => sum + line.qty, 0);
  const freeDeliveryGap = Math.max(0, BUSINESS.freePickupAbove - estimate.total);

  const estimateMessage = [
    `Hi ${BUSINESS.name}, here is my estimate from your website:`,
    ...estimate.lines.map(
      (line) => `• ${line.name} × ${line.qty}${line.unit ? ` (${line.unit})` : ""} = ₹${line.qty * line.rate}`,
    ),
    estimate.quoteOnly.length > 0 ? `Quote needed for: ${estimate.quoteOnly.join(", ")}` : "",
    `Estimated total: ₹${estimate.total}`,
    "Please confirm the pickup.",
  ]
    .filter(Boolean)
    .join("\n");

  const sendToBooking = () => {
    publishEstimate(estimate);
    scrollToSection("booking");
  };

  return (
    <section id="pricing" className="section">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow">Real price list</span>
            <h2 className="h2 mt-4">Printed rates, no weekend surcharge.</h2>
            <p className="lede mt-4">
              These are the rates on the board at the shop counter. Weigh-based laundry starts at ₹60 per kg, and anything
              that needs a closer look is quoted honestly before cleaning — never after.
            </p>
          </div>
          <a href="#estimator" className="btn-outline">
            <ReceiptText className="h-4 w-4" aria-hidden="true" />
            Skip to the estimator
          </a>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[15rem_1fr]">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {PRICE_CATEGORIES.map((entry) => {
              const active = entry.id === category.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveCategory(entry.id)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition lg:w-full ${
                    active
                      ? "border-teal-deep bg-teal/12 text-teal-deep shadow-soft"
                      : "border-line bg-paper text-ink-soft hover:border-teal/50"
                  }`}
                >
                  <span className="block whitespace-nowrap text-[13.5px] font-semibold lg:whitespace-normal">
                    {entry.title}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-muted">{entry.items.length} items</span>
                </button>
              );
            })}
          </div>

          <div className="card overflow-hidden">
            <div className="grid gap-0 md:grid-cols-[0.85fr_1.15fr]">
              <div className="flex flex-col border-b border-line md:border-b-0 md:border-r">
                <Img
                  slot={category.slot}
                  alt={`${category.title} at Yash Dry Cleaners`}
                  ratio="aspect-[4/3]"
                  className="shrink-0 md:aspect-auto md:min-h-[15rem] md:flex-1"
                />
                <div className="p-5">
                  <p className="text-[13.5px] leading-relaxed text-muted">{category.blurb}</p>
                  {category.note && (
                    <p className="mt-3 inline-flex gap-2 rounded-2xl bg-cream p-3 text-[12.5px] leading-relaxed text-ink-soft">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-deep" aria-hidden="true" />
                      {category.note}
                    </p>
                  )}
                </div>
              </div>

              <ul className="divide-y divide-line">
                {category.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-cream/70"
                  >
                    <span>
                      <span className="block text-[14px] font-medium text-ink">{item.name}</span>
                      {item.quote ? (
                        <span className="text-[12px] text-muted">{item.note ?? "Priced after inspection"}</span>
                      ) : null}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[12.5px] font-semibold ${
                        item.quote ? "bg-gold/15 text-ink" : "bg-teal/12 text-teal-deep"
                      }`}
                    >
                      {priceLabel(item)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- estimator */}
        <div id="estimator" className="mt-16 scroll-mt-28">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Instant estimator
            </span>
            <h3 className="h2 mt-4">Build your ticket before we pick up.</h3>
            <p className="lede mt-4">
              Tap quantities for a running total, then send the whole ticket into the booking form — we get the same list on
              WhatsApp.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
            <div className="card divide-y divide-line">
              {PRICE_CATEGORIES.map((entry, index) => (
                <details key={entry.id} open={index === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                    <span>
                      <span className="block font-display text-lg text-ink">{entry.title}</span>
                      <span className="text-[12.5px] text-muted">{entry.blurb}</span>
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-teal-deep transition group-open:rotate-45">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </summary>

                  <ul className="px-5 pb-4">
                    {entry.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-3 border-t border-dashed border-line py-3 first:border-t-0"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-medium text-ink">{item.name}</span>
                          <span className="text-[12px] text-muted">
                            {item.quote ? "Ask for quote" : priceLabel(item)}
                          </span>
                        </span>
                        {item.quote ? (
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(item.id, quantities[item.id] ? 0 : 1)
                            }
                            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                              quantities[item.id]
                                ? "bg-teal/15 text-teal-deep"
                                : "border border-line text-ink-soft hover:border-teal/50"
                            }`}
                          >
                            {quantities[item.id] ? "Added" : "Add"}
                          </button>
                        ) : (
                          <Stepper
                            label={item.name}
                            value={quantities[item.id] ?? 0}
                            onChange={(next) => setQuantity(item.id, next)}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>

            <div className="lg:sticky lg:top-28">
              <div className="ticket p-6">
                <div className="flex items-center justify-between">
                  <p className="inline-flex items-center gap-2 font-display text-lg text-ink">
                    <ReceiptText className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                    Your estimate
                  </p>
                  <span className="rounded-full bg-teal/12 px-2.5 py-1 text-[11.5px] font-semibold text-teal-deep">
                    {itemCount} item{itemCount === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="my-4 border-t border-dashed border-line" />

                {estimate.lines.length === 0 && estimate.quoteOnly.length === 0 ? (
                  <p className="text-[13.5px] leading-relaxed text-muted">
                    Nothing added yet. Add a few pieces on the left and the running total appears here instantly.
                  </p>
                ) : (
                  <ul className="space-y-2.5 text-[13.5px]">
                    {estimate.lines.map((line) => (
                      <li key={line.id} className="flex items-baseline justify-between gap-3">
                        <span className="text-ink-soft">
                          {line.name}
                          <span className="text-muted">
                            {" "}
                            × {line.qty}
                            {line.unit ? ` ${line.unit.replace("per ", "")}` : ""}
                          </span>
                        </span>
                        <span className="font-semibold tabular-nums text-ink">₹{line.qty * line.rate}</span>
                      </li>
                    ))}
                    {estimate.quoteOnly.map((name) => (
                      <li key={name} className="flex items-baseline justify-between gap-3">
                        <span className="text-ink-soft">{name}</span>
                        <span className="text-[12px] font-semibold text-gold">Ask for quote</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="my-4 border-t border-dashed border-line" />

                <div className="flex items-end justify-between">
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-muted">Estimated total</span>
                  <span className="font-display text-3xl leading-none text-ink">₹{estimate.total}</span>
                </div>

                <p className="mt-3 text-[12px] leading-relaxed text-muted">
                  Estimate only — the final bill is confirmed at intake. Rate card valid at the shop counter.
                </p>

                {itemCount > 0 && (
                  <p
                    className={`mt-3 rounded-2xl px-3 py-2 text-[12.5px] font-medium ${
                      freeDeliveryGap > 0 ? "bg-gold/12 text-ink" : "bg-teal/12 text-teal-deep"
                    }`}
                  >
                    {freeDeliveryGap > 0
                      ? `Add ₹${freeDeliveryGap} more to unlock free pickup & delivery.`
                      : "Free pickup & delivery unlocked on this order."}
                  </p>
                )}

                <div className="mt-5 grid gap-2.5">
                  <button
                    type="button"
                    className="btn-primary w-full"
                    disabled={itemCount === 0 && estimate.quoteOnly.length === 0}
                    onClick={sendToBooking}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Send to booking form
                  </button>
                  <a
                    href={whatsappHref(estimateMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn-whatsapp w-full ${itemCount === 0 ? "pointer-events-none opacity-50" : ""}`}
                  >
                    Send on WhatsApp
                  </a>
                  <button
                    type="button"
                    className="btn-outline w-full"
                    disabled={itemCount === 0 && estimate.quoteOnly.length === 0}
                    onClick={() => {
                      setQuantities({});
                      clearEstimate();
                    }}
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Reset ticket
                  </button>
                </div>

                <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-muted">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-deep" aria-hidden="true" />
                  Heavier fabrics like quilts and carpets are charged after measuring — we will confirm the weight on
                  pickup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
