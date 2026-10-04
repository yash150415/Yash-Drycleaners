import { BeforeAfter } from "@/components/BeforeAfter";
import { Booking } from "@/components/Booking";
import { Faq } from "@/components/Faq";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";

export default function App() {
  return (
    <div className="min-h-dvh bg-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cream"
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Services />
        <BeforeAfter />
        <Process />
        <Pricing />
        <Gallery />
        <Testimonials />
        <Booking />
        <Faq />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
