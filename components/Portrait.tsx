"use client";

import { useState } from "react";
import { initials } from "@/lib/site";

/**
 * Figure portrait with initials fallback. Photos live at
 * /figures/<slug>.jpg (real portraits, Wikimedia Commons).
 */
export function Portrait({
  slug,
  name,
  bg,
  fg,
  className = "",
  imgClassName = "",
  eager = false,
  borderColor,
}: {
  slug: string;
  name: string;
  bg: string;
  fg: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  borderColor?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        className={`font-display flex items-center justify-center font-bold ${className}`}
        style={{ background: bg, color: fg, borderColor }}
        aria-label={name}
      >
        {initials(name)}
      </span>
    );
  }
  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ background: bg, borderColor }}
    >
      <span
        className="font-display absolute inset-0 flex items-center justify-center font-bold"
        style={{ color: fg }}
        aria-hidden="true"
      >
        {initials(name)}
      </span>
      <img
        src={`/figures/${slug}.jpg`}
        alt={name}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
      />
    </span>
  );
}
