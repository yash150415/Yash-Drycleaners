/**
 * Image plumbing.
 *
 * Drop photos into the project-root `images/` folder — that is the whole
 * workflow. This module auto-imports everything in there at build time and
 * matches files to named slots. Name matching ignores case, spaces, `_`, `-`
 * and `&`, so `Wash & Fold.webp`, `wash-fold.jpg` and `washfold.png` all hit
 * the same slot. `.webp` wins when a slot has several candidates, then `.avif`,
 * `.png`, `.jpg`, `.jpeg`.
 *
 * Slots with no photo fall back to the bundled SVG illustrations in
 * `src/assets/images/`, so the site never shows a broken image.
 */

const photoFiles = import.meta.glob("../../images/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const illustrationFiles = import.meta.glob("../assets/images/*.svg", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/** slot key → extra names that should feed it */
export const SLOT_ALIASES: Record<string, string[]> = {
  "shop-front": ["shop", "store", "storefront", "front", "shopfrontphoto", "shopcard"],
  interior: ["inside", "counter", "racks", "shop-interior", "shopinside", "office"],
  owner: ["raju", "rajuparmar", "proprietor", "meetowner", "ownerphoto", "founder"],
  "saree-care": ["saree", "sarees", "sareecleaning", "silksaree", "sareecarephoto"],
  "steam-press": ["steam", "iron", "ironing", "press", "pressing", "steamiron"],
  suit: ["blazer", "coat", "menssuit", "suits", "suitcleaning"],
  shirt: ["shirts", "formalshirt", "shirtcleaning", "shirtwash"],
  trouser: ["trousers", "pant", "pants", "trousercleaning", "formalpants"],
  blanket: ["razai", "quilt", "quilts", "woollen", "woolen", "blankets"],
  curtain: ["curtains", "parda", "pardas", "blinds", "drapes"],
  carpet: ["rug", "rugs", "carpets", "carpetcleaning", "sofa"],
  "dry-cleaning": ["dryclean", "drycleaningphoto", "machine", "solvent", "plant", "drycleaner"],
  "wash-fold": ["washandfold", "laundry", "fold", "washandfoldphoto", "laundryservice"],
  "stain-before": ["before", "stainbefore", "beforephoto", "dirty", "preclean", "before1"],
  "stain-after": ["after", "stainafter", "afterphoto", "spotless", "postclean", "after1"],
  "pickup-delivery": ["pickup", "delivery", "doorstep", "pickupdelivery", "collection", "bag"],
  packaging: ["package", "wrapping", "wrapped", "garmentbag", "kraft", "packing"],
};

/** slot → bundled illustration used when no photo exists */
const ILLUSTRATION_FOR_SLOT: Record<string, string> = {
  "shop-front": "shopfront",
  interior: "shopfront",
  owner: "avatar",
  "saree-care": "fabric",
  "steam-press": "sparkle",
  suit: "hanger",
  shirt: "hanger",
  trouser: "hanger",
  blanket: "fabric",
  curtain: "fabric",
  carpet: "washer",
  "dry-cleaning": "washer",
  "wash-fold": "washer",
  "stain-before": "sparkle",
  "stain-after": "sparkle",
  "pickup-delivery": "doorstep",
  packaging: "fabric",
};

const FALLBACK_ILLUSTRATION = "fabric";

const EXT_RANK: Record<string, number> = {
  webp: 0,
  avif: 1,
  png: 2,
  jpg: 3,
  jpeg: 4,
};

type Photo = {
  file: string;
  url: string;
  key: string;
  ext: string;
};

const photos: Photo[] = Object.entries(photoFiles).map(([path, url]) => {
  const file = path.split("/").pop() ?? path;
  const ext = (file.split(".").pop() ?? "").toLowerCase();
  return { file, url, key: normalize(file.replace(/\.[^.]+$/, "")), ext };
});

photos.sort((a, b) => (EXT_RANK[a.ext] ?? 9) - (EXT_RANK[b.ext] ?? 9));

function aliasesFor(slot: string): string[] {
  return [normalize(slot), ...(SLOT_ALIASES[slot] ?? []).map(normalize)];
}

/** Build the slot → photo map once, exact matches first, then soft matches. */
function resolvePhotos(): Record<string, Photo> {
  const claimed = new Set<string>();
  const map: Record<string, Photo> = {};
  const slots = Object.keys(SLOT_ALIASES);

  for (const slot of slots) {
    const names = aliasesFor(slot);
    const exact = photos.find((p) => !claimed.has(p.file) && names.includes(p.key));
    if (exact) {
      map[slot] = exact;
      claimed.add(exact.file);
    }
  }

  for (const slot of slots) {
    if (map[slot]) continue;
    const names = aliasesFor(slot);
    const soft = photos.find(
      (p) =>
        !claimed.has(p.file) &&
        names.some((name) => name.length > 3 && (p.key.startsWith(name) || p.key.includes(name))),
    );
    if (soft) {
      map[slot] = soft;
      claimed.add(soft.file);
    }
  }

  return map;
}

const slotPhotos = resolvePhotos();

export type ResolvedImage = {
  /** URL to render */
  src: string;
  /** true when a real photo from images/ was found */
  isPhoto: boolean;
  /** original file name, when a photo was used */
  file?: string;
};

export function getImage(slot: string): ResolvedImage {
  const photo = slotPhotos[slot];
  if (photo) {
    return { src: photo.url, isPhoto: true, file: photo.file };
  }

  const key = ILLUSTRATION_FOR_SLOT[slot] ?? FALLBACK_ILLUSTRATION;
  const svg =
    illustrationFiles[`../assets/images/${key}.svg`] ??
    illustrationFiles[`../assets/images/${FALLBACK_ILLUSTRATION}.svg`];
  return { src: svg ?? "", isPhoto: false };
}

/** Every photo that is actually wired to a slot (used by the contact sheet). */
export function photoInventory(): { slot: string; file: string }[] {
  return Object.entries(slotPhotos)
    .map(([slot, photo]) => ({ slot, file: photo.file }))
    .sort((a, b) => a.slot.localeCompare(b.slot));
}

export function photoCount(): number {
  return photos.length;
}

export function unusedPhotos(): string[] {
  const used = new Set(Object.values(slotPhotos).map((p) => p.file));
  return photos.filter((p) => !used.has(p.file)).map((p) => p.file);
}
