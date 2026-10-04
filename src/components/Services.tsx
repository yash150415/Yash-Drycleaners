import { ArrowUpRight, Clock } from "lucide-react";
import { Img } from "@/components/Img";
import { SERVICES } from "@/lib/business";
import { requestService } from "@/lib/bookingBus";

export function Services() {
  return (
    <section id="services" className="section">
      <div className="wrap">
        <div className="max-w-2xl">
          <span className="eyebrow">What we clean</span>
          <h2 className="h2 mt-4">Every fabric in the house, one pickup.</h2>
          <p className="lede mt-4">
            Ten everyday services, priced straight — no surprises at delivery. Tap any card to drop it into your pickup
            booking.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <article
              key={service.id}
              className="group card flex flex-col overflow-hidden transition duration-500 hover:-translate-y-1.5 hover:border-teal/40 hover:shadow-lift"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <Img
                slot={service.slot}
                alt={`${service.title} at Yash Dry Cleaners, Bhavnagar`}
                ratio="aspect-[5/4]"
                className="border-b border-line"
                imgClassName="transition duration-700 group-hover:scale-[1.06]"
              />

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl leading-tight text-ink">{service.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                      service.from != null ? "bg-teal/12 text-teal-deep" : "bg-gold/15 text-ink"
                    }`}
                  >
                    {service.from != null ? `₹${service.from}+` : "Ask for Quote"}
                  </span>
                </div>

                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{service.blurb}</p>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {service.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="rounded-full border border-line bg-cream px-2.5 py-1 text-[11.5px] text-ink-soft"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {service.turnaround}
                  </span>
                  <button
                    type="button"
                    onClick={() => requestService(service.id)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-teal-deep transition hover:bg-teal/10"
                  >
                    Add to pickup
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
