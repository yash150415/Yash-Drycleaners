import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { BUSINESS, TEL_HREF, whatsappHref } from "@/lib/business";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2.5 transition duration-500 sm:bottom-6 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={TEL_HREF}
        aria-label={`Call ${BUSINESS.name}`}
        className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper text-ink shadow-lift transition hover:border-teal hover:text-teal-deep"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
      </a>

      <a
        href={whatsappHref(`Hi ${BUSINESS.name}, I'd like to book a pickup.`)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex animate-pulse-ring items-center gap-2 rounded-full bg-[#128c7e] px-4 py-3 text-[13.5px] font-semibold text-white shadow-lift transition hover:bg-[#0f7a6d]"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        Book on WhatsApp
      </a>
    </div>
  );
}
