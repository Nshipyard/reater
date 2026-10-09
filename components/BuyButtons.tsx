"use client";
import { useState } from "react";
import { amazonUrl, audibleUrl } from "@/lib/site";
import type { Book } from "@/lib/types";

/** Amazon + Audible purchase buttons with affiliate tagging. */
export function BuyButtons({ book, dark = false }: { book: Book; dark?: boolean }) {
  if (!book.asin && !book.audibleAsin) return null;
  const base = dark
    ? "border-white/30 text-white hover:bg-white hover:text-ink"
    : "border-ink/25 hover:bg-ink hover:text-paper";
  return (
    <div className="flex flex-wrap gap-2">
      {book.asin && (
        <a
          href={amazonUrl(book.asin)}
          target="_blank"
          rel="sponsored nofollow noreferrer"
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${base}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          Buy on Amazon
        </a>
      )}
      {book.audibleAsin && (
        <a
          href={audibleUrl(book.audibleAsin)}
          target="_blank"
          rel="sponsored nofollow noreferrer"
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${base}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
          Listen on Audible
        </a>
      )}
    </div>
  );
}

export function ShareButton({ title, path, dark = false }: { title: string; path: string; dark?: boolean }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = `https://books.nshipyard.com${path}`;
    try {
      await navigator.clipboard.writeText(`${title} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      onClick={share}
      aria-label="Copy link to share"
      title="Copy link to share"
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        dark
          ? "border-white/30 text-white hover:bg-white hover:text-ink"
          : "border-ink/25 hover:bg-ink hover:text-paper"
      }`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      {copied ? "Copied" : "Share"}
    </button>
  );
}
