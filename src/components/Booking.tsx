import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  Send,
  Truck,
} from "lucide-react";
import { Img } from "@/components/Img";
import type { Estimate } from "@/lib/bookingBus";
import {
  clearEstimate,
  getEstimate,
  loadDraft,
  saveDraft,
  subscribeEstimate,
  subscribeService,
} from "@/lib/bookingBus";
import { BUSINESS, SERVICE_AREAS, SERVICES, TEL_HREF, TIME_SLOTS, openStatus, whatsappHref } from "@/lib/business";

const STEP_LABELS = ["Services", "Pickup slot", "Address", "Review & send"];

type Draft = {
  services: string[];
  date: string;
  slot: string;
  name: string;
  phone: string;
  area: string;
  address: string;
  notes: string;
};

function isoDate(offsetDays = 0): string {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dateChoices() {
  return [0, 1, 2, 3].map((offset) => {
    const value = isoDate(offset);
    const date = new Date(`${value}T00:00:00`);
    const label =
      offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : date.toLocaleDateString("en-IN", { weekday: "short" });
    const sub = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return { value, label, sub };
  });
}

function prettyDate(value: string): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  const isToday = value === isoDate(0);
  const isTomorrow = value === isoDate(1);
  const pretty = date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  return isToday ? `Today, ${pretty}` : isTomorrow ? `Tomorrow, ${pretty}` : pretty;
}

function digits(value: string): string {
  return value.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
}

export function Booking() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(() => {
    const saved = loadDraft();
    return {
      services: saved?.services ?? [],
      date: saved?.date ?? isoDate(1),
      slot: saved?.slot ?? TIME_SLOTS[1],
      name: saved?.name ?? "",
      phone: saved?.phone ?? "",
      area: saved?.area ?? "",
      address: saved?.address ?? "",
      notes: saved?.notes ?? "",
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [estimate, setEstimate] = useState<Estimate | null>(() => getEstimate());
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const status = useMemo(() => openStatus(), []);
  const dates = useMemo(() => dateChoices(), []);

  const update = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));

  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  useEffect(() => subscribeEstimate(setEstimate), []);

  useEffect(
    () =>
      subscribeService((serviceId) => {
        setDraft((current) =>
          current.services.includes(serviceId)
            ? current
            : { ...current, services: [...current.services, serviceId] },
        );
      }),
    [],
  );

  const selectedServices = SERVICES.filter((service) => draft.services.includes(service.id));

  const toggleService = (id: string) => {
    setDraft((current) => ({
      ...current,
      services: current.services.includes(id)
        ? current.services.filter((entry) => entry !== id)
        : [...current.services, id],
    }));
    setErrors((current) => ({ ...current, services: "" }));
  };

  const validate = (index: number): boolean => {
    const next: Record<string, string> = {};

    if (index === 0 && draft.services.length === 0) {
      next.services = "Pick at least one service so we bring the right bags.";
    }
    if (index === 1 && (!draft.date || !draft.slot)) {
      next.date = "Choose a day and a time window.";
    }
    if (index === 2) {
      if (draft.name.trim().length < 2) next.name = "Please tell us your name.";
      if (!/^[6-9]\d{9}$/.test(digits(draft.phone))) next.phone = "Enter a valid 10-digit mobile number.";
      if (!draft.area) next.area = "Select your area so we route the pickup.";
      if (draft.address.trim().length < 8) next.address = "Add a short address with a landmark.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate(step)) return;
    setStep((current) => Math.min(STEP_LABELS.length - 1, current + 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(0, current - 1));
  };

  const message = useMemo(() => {
    const lines: string[] = [
      `Hello ${BUSINESS.name} 👋`,
      "I would like to book a doorstep pickup.",
      "",
      `Services: ${selectedServices.map((service) => service.title).join(", ") || "—"}`,
      `Pickup: ${prettyDate(draft.date)}, ${draft.slot}`,
      `Address: ${draft.address}${draft.area ? `, ${draft.area}` : ""}, Bhavnagar`,
      `Name: ${draft.name}`,
      `Phone: ${draft.phone ? `+91 ${digits(draft.phone)}` : ""}`,
    ];

    if (estimate && estimate.lines.length > 0) {
      lines.push("", `Estimate: ₹${estimate.total}`);
      estimate.lines.forEach((line) => {
        lines.push(`• ${line.name} × ${line.qty}${line.unit ? ` (${line.unit})` : ""} = ₹${line.qty * line.rate}`);
      });
    }
    if (estimate && estimate.quoteOnly.length > 0) {
      lines.push(`Quote needed: ${estimate.quoteOnly.join(", ")}`);
    }
    if (draft.notes.trim()) {
      lines.push("", `Notes: ${draft.notes.trim()}`);
    }

    lines.push("", "Please confirm the pickup time.");
    return lines.filter((line) => line !== undefined).join("\n");
  }, [draft, estimate, selectedServices]);

  const sendOnWhatsApp = () => {
    window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const resetBooking = () => {
    setSent(false);
    setStep(0);
    setDraft({
      services: [],
      date: isoDate(1),
      slot: TIME_SLOTS[1],
      name: "",
      phone: "",
      area: "",
      address: "",
      notes: "",
    });
    setEstimate(null);
    clearEstimate();
  };

  return (
    <section id="booking" className="section">
      <div className="wrap">
        <div className="max-w-2xl">
          <span className="eyebrow">Book a pickup</span>
          <h2 className="h2 mt-4">Four short steps, then we are on our way.</h2>
          <p className="lede mt-4">
            Fill this in and it opens WhatsApp with everything ready to send — or copy the summary and call us if you
            prefer talking.
          </p>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div className="card overflow-hidden">
            <ol className="flex items-stretch gap-1 border-b border-line bg-cream/60 p-2">
              {STEP_LABELS.map((label, index) => {
                const state = index === step ? "current" : index < step ? "done" : "todo";
                return (
                  <li key={label} className="flex-1">
                    <button
                      type="button"
                      onClick={() => index < step && setStep(index)}
                      disabled={index > step}
                      className={`flex w-full items-center gap-2 rounded-2xl px-2.5 py-2 text-left transition ${
                        state === "current"
                          ? "bg-paper shadow-soft"
                          : state === "done"
                            ? "hover:bg-paper/70"
                            : "opacity-55"
                      }`}
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-bold ${
                          state === "current"
                            ? "bg-ink text-cream"
                            : state === "done"
                              ? "bg-teal text-ink"
                              : "bg-line text-muted"
                        }`}
                      >
                        {state === "done" ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
                      </span>
                      <span className="hidden text-[12.5px] font-semibold text-ink-soft sm:block">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="p-5 sm:p-7">
              {sent ? (
                <div className="py-6 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal/15">
                    <CheckCircle2 className="h-7 w-7 text-teal-deep" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-ink">WhatsApp is open with your booking</h3>
                  <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">
                    Press send in WhatsApp and we will confirm the pickup slot within a few minutes during shop hours. If the
                    window did not open, copy the summary below and send it to {BUSINESS.phoneDisplay}.
                  </p>

                  <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                    <button type="button" className="btn-outline" onClick={copyMessage}>
                      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                      {copied ? "Copied" : "Copy summary"}
                    </button>
                    <a href={TEL_HREF} className="btn-primary">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      Call the shop
                    </a>
                    <button type="button" className="btn-outline" onClick={resetBooking}>
                      Book another pickup
                    </button>
                  </div>

                  <pre className="mt-6 max-h-56 overflow-auto rounded-2xl border border-dashed border-line bg-cream/70 p-4 text-left text-[12px] leading-relaxed whitespace-pre-wrap text-ink-soft">
                    {message}
                  </pre>
                </div>
              ) : (
                <>
                  {step === 0 && (
                    <div>
                      <h3 className="font-display text-xl text-ink">What should we collect?</h3>
                      <p className="mt-1.5 text-[13px] text-muted">
                        Choose as many as you like — exact counts are confirmed on pickup.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {SERVICES.map((service) => {
                          const on = draft.services.includes(service.id);
                          return (
                            <button
                              key={service.id}
                              type="button"
                              aria-pressed={on}
                              onClick={() => toggleService(service.id)}
                              className={on ? "chip-on" : "chip"}
                            >
                              {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                              {service.title}
                            </button>
                          );
                        })}
                      </div>
                      {errors.services && <p className="mt-2 text-[12.5px] font-medium text-[#b4453a]">{errors.services}</p>}

                      <div className="mt-6">
                        <label className="label" htmlFor="booking-notes">
                          Anything we should know?
                        </label>
                        <textarea
                          id="booking-notes"
                          rows={3}
                          className="field resize-none"
                          placeholder="e.g. 2 sarees with zari work, one shirt has an old oil stain, please call before coming."
                          value={draft.notes}
                          onChange={(event) => update({ notes: event.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <h3 className="font-display text-xl text-ink">When suits you?</h3>
                      <p className="mt-1.5 text-[13px] text-muted">
                        Pickup runs {status.open ? "now" : "in shop hours"} — Mon–Sat 9 AM–9 PM, Sun 10 AM–6 PM.
                      </p>

                      <div className="mt-4 grid gap-2 sm:grid-cols-4">
                        {dates.map((date) => {
                          const on = draft.date === date.value;
                          return (
                            <button
                              key={date.value}
                              type="button"
                              aria-pressed={on}
                              onClick={() => update({ date: date.value })}
                              className={`rounded-2xl border px-3 py-3 text-center transition ${
                                on ? "border-teal-deep bg-teal/12 text-teal-deep" : "border-line bg-paper hover:border-teal/50"
                              }`}
                            >
                              <span className="block text-[13px] font-semibold">{date.label}</span>
                              <span className="block text-[11.5px] text-muted">{date.sub}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                        <div>
                          <label className="label" htmlFor="booking-date">
                            Or choose another date
                          </label>
                          <input
                            id="booking-date"
                            type="date"
                            className="field"
                            min={isoDate(0)}
                            value={draft.date}
                            onChange={(event) => update({ date: event.target.value })}
                          />
                        </div>
                        <p className="inline-flex items-center gap-2 pb-3 text-[12.5px] text-muted">
                          <CalendarDays className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                          {prettyDate(draft.date)}
                        </p>
                      </div>

                      <div className="mt-6">
                        <span className="label">Preferred time window</span>
                        <div className="flex flex-wrap gap-2">
                          {TIME_SLOTS.map((slot) => {
                            const on = draft.slot === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                aria-pressed={on}
                                onClick={() => update({ slot })}
                                className={on ? "chip-on" : "chip"}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                        {errors.date && <p className="mt-2 text-[12.5px] font-medium text-[#b4453a]">{errors.date}</p>}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h3 className="font-display text-xl text-ink">Where should we come?</h3>
                      <p className="mt-1.5 text-[13px] text-muted">
                        Someone should be available in this window with the clothes packed.
                      </p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label" htmlFor="booking-name">
                            Your name
                          </label>
                          <input
                            id="booking-name"
                            className="field"
                            placeholder="Full name"
                            value={draft.name}
                            onChange={(event) => update({ name: event.target.value })}
                          />
                          {errors.name && <p className="mt-1.5 text-[12.5px] font-medium text-[#b4453a]">{errors.name}</p>}
                        </div>
                        <div>
                          <label className="label" htmlFor="booking-phone">
                            Mobile number
                          </label>
                          <input
                            id="booking-phone"
                            className="field"
                            inputMode="tel"
                            placeholder="10-digit mobile"
                            value={draft.phone}
                            onChange={(event) => update({ phone: event.target.value })}
                          />
                          {errors.phone && (
                            <p className="mt-1.5 text-[12.5px] font-medium text-[#b4453a]">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="label" htmlFor="booking-area">
                          Area in Bhavnagar
                        </label>
                        <select
                          id="booking-area"
                          className="field"
                          value={draft.area}
                          onChange={(event) => update({ area: event.target.value })}
                        >
                          <option value="">Select your area…</option>
                          {SERVICE_AREAS.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                          <option value="Other">Other / nearby area</option>
                        </select>
                        {errors.area && <p className="mt-1.5 text-[12.5px] font-medium text-[#b4453a]">{errors.area}</p>}
                      </div>

                      <div className="mt-4">
                        <label className="label" htmlFor="booking-address">
                          Flat / building, street and landmark
                        </label>
                        <textarea
                          id="booking-address"
                          rows={3}
                          className="field resize-none"
                          placeholder="e.g. Flat 302, Shreeji Apartments, near Kalanala circle, opposite the temple gate"
                          value={draft.address}
                          onChange={(event) => update({ address: event.target.value })}
                        />
                        {errors.address && (
                          <p className="mt-1.5 text-[12.5px] font-medium text-[#b4453a]">{errors.address}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h3 className="font-display text-xl text-ink">Everything correct?</h3>
                      <p className="mt-1.5 text-[13px] text-muted">
                        Sending opens WhatsApp with this summary — nothing is charged now.
                      </p>

                      <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line">
                        {[
                          { label: "Services", value: selectedServices.map((s) => s.title).join(", ") || "—" },
                          { label: "Pickup", value: `${prettyDate(draft.date)}, ${draft.slot}` },
                          { label: "Name", value: draft.name || "—" },
                          { label: "Mobile", value: draft.phone ? `+91 ${digits(draft.phone)}` : "—" },
                          { label: "Address", value: `${draft.address}${draft.area ? `, ${draft.area}` : ""}, Bhavnagar` },
                          ...(draft.notes.trim() ? [{ label: "Notes", value: draft.notes.trim() }] : []),
                          ...(estimate && estimate.lines.length > 0
                            ? [
                                {
                                  label: "Estimate",
                                  value: `₹${estimate.total} · ${estimate.lines
                                    .map((line) => `${line.name} × ${line.qty}`)
                                    .join(", ")}`,
                                },
                              ]
                            : []),
                        ].map((row) => (
                          <div key={row.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[7rem_1fr] sm:gap-4">
                            <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                              {row.label}
                            </dt>
                            <dd className="text-[13.5px] text-ink-soft">{row.value}</dd>
                          </div>
                        ))}
                      </dl>

                      <div className="mt-5 flex flex-wrap gap-2.5">
                        <button type="button" className="btn-whatsapp" onClick={sendOnWhatsApp}>
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          Send on WhatsApp
                        </button>
                        <button type="button" className="btn-outline" onClick={copyMessage}>
                          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                          {copied ? "Copied" : "Copy summary"}
                        </button>
                        <a href={TEL_HREF} className="btn-primary">
                          <Phone className="h-4 w-4" aria-hidden="true" />
                          Call instead
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="mt-7 flex items-center justify-between gap-3 border-t border-line pt-5">
                    <button
                      type="button"
                      className="btn-outline btn-sm"
                      onClick={goBack}
                      disabled={step === 0}
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Back
                    </button>

                    {step < STEP_LABELS.length - 1 ? (
                      <button type="button" className="btn-primary" onClick={goNext}>
                        Continue
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : (
                      <button type="button" className="btn-primary" onClick={sendOnWhatsApp}>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Send booking
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="ticket p-6">
              <p className="inline-flex items-center gap-2 font-display text-lg text-ink">
                <ReceiptText className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                Pickup ticket
              </p>

              <div className="my-4 border-t border-dashed border-line" />

              <dl className="space-y-3 text-[13px]">
                <div className="flex gap-3">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                  <div>
                    <dt className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">Pickup</dt>
                    <dd className="text-ink-soft">
                      {prettyDate(draft.date)}
                      <br />
                      {draft.slot}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                  <div>
                    <dt className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">Address</dt>
                    <dd className="text-ink-soft">
                      {draft.address || "Add your address in step 3"}
                      {draft.area ? `, ${draft.area}` : ""}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                  <div>
                    <dt className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">Services</dt>
                    <dd className="text-ink-soft">
                      {selectedServices.length > 0 ? selectedServices.map((s) => s.title).join(", ") : "Not chosen yet"}
                    </dd>
                  </div>
                </div>
              </dl>

              {estimate && estimate.lines.length > 0 && (
                <>
                  <div className="my-4 border-t border-dashed border-line" />
                  <ul className="space-y-2 text-[12.5px]">
                    {estimate.lines.map((line) => (
                      <li key={line.id} className="flex items-baseline justify-between gap-3">
                        <span className="text-muted">
                          {line.name} × {line.qty}
                        </span>
                        <span className="font-semibold tabular-nums text-ink">₹{line.qty * line.rate}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">Estimated</span>
                    <span className="font-display text-2xl leading-none text-ink">₹{estimate.total}</span>
                  </div>
                </>
              )}

              <div className="my-4 border-t border-dashed border-line" />

              <p className="text-[12px] leading-relaxed text-muted">
                Free pickup &amp; delivery above ₹{BUSINESS.freePickupAbove}. Standard turnaround 48 hours; same-day steam
                press if we receive before 11 AM.
              </p>
              <p className="mt-3 text-[12px] font-medium text-ink-soft">
                {status.label} · {status.detail}
              </p>
            </div>

            <div className="card overflow-hidden">
              <Img
                slot="pickup-delivery"
                alt="Doorstep laundry pickup and delivery bag"
                ratio="aspect-[16/10]"
                className="border-b border-line"
              />
              <div className="p-5">
                <h3 className="font-display text-lg text-ink">Prefer to talk?</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  Call or message and we will note the booking for you — no form needed.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <a href={TEL_HREF} className="btn-outline btn-sm">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {BUSINESS.phoneDisplay}
                  </a>
                  <a
                    href={whatsappHref(`Hi ${BUSINESS.name}, please book a pickup for me.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-whatsapp btn-sm"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
