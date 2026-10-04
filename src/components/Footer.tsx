import { ArrowUp, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  ADDRESS_LINE,
  BUSINESS,
  HOURS,
  MAIL_HREF,
  NAV_LINKS,
  SERVICE_AREAS,
  SERVICES,
  TEL_HREF,
  openStatus,
  prettyTime,
  whatsappHref,
} from "@/lib/business";
import { scrollToSection } from "@/lib/bookingBus";

export function Footer() {
  const status = openStatus();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper">
      <div className="wrap grid gap-10 py-14 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-ink">
              <span className="font-display text-xl leading-none text-cream">Y</span>
              <span className="absolute bottom-1.5 h-[3px] w-6 rounded-full bg-teal" />
            </span>
            <span className="font-display text-[17px] tracking-tight text-ink">{BUSINESS.name}</span>
          </div>
          <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
            Dry cleaning, laundry, steam pressing and doorstep pickup across {BUSINESS.address.city} since {BUSINESS.since}.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <a href={TEL_HREF} className="btn-outline btn-sm">
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call
            </a>
            <a
              href={whatsappHref(`Hi ${BUSINESS.name}, I'd like to book a pickup.`)}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp btn-sm"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">Visit the shop</h3>
          <ul className="mt-4 space-y-3 text-[13.5px] text-ink-soft">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
              <a href={BUSINESS.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-teal-deep">
                {ADDRESS_LINE}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
              <a href={TEL_HREF} className="hover:text-teal-deep">
                {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
              <a href={MAIL_HREF} className="break-all hover:text-teal-deep">
                {BUSINESS.email}
              </a>
            </li>
          </ul>

          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-[12px] font-medium text-ink-soft">
            <span className={`h-2 w-2 rounded-full ${status.open ? "bg-teal" : "bg-muted"}`} />
            {status.label} · {status.detail}
          </p>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">Opening hours</h3>
          <ul className="mt-4 space-y-2 text-[13px]">
            {HOURS.map((day) => {
              const isToday = day.day === status.today.day;
              return (
                <li
                  key={day.label}
                  className={`flex items-center justify-between gap-4 rounded-lg px-2 py-1 ${
                    isToday ? "bg-teal/12 font-semibold text-teal-deep" : "text-ink-soft"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {isToday && <Clock className="h-3.5 w-3.5" aria-hidden="true" />}
                    {day.label}
                  </span>
                  <span className="tabular-nums">
                    {prettyTime(day.open)} – {prettyTime(day.close)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">Services &amp; areas</h3>
          <ul className="mt-4 space-y-2 text-[13px] text-ink-soft">
            {SERVICES.slice(0, 6).map((service) => (
              <li key={service.id}>{service.title}</li>
            ))}
          </ul>
          <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
            Pickup across {SERVICE_AREAS.slice(0, 6).join(", ")} and nearby lanes.
          </p>
          <ul className="mt-4 space-y-2 text-[13px]">
            {NAV_LINKS.slice(0, 4).map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.href.replace("#", ""))}
                  className="text-ink-soft transition hover:text-teal-deep"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-[12.5px] text-muted">
          <p>
            © {year} {BUSINESS.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p>GST-free local billing · UPI, cash and card accepted</p>
            <button
              type="button"
              onClick={() => scrollToSection("top")}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-medium text-ink-soft transition hover:border-teal hover:text-teal-deep"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
