/**
 * Tiny cross-component bus so the estimator, service cards and header can all
 * hand work to the booking form: a preselected service and/or an itemised
 * estimate ticket. State rides on sessionStorage and custom DOM events.
 */

export type EstimateLine = {
  id: string;
  name: string;
  qty: number;
  rate: number;
  unit?: string;
};

export type Estimate = {
  lines: EstimateLine[];
  total: number;
  quoteOnly: string[];
  createdAt: number;
};

const ESTIMATE_KEY = "ydc.estimate.v1";
const DRAFT_KEY = "ydc.booking-draft.v1";

const ESTIMATE_EVENT = "ydc:estimate";
const SERVICE_EVENT = "ydc:service";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------- estimate */

export function setEstimate(estimate: Estimate): void {
  try {
    sessionStorage.setItem(ESTIMATE_KEY, JSON.stringify(estimate));
  } catch {
    /* storage can be unavailable in private modes — the event still fires */
  }
  window.dispatchEvent(new CustomEvent<Estimate>(ESTIMATE_EVENT, { detail: estimate }));
}

export function getEstimate(): Estimate | null {
  try {
    return safeParse<Estimate>(sessionStorage.getItem(ESTIMATE_KEY));
  } catch {
    return null;
  }
}

export function clearEstimate(): void {
  try {
    sessionStorage.removeItem(ESTIMATE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(ESTIMATE_EVENT, { detail: null }));
}

export function subscribeEstimate(listener: (estimate: Estimate | null) => void): () => void {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<Estimate | null>).detail ?? null;
    listener(detail);
  };
  window.addEventListener(ESTIMATE_EVENT, handler);
  return () => window.removeEventListener(ESTIMATE_EVENT, handler);
}

/* ------------------------------------------------------ service preselect */

export function requestService(serviceId: string): void {
  window.dispatchEvent(new CustomEvent<string>(SERVICE_EVENT, { detail: serviceId }));
  scrollToSection("booking");
}

export function subscribeService(listener: (serviceId: string) => void): () => void {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<string>).detail;
    if (detail) listener(detail);
  };
  window.addEventListener(SERVICE_EVENT, handler);
  return () => window.removeEventListener(SERVICE_EVENT, handler);
}

/* ---------------------------------------------------------------- drafts */

export type BookingDraft = {
  services: string[];
  date: string;
  slot: string;
  name: string;
  phone: string;
  address: string;
  area: string;
  notes: string;
};

export function saveDraft(draft: BookingDraft): void {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

export function loadDraft(): BookingDraft | null {
  try {
    return safeParse<BookingDraft>(sessionStorage.getItem(DRAFT_KEY));
  } catch {
    return null;
  }
}

/* --------------------------------------------------------------- helpers */

export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
