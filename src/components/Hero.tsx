import { ArrowRight, BadgeCheck, Clock, Leaf, MessageCircle, Phone, Truck } from "lucide-react";
import { Img } from "@/components/Img";
import { Stars } from "@/components/Stars";
import { BUSINESS, SERVICES, TEL_HREF, whatsappHref } from "@/lib/business";
import { scrollToSection } from "@/lib/bookingBus";

const PROMISES = [
  { icon: Truck, title: "Free doorstep pickup", detail: `On orders above ₹${BUSINESS.freePickupAbove}` },
  { icon: Clock, title: "48-hour turnaround", detail: "Same-day steam press available" },
  { icon: Leaf, title: "Fabric-safe process", detail: "Soft water & pH-neutral solvent" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-[-6rem] h-96 w-96 rounded-full bg-teal/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-gold/20 blur-3xl"
      />

      <div className="wrap relative grid gap-12 py-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
        <div className="animate-rise">
          <span className="eyebrow">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Bhavnagar · trusted since {BUSINESS.since}
          </span>

          <h1 className="mt-5 font-display text-[2.35rem] leading-[1.06] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.4rem]">
            Fresh clothes,
            <br />
            collected from
            <span className="relative ml-2 inline-block">
              <span className="relative z-10">your door</span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-full bg-teal/35 sm:h-4"
              />
            </span>
            .
          </h1>

          <p className="lede mt-5 max-w-xl">
            Dry cleaning, wash &amp; fold, steam pressing and saree care for the whole street — from shirts and suits to
            razais, curtains and carpets. Book on WhatsApp, we pick up, and you get everything back crisp within 48 hours.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary" onClick={() => scrollToSection("booking")}>
              Book a pickup
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <a
              href={whatsappHref(`Hi ${BUSINESS.name}, I'd like to book a pickup. My area is `)}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp us
            </a>
            <a href={TEL_HREF} className="btn-outline">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {BUSINESS.phoneDisplay}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <Stars rating={BUSINESS.rating} />
              <span className="text-[13px] font-medium text-ink-soft">
                {BUSINESS.rating} · {BUSINESS.reviewCount}+ local reviews
              </span>
            </div>
            <span className="hidden h-4 w-px bg-line sm:block" />
            <div className="flex flex-wrap gap-2">
              {["Shirts", "Sarees", "Suits", "Razai", "Curtains", "Carpets"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line bg-paper px-3 py-1 text-[12px] font-medium text-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <dl className="mt-9 grid gap-3 sm:grid-cols-3">
            {PROMISES.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="rounded-2xl border border-line bg-paper/80 p-4">
                <Icon className="h-5 w-5 text-teal-deep" aria-hidden="true" />
                <dt className="mt-2 text-[13.5px] font-semibold text-ink">{title}</dt>
                <dd className="text-[12.5px] text-muted">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative animate-rise [animation-delay:120ms]">
          <div className="relative">
            <Img
              slot="shop-front"
              alt="The Yash Dry Cleaners shop in Bhavnagar, ready for pickup"
              ratio="aspect-[5/4]"
              priority
              className="rounded-[2rem] border border-line shadow-lift"
            />

            <div className="absolute -bottom-8 -left-3 w-40 sm:-left-8 sm:w-52">
              <Img
                slot="saree-care"
                alt="Neatly folded silk sarees after cleaning"
                ratio="aspect-[3/4]"
                priority
                className="rounded-3xl border-4 border-cream shadow-lift"
              />
            </div>

            <div className="absolute -right-2 -top-6 hidden w-40 sm:block sm:w-44">
              <Img
                slot="dry-cleaning"
                alt="Dry cleaning machine and freshly cleaned clothes"
                ratio="aspect-square"
                priority
                className="rounded-3xl border-4 border-cream shadow-lift"
              />
            </div>

            <div className="absolute bottom-4 right-2 w-[62%] max-w-[16rem] rounded-2xl border border-line bg-paper/95 p-3.5 shadow-lift backdrop-blur sm:bottom-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-deep">Today at the shop</p>
              <p className="mt-1 text-[13px] font-semibold text-ink">Wash &amp; Fold from ₹60/kg</p>
              <p className="text-[12px] text-muted">Steam press ₹15 per piece · pickup free</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-y border-line bg-paper/70 py-3.5">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8">
            {[...SERVICES, ...SERVICES].map((service, index) => (
              <span
                key={`${service.id}-${index}`}
                className="inline-flex shrink-0 items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-muted"
              >
                {service.title}
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
