import { Img } from "@/components/Img";
import { STEPS } from "@/lib/business";

export function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-ink py-16 text-cream sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-teal/20 blur-3xl"
      />

      <div className="wrap relative">
        <div className="max-w-2xl">
          <span className="eyebrow border-cream/20 bg-cream/10 text-teal">How it works</span>
          <h2 className="h2 mt-4 text-cream">Four steps, zero trips to the shop.</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-cream/70">
            You never have to find parking in Kumbharvada. Tell us what needs cleaning, hand it over at your door, and we
            bring it back pressed.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.id} className="group relative">
              <div className="overflow-hidden rounded-3xl border border-cream/15 bg-cream/5">
                <Img
                  slot={step.slot}
                  alt={step.title}
                  ratio="aspect-[4/3]"
                  imgClassName="transition duration-700 group-hover:scale-[1.05]"
                />
                <div className="p-5">
                  <span className="inline-flex h-7 items-center rounded-full bg-teal px-3 text-[12px] font-bold text-ink">
                    Step {index + 1}
                  </span>
                  <h3 className="mt-3 font-display text-lg text-cream">{step.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-cream/65">{step.blurb}</p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-3 top-1/2 hidden h-px w-6 bg-cream/25 lg:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
