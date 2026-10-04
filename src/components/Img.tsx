import { useState } from "react";
import type { CSSProperties } from "react";
import { getImage } from "@/lib/images";

type ImgProps = {
  /** image slot key — see src/lib/images.ts */
  slot: string;
  alt: string;
  /** wrapper classes (rounding, border, ring…) */
  className?: string;
  /** extra classes on the <img> itself (object-position, filters…) */
  imgClassName?: string;
  /** tailwind aspect utility for the frame */
  ratio?: string;
  /** stretch to fill a positioned parent instead of dictating the ratio */
  fill?: boolean;
  /** inline styles for the frame (handy for clip-path reveals) */
  style?: CSSProperties;
  /** eager-load above-the-fold images */
  priority?: boolean;
};

/**
 * Renders a slot photo from `images/`, falling back to the bundled SVG
 * illustration and finally to a tinted block — never a broken image icon.
 */
export function Img({
  slot,
  alt,
  className = "",
  imgClassName = "",
  ratio = "aspect-[4/3]",
  fill = false,
  style,
  priority = false,
}: ImgProps) {
  const [failed, setFailed] = useState(false);
  const image = getImage(slot);
  const showFallback = failed || !image.src;
  const frame = fill ? "absolute inset-0" : `relative ${ratio}`;

  return (
    <div className={`${frame} overflow-hidden bg-line/60 paper-texture ${className}`} style={style}>
      {showFallback ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal/25 via-cream to-gold/20"
        >
          <span className="font-display text-3xl text-ink/25">Yash</span>
        </div>
      ) : (
        <img
          src={image.src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}
