"use client";
import { useState } from "react";
import { coverUrl, coverUrlById } from "@/lib/site";
import type { Book } from "@/lib/types";

const PALETTE = [
  "#1d3a8f",
  "#8f1d1d",
  "#1d6b4f",
  "#6b3fa0",
  "#b3541e",
  "#0f6b7a",
  "#7a1f4d",
];

function hashColor(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

interface Props {
  book: Pick<Book, "coverId" | "isbn13" | "title" | "author" | "slug">;
  className?: string;
  eager?: boolean;
  sizes?: string;
}

/** Real cover from Open Library, with a typographic fallback when missing. */
export function Cover({
  book,
  className = "",
  eager = false,
  sizes = "(max-width: 640px) 40vw, 240px",
}: Props) {
  const [failed, setFailed] = useState(false);
  const { coverId, isbn13, title, author, slug } = book;
  const urlFor = (size: "S" | "M" | "L"): string | null =>
    coverId
      ? coverUrlById(coverId, size)
      : isbn13
        ? coverUrl(isbn13, size)
        : null;
  const src = urlFor("M");

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`Cover of ${title} by ${author}`}
        className={`flex aspect-[2/3] w-full flex-col justify-between p-4 ${className}`}
        style={{ background: hashColor(slug) }}
      >
        <p className="font-display text-lg font-bold leading-tight text-white">
          {title}
        </p>
        <p className="text-xs font-medium uppercase tracking-widest text-white/75">
          {author}
        </p>
      </div>
    );
  }

  const srcSet = ["S", "M", "L"]
    .map((s) => {
      const u = urlFor(s as "S" | "M" | "L");
      return u ? `${u} ${s === "S" ? 160 : s === "M" ? 360 : 720}w` : null;
    })
    .filter(Boolean)
    .join(", ");

  return (
    <img
      src={src}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={`Cover of ${title} by ${author}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`aspect-[2/3] w-full bg-[#e8e0cc] object-cover ${className}`}
      draggable={false}
    />
  );
}
