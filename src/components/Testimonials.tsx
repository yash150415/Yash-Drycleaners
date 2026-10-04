import { MapPin, Quote } from "lucide-react";
import { Img } from "@/components/Img";
import { Stars } from "@/components/Stars";
import { BUSINESS, TESTIMONIALS } from "@/lib/business";

const STATS = [
  { value: `${new Date().getFullYear() - BUSINESS.since}+`, label: "Years on Kumbharvada Road" },
  { value: "12,000+", label: "Garments cleaned every month" },
  { value: "48 hrs", label: "Standard turnaround" },
  { value: `${BUSINESS.rating}★`, label: `${BUSINESS.reviewCount}+ local reviews` },
];

export function Testimonials() {
  return (
    <section id="reviews" className="section">
      <div className="wrap">
        <div className="max-w-2xl">
          <span className="eyebrow">Neighbourhood reviews</span>
          <h2 className="h2 mt-4">Families on this street have trusted us since {BUSINESS.since}.</h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.35fr]">
          <article className="card overflow-hidden">
            <Img
              slot="owner"
              alt={`${BUSINESS.name} owner at the shop counter`}
              ratio="aspect-[4/3]"
              className="border-b border-line"
            />
            <div className="p-6">
              <Quote className="h-6 w-6 text-teal" aria-hidden="true" />
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                “We opened with one washing machine and a cycle for pickups. Fifteen years later the promise is the same —
                your clothes come back the way you handed them over, only cleaner.”
              </p>
              <p className="mt-4 font-display text-lg text-ink">Raju Parmar</p>
              <p className="text-[12.5px] text-muted">Owner, {BUSINESS.name}</p>
              <p className="mt-3 inline-flex items-center gap-2 text-[12.5px] text-muted">
                <MapPin className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                {BUSINESS.address.line1}, {BUSINESS.address.city}
              </p>
            </div>
          </article>

          <div className="grid gap-6 sm:grid-cols-2">
            {TESTIMONIALS.map((review) => (
              <article key={review.name} className="card flex flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <Stars rating={review.rating} />
                  <span className="rounded-full bg-cream px-2.5 py-1 text-[11.5px] font-medium text-muted">
                    {review.service}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-[13.5px] leading-relaxed text-ink-soft">“{review.text}”</p>
                <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-teal/15 text-[13px] font-semibold text-teal-deep">
                    {review.name.slice(0, 1)}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[13.5px] font-semibold text-ink">{review.name}</span>
                    <span className="text-[12px] text-muted">{review.area}, Bhavnagar</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <dl className="mt-10 grid gap-4 rounded-3xl border border-line bg-paper p-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="font-display text-3xl leading-none text-ink">{stat.value}</dt>
              <dd className="mt-1.5 text-[12.5px] text-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
