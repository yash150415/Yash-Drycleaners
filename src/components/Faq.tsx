import { useState } from "react";
import { MessageCircle, Minus, Phone, Plus } from "lucide-react";
import { BUSINESS, FAQS, TEL_HREF, whatsappHref } from "@/lib/business";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <span className="eyebrow">Good to know</span>
          <h2 className="h2 mt-4">Questions we get at the counter.</h2>
          <p className="lede mt-4">
            Still unsure about a fabric or a stain? Send a photo on WhatsApp — we will tell you honestly whether it will come
            out clean.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href={whatsappHref(`Hi ${BUSINESS.name}, I have a question about `)}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Ask on WhatsApp
            </a>
            <a href={TEL_HREF} className="btn-outline">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="card divide-y divide-line">
          {FAQS.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4.5 text-left transition hover:bg-cream/60"
                >
                  <span className="font-display text-[17px] leading-snug text-ink">{faq.q}</span>
                  <span
                    className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition ${
                      isOpen ? "border-teal-deep bg-teal/12 text-teal-deep" : "border-line text-ink-soft"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-muted">{faq.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
