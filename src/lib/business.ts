/**
 * Single source of truth for the business — contact details, timings, services,
 * the real price list, FAQs and reviews. Components read from here; edit this
 * file only and the whole site follows.
 */

export const BUSINESS = {
  name: "Yash Dry Cleaners",
  legalName: "Yash Dry Cleaners, Bhavnagar",
  tagline: "Dry cleaning, laundry & steam pressing — picked up from your door.",
  phoneDisplay: "+91 98797 38460",
  phone: "+919879738460",
  whatsapp: "919879738460",
  email: "rajuparmar1145@gmail.com",
  address: {
    line1: "Shop No-32, Kumbharvada Rd",
    line2: "near SBI Bank, Gadhechi Vadala",
    city: "Bhavnagar",
    state: "Gujarat",
    pin: "364003",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Shop+No-32+Kumbharvada+Rd+Gadhechi+Vadala+Bhavnagar+364003",
  since: 2009,
  rating: 4.8,
  reviewCount: 320,
  freePickupAbove: 199,
  turnaroundHours: 48,
} as const;

export const ADDRESS_LINE = `${BUSINESS.address.line1}, ${BUSINESS.address.line2}, ${BUSINESS.address.city} ${BUSINESS.address.pin}`;

export const TEL_HREF = `tel:${BUSINESS.phone}`;
export const MAIL_HREF = `mailto:${BUSINESS.email}`;

export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${BUSINESS.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/* ------------------------------------------------------------------ hours */

export type DayHours = {
  /** 0 = Sunday … 6 = Saturday (matches Date#getDay) */
  day: number;
  label: string;
  short: string;
  open: string;
  close: string;
};

export const HOURS: DayHours[] = [
  { day: 1, label: "Monday", short: "Mon", open: "09:00", close: "21:00" },
  { day: 2, label: "Tuesday", short: "Tue", open: "09:00", close: "21:00" },
  { day: 3, label: "Wednesday", short: "Wed", open: "09:00", close: "21:00" },
  { day: 4, label: "Thursday", short: "Thu", open: "09:00", close: "21:00" },
  { day: 5, label: "Friday", short: "Fri", open: "09:00", close: "21:00" },
  { day: 6, label: "Saturday", short: "Sat", open: "09:00", close: "21:00" },
  { day: 0, label: "Sunday", short: "Sun", open: "10:00", close: "18:00" },
];

export function hoursForDay(day: number): DayHours {
  return HOURS.find((h) => h.day === day) ?? HOURS[0];
}

export function prettyTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Shop-local (Asia/Kolkata) clock, so the badge is right for every visitor. */
function indiaNow(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = get("weekday");
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));

  return { day: dayIndex < 0 ? now.getDay() : dayIndex, minutes };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export type OpenStatus = {
  open: boolean;
  label: string;
  detail: string;
  today: DayHours;
};

export function openStatus(now: Date = new Date()): OpenStatus {
  const { day, minutes } = indiaNow(now);
  const today = hoursForDay(day);
  const opens = toMinutes(today.open);
  const closes = toMinutes(today.close);

  if (minutes >= opens && minutes < closes) {
    const left = closes - minutes;
    return {
      open: true,
      label: "Open now",
      detail:
        left <= 60
          ? `Closing in ${left} min — ${prettyTime(today.close)}`
          : `Till ${prettyTime(today.close)} today`,
      today,
    };
  }

  if (minutes < opens) {
    return {
      open: false,
      label: "Closed",
      detail: `Opens ${prettyTime(today.open)} today`,
      today,
    };
  }

  const tomorrow = hoursForDay((day + 1) % 7);
  return {
    open: false,
    label: "Closed",
    detail: `Opens ${tomorrow.short} ${prettyTime(tomorrow.open)}`,
    today,
  };
}

/* --------------------------------------------------------------- services */

export type Service = {
  id: string;
  title: string;
  blurb: string;
  /** image slot — see src/lib/images.ts */
  slot: string;
  /** starting rate from the counter price list — omit when the service is quoted per job */
  from?: number;
  turnaround: string;
  highlights: string[];
};

export const SERVICES: Service[] = [
  {
    id: "dry-cleaning",
    title: "Dry Cleaning",
    blurb:
      "Solvent cleaning for suits, woollens and delicate fabrics — colour-safe, shape-safe, finished with a careful press.",
    slot: "dry-cleaning",
    from: 50,
    turnaround: "48 hours",
    highlights: ["Stain pre-treatment", "pH-neutral solvent", "Hand-finished press"],
  },
  {
    id: "wash-fold",
    title: "Wash & Fold",
    blurb:
      "Everyday laundry washed in soft water, tumble-dried and folded into tidy stacks with a paper band.",
    slot: "wash-fold",
    from: 50,
    turnaround: "24–48 hours",
    highlights: ["Separate wash loads", "Skin-safe detergent", "Neat folded stacks"],
  },
  {
    id: "wash-iron",
    title: "Wash & Iron",
    blurb:
      "Full wash plus crisp steam pressing, delivered on hangers or folded — ready to wear straight from the bag.",
    slot: "shirt",
    from: 50,
    turnaround: "48 hours",
    highlights: ["Sharp collar & crease", "Hanger or fold", "Priced per piece"],
  },
  {
    id: "steam-press",
    title: "Steam Press",
    blurb:
      "Heavy-duty steam ironing that lifts creases out of cotton, linen and silk without burning the weave.",
    slot: "steam-press",
    turnaround: "Same day",
    highlights: ["No shine marks", "Same-day option", "Priced per piece"],
  },
  {
    id: "saree-care",
    title: "Saree Care",
    blurb:
      "Silk, bandhani, zari and embroidered sarees cleaned by hand with a gentler cycle and roll-folded on return.",
    slot: "saree-care",
    from: 150,
    turnaround: "3–4 days",
    highlights: ["Zari-safe cleaning", "Hand finish", "Roll-fold packing"],
  },
  {
    id: "suit-care",
    title: "Suit & Blazer",
    blurb:
      "Two-piece suits, blazers and waistcoats cleaned with structure in mind, then pressed on shaped formers.",
    slot: "suit",
    from: 150,
    turnaround: "48 hours",
    highlights: ["Shape-preserving press", "Lining inspected", "Buttons protected"],
  },
  {
    id: "woollens",
    title: "Blanket & Razai",
    blurb:
      "Winter quilts, razai and woollen blankets deep-cleaned, sanitised and fluffed — dust, mites and odour gone.",
    slot: "blanket",
    from: 250,
    turnaround: "3–4 days",
    highlights: ["Anti-dust mite wash", "Soft finish", "Odour removal"],
  },
  {
    id: "curtains",
    title: "Curtains",
    blurb:
      "Heavy drapes and sheers cleaned panel by panel, steamed and returned ready to re-hang without shrinkage shocks.",
    slot: "curtain",
    turnaround: "4–5 days",
    highlights: ["Take-down advice", "Panel-wise billing", "Steam finished"],
  },
  {
    id: "carpet",
    title: "Carpet & Rug",
    blurb:
      "Deep extraction for rugs and carpets — colour-locked, deodorised and dried flat before delivery.",
    slot: "carpet",
    turnaround: "3–5 days",
    highlights: ["Deep extraction", "Colour-lock test first", "Quoted on inspection"],
  },
  {
    id: "trouser-shirt",
    title: "Shirt & Trouser",
    blurb:
      "Office classics — shirts, trousers and kurtas cleaned and pressed with a razor-sharp front crease.",
    slot: "trouser",
    from: 50,
    turnaround: "24–48 hours",
    highlights: ["Front crease finish", "Collar & cuff care", "Bulk discounts"],
  },
];

/* ------------------------------------------------------------ price list */

export type PriceItem = {
  id: string;
  name: string;
  /** numeric rate used by the estimator (a straight, per-piece rate) */
  price?: number;
  /** "Starting ₹…" rate — the estimator uses it as the base estimate */
  from?: number;
  /** quote-only item, priced after inspection */
  quote?: boolean;
  unit?: string;
  note?: string;
  /** photo from the project-root `images/` folder — see src/lib/images.ts */
  slot?: string;
};

export type PriceCategory = {
  id: string;
  title: string;
  blurb: string;
  slot: string;
  note?: string;
  /** extra photos from `images/` used for the category photo strip */
  gallery?: string[];
  items: PriceItem[];
};

/**
 * The rate card exactly as printed at the shop counter: Men's Wear, Women's
 * Wear and Household & Home Care. Every line points at a photo in the
 * project-root `images/` folder through its `slot`, so replacing a photo there
 * updates the price cards too — no code changes.
 */
export const PRICE_CATEGORIES: PriceCategory[] = [
  {
    id: "menswear",
    title: "Men's Wear",
    blurb: "Dry cleaned and steam pressed piece by piece, returned on hangers.",
    slot: "suit",
    gallery: ["shirt", "trouser", "steam-press"],
    note: "Shirt and pant rates are per piece; the suit rate is for the full 2-piece set.",
    items: [
      {
        id: "shirt-dc",
        name: "Shirt",
        price: 50,
        unit: "per piece",
        note: "Washed or dry cleaned, collar & cuff detailed",
        slot: "shirt",
      },
      { id: "tshirt", name: "T-Shirt", price: 50, unit: "per piece", note: "Gentle cycle, print-safe", slot: "wash-fold" },
      {
        id: "trouser-dc",
        name: "Pant / Trouser",
        price: 50,
        unit: "per piece",
        note: "Sharp front crease, pockets checked",
        slot: "trouser",
      },
      {
        id: "pant-shirt",
        name: "Pant + Shirt",
        price: 60,
        unit: "per set",
        note: "Combo rate for one pant and one shirt",
        slot: "steam-press",
      },
      {
        id: "suit-2pc",
        name: "Suit (2 piece)",
        price: 150,
        unit: "per set",
        note: "Coat and trouser, pressed on shaped formers",
        slot: "suit",
      },
      {
        id: "sherwani",
        name: "Sherwani",
        price: 200,
        unit: "per piece",
        note: "Final rate depends on embroidery work & fabric",
        slot: "dry-cleaning",
      },
    ],
  },
  {
    id: "womenswear",
    title: "Women's Wear",
    blurb: "Sarees, suits and festive wear cleaned by hand and roll-folded.",
    slot: "saree-care",
    gallery: ["dry-cleaning", "packaging", "interior"],
    note: "Most women's rates are a starting price — we confirm the exact amount after seeing the fabric and the work on it.",
    items: [
      {
        id: "saree",
        name: "Saree",
        from: 150,
        unit: "per piece",
        note: "Starting ₹150 — varies by fabric",
        slot: "saree-care",
      },
      {
        id: "silk-saree",
        name: "Silk Saree",
        from: 250,
        unit: "per piece",
        note: "Premium fabric care — zari and border protected",
        slot: "saree-care",
      },
      {
        id: "lehenga",
        name: "Lehenga",
        from: 250,
        unit: "per piece",
        note: "Starting ₹250 — varies by design and fabric",
        slot: "packaging",
      },
      {
        id: "kurtis",
        name: "Kurtis",
        from: 120,
        unit: "per piece",
        note: "Starting ₹120 — varies by fabric and embroidery",
        slot: "wash-fold",
      },
      {
        id: "salwar-suit",
        name: "Salwar Suit",
        from: 180,
        unit: "per set",
        note: "Starting ₹180 — varies by fabric and work",
        slot: "dry-cleaning",
      },
      {
        id: "chiffon-georgette",
        name: "Chiffon & Georgette Wear",
        price: 200,
        unit: "per piece",
        note: "Delicate fabric care, hand finished",
        slot: "saree-care",
      },
      {
        id: "embroidered-wear",
        name: "Embroidered Wear",
        price: 200,
        unit: "per piece",
        note: "₹200 — price varies by embroidery work",
        slot: "packaging",
      },
      {
        id: "designer-dress",
        name: "Designer Dress",
        from: 250,
        unit: "per piece",
        note: "Starting ₹250 — varies by design",
        slot: "dry-cleaning",
      },
      {
        id: "dupatta",
        name: "Dupatta",
        from: 80,
        unit: "per piece",
        note: "Starting ₹80 — varies by fabric",
        slot: "saree-care",
      },
      {
        id: "blouse",
        name: "Blouse",
        from: 100,
        unit: "per piece",
        note: "Starting ₹100 — varies by design",
        slot: "saree-care",
      },
    ],
  },
  {
    id: "household",
    title: "Household & Home Care",
    blurb: "Blankets, razai, curtains and carpets — measured, cleaned and dried flat.",
    slot: "blanket",
    gallery: ["curtain", "carpet", "pickup-delivery"],
    note: "Curtains and carpets are quoted after we see the fabric, size and soil level.",
    items: [
      {
        id: "blanket",
        name: "Blanket",
        price: 250,
        unit: "per piece",
        note: "Deep cleaned, sanitised and fluffed",
        slot: "blanket",
      },
      {
        id: "quilt-razai",
        name: "Quilt / Razai",
        price: 250,
        unit: "per piece",
        note: "Anti-dust-mite wash, odour removal",
        slot: "blanket",
      },
      {
        id: "curtain",
        name: "Curtain (per panel)",
        quote: true,
        note: "Starting price depends on requirements",
        slot: "curtain",
      },
      {
        id: "carpet",
        name: "Carpet Cleaning",
        quote: true,
        note: "Confirm availability and get a quote",
        slot: "carpet",
      },
    ],
  },
];

export const PRICE_ITEMS: PriceItem[] = PRICE_CATEGORIES.flatMap((c) => c.items);

/** Items with a numeric rate — these are the ones the estimator can total. */
export const PRICED_ITEMS: PriceItem[] = PRICE_ITEMS.filter((item) => item.price != null || item.from != null);

/** Rate used by the estimator: the straight rate, else the "starting ₹…" rate. */
export function itemRate(item: PriceItem): number | null {
  if (item.price != null) return item.price;
  if (item.from != null) return item.from;
  return null;
}

export function priceLabel(item: PriceItem): string {
  if (item.quote) return "Ask for Quote";
  const unit = item.unit ? ` ${item.unit}` : "";
  if (item.price != null) return `₹${item.price}${unit}`;
  if (item.from != null) return `from ₹${item.from}${unit}`;
  return "Ask for Quote";
}

/** Short rate for tight spots like the estimator rows ("₹50" / "from ₹150"). */
export function shortPriceLabel(item: PriceItem): string {
  if (item.quote) return "Quote";
  if (item.price != null) return `₹${item.price}`;
  if (item.from != null) return `from ₹${item.from}`;
  return "Quote";
}

/* ------------------------------------------------------------ how it works */

export type Step = {
  id: string;
  title: string;
  blurb: string;
  slot: string;
};

export const STEPS: Step[] = [
  {
    id: "book",
    title: "Book in a minute",
    blurb: "WhatsApp, call or send the form — tell us what needs cleaning and pick a slot.",
    slot: "pickup-delivery",
  },
  {
    id: "pickup",
    title: "Free doorstep pickup",
    blurb: `We collect in a sealed bag. Free pickup & delivery on orders above ₹${BUSINESS.freePickupAbove}.`,
    slot: "interior",
  },
  {
    id: "clean",
    title: "Cleaned & inspected",
    blurb: "Fabric-wise sorting, stain work, wash or dry clean, then a hand-checked press.",
    slot: "dry-cleaning",
  },
  {
    id: "deliver",
    title: "Delivered in 48 hours",
    blurb: "Packed in kraft wrap or garment covers and handed back at your door, on time.",
    slot: "packaging",
  },
];

/* --------------------------------------------------------------- reviews */

export type Testimonial = {
  name: string;
  area: string;
  text: string;
  rating: number;
  service: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Hetal B.",
    area: "Kalanala",
    rating: 5,
    service: "Saree care",
    text:
      "My mother's bandhani sarees came back looking new — the zari is intact and they even rolled them instead of folding. Pickup was on time, both ways.",
  },
  {
    name: "Nilesh P.",
    area: "Waghawadi Road",
    rating: 5,
    service: "Suit dry cleaning",
    text:
      "Three office suits in on Tuesday, back Thursday evening. No shine on the elbows, crease sharp. The WhatsApp updates are a nice touch.",
  },
  {
    name: "Reena S.",
    area: "Gadhechi Vadala",
    rating: 4,
    service: "Blanket & razai",
    text:
      "Two heavy razais that were smelling of the cupboard now feel fresh and fluffy. A little longer than 3 days but worth it.",
  },
  {
    name: "Jignesh M.",
    area: "Krishnanagar",
    rating: 5,
    service: "Weekly laundry",
    text:
      "We send the whole week's laundry every Saturday. Folded neatly, shirts on hangers, and the bill matches the estimate almost exactly.",
  },
];

/* ------------------------------------------------------------------ faqs */

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "Is pickup and delivery really free?",
    a: `Yes — doorstep pickup and delivery is free on orders above ₹${BUSINESS.freePickupAbove} anywhere in our Bhavnagar service area. Below that a small ₹30 trip charge applies, and you'll always be told before we pick up.`,
  },
  {
    q: "How long does cleaning take?",
    a: `Standard turnaround is ${BUSINESS.turnaroundHours} hours. Everyday laundry is often back in 24 hours, and heavy items like quilts, curtains and carpets take 3–5 days. Same-day steam press is available if we receive the clothes before 11 AM.`,
  },
  {
    q: "What does dry cleaning cost?",
    a: "Shirts, t-shirts and pants are ₹50 each, a pant + shirt combo is ₹60, a 2-piece suit ₹150 and a sherwani ₹200. Sarees start at ₹150 (silk from ₹250), lehengas from ₹250, kurtis from ₹120, salwar suits from ₹180, dupattas from ₹80 and blouses from ₹100. Blankets and quilts are ₹250 each; curtains and carpets are quoted after we see them. Anything marked 'starting ₹…' is confirmed with you before cleaning.",
  },
  {
    q: "Will stains come out completely?",
    a: "We treat every stain before the main wash and photograph the garment's condition at intake. Older oil, ink, turmeric or dye stains may lighten rather than disappear completely — we will tell you honestly, and never charge extra for stain work.",
  },
  {
    q: "Are sarees with zari and embroidery safe?",
    a: "They are cleaned by hand in a gentler cycle with mild solvent, spot-treated only where needed, and finished with a soft roll-fold. Very old or fragile pieces are checked first and we will refuse rather than risk damage.",
  },
  {
    q: "Which areas of Bhavnagar do you cover?",
    a: "Kumbharvada, Gadhechi Vadala, Kalanala, Waghawadi Road, Krishnanagar, Subhashnagar, Amba Chowk, Sardarnagar, Ganga Jaliya and the surrounding lanes. Message us your pin code if you are unsure.",
  },
  {
    q: "What if a button breaks or a garment is damaged?",
    a: "Every piece is checked at intake, so damage is usually already noted. If anything happens during cleaning we repair it free where possible, or settle it fairly — that is why customers keep coming back since 2009.",
  },
  {
    q: "How do I pay?",
    a: "Pay by UPI on delivery, cash at handover, or card at the shop. No advance payment is needed for a pickup.",
  },
];

export const SERVICE_AREAS = [
  "Kumbharvada",
  "Gadhechi Vadala",
  "Kalanala",
  "Waghawadi Road",
  "Krishnanagar",
  "Subhashnagar",
  "Amba Chowk",
  "Sardarnagar",
  "Ganga Jaliya",
  "Chitra",
  "Takhteshwar",
  "Vora Bazaar",
];

export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#before-after", label: "Before & After" },
  { href: "#pricing", label: "Prices" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export const TIME_SLOTS = [
  "09:00 AM – 11:00 AM",
  "11:00 AM – 01:00 PM",
  "01:00 PM – 03:00 PM",
  "03:00 PM – 05:00 PM",
  "05:00 PM – 07:00 PM",
  "07:00 PM – 09:00 PM",
];
