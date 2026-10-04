import { useEffect, useState } from "react";
import { Clock, MapPin, Menu, Phone, X } from "lucide-react";
import { BUSINESS, NAV_LINKS, TEL_HREF, openStatus, whatsappHref } from "@/lib/business";
import { scrollToSection } from "@/lib/bookingBus";

export function Header() {
  const [status, setStatus] = useState(() => openStatus());
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setStatus(openStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const go = (href: string) => {
    setMenuOpen(false);
    scrollToSection(href.replace("#", ""));
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-ink text-cream/80 lg:block">
        <div className="wrap flex h-9 items-center justify-between text-[12px]">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-teal" aria-hidden="true" />
            {BUSINESS.address.line1}, {BUSINESS.address.line2} — {BUSINESS.address.city} {BUSINESS.address.pin}
          </span>
          <span className="flex items-center gap-5">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-teal" aria-hidden="true" />
              Mon–Sat 9 AM–9 PM · Sun 10 AM–6 PM
            </span>
            <a className="font-semibold text-cream transition hover:text-teal" href={TEL_HREF}>
              {BUSINESS.phoneDisplay}
            </a>
          </span>
        </div>
      </div>

      <div
        className={`border-b transition duration-300 ${
          scrolled ? "border-line bg-cream/95 shadow-soft backdrop-blur" : "border-transparent bg-cream/80 backdrop-blur"
        }`}
      >
        <div className="wrap flex h-16 items-center justify-between gap-4 sm:h-18">
          <button
            type="button"
            onClick={() => go("#top")}
            className="flex items-center gap-3 rounded-2xl py-1 pr-2 text-left"
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-ink">
              <span className="font-display text-xl leading-none text-cream">Y</span>
              <span className="absolute bottom-1.5 h-[3px] w-6 rounded-full bg-teal" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[17px] tracking-tight text-ink">{BUSINESS.name}</span>
              <span className="hidden text-[11px] font-medium uppercase tracking-[0.16em] text-muted sm:block">
                Bhavnagar · since {BUSINESS.since}
              </span>
            </span>
          </button>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => go(link.href)}
                className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-ink-soft transition hover:bg-teal/10 hover:text-teal-deep"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span
              className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold sm:inline-flex ${
                status.open ? "border-teal/50 bg-teal/12 text-teal-deep" : "border-line bg-paper text-muted"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {status.open && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${status.open ? "bg-teal" : "bg-muted"}`} />
              </span>
              {status.label}
            </span>

            <a href={TEL_HREF} className="btn-outline btn-sm hidden md:inline-flex">
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call
            </a>

            <button type="button" className="btn-primary btn-sm hidden sm:inline-flex" onClick={() => go("#booking")}>
              Book a pickup
            </button>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-paper text-ink lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-cream lg:hidden">
          <div className="wrap space-y-1 py-5">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => go(link.href)}
                className="flex w-full items-center justify-between rounded-2xl border border-line bg-paper px-4 py-3.5 text-left text-[15px] font-medium text-ink"
              >
                {link.label}
              </button>
            ))}

            <div className="rounded-2xl border border-line bg-paper p-4 text-sm">
              <p className="inline-flex items-center gap-2 font-semibold text-ink">
                <Clock className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                {status.label} · {status.detail}
              </p>
              <p className="mt-2 text-muted">
                {BUSINESS.address.line1}, {BUSINESS.address.line2}
                <br />
                {BUSINESS.address.city} {BUSINESS.address.pin}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a href={TEL_HREF} className="btn-outline">
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call now
              </a>
              <a
                href={whatsappHref(`Hi ${BUSINESS.name}, I'd like to book a pickup.`)}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                WhatsApp
              </a>
            </div>

            <button type="button" className="btn-primary mt-1 w-full" onClick={() => go("#booking")}>
              Book a pickup
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
