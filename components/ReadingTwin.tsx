"use client";
import { useState } from "react";
import Link from "next/link";
import type { Book } from "@/lib/types";
import { figureBySlug, recsForBook } from "@/lib/data";
import { initials } from "@/lib/site";

interface Props {
  books: { book: Book; count: number }[];
}

/** "Find your reading twin": pick a book, meet the figures who love it. */
export function ReadingTwin({ books }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const twins = picked
    ? [...new Set(recsForBook(picked).map((r) => r.figure))]
        .map((s) => figureBySlug(s)!)
        .filter(Boolean)
    : [];
  const book = picked ? books.find((b) => b.book.slug === picked)?.book : null;

  const share = async () => {
    if (!book || twins.length === 0) return;
    const text = `My reading twin is ${twins[0].name}: we both love "${book.title}". Find yours on Reater.`;
    try {
      await navigator.clipboard.writeText(text + " https://books.nshipyard.com/");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="rounded-[2rem] border border-ink/10 bg-white p-8 md:p-12">
      <p className="font-display text-3xl font-bold md:text-4xl">
        Find your reading twin
      </p>
      <p className="mt-3 max-w-xl text-ink/70">
        Pick a book you love. We will show you which influential figures love it
        too.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {books.slice(0, 8).map(({ book: b }) => (
          <button
            key={b.slug}
            onClick={() => {
              setPicked(b.slug);
              setCopied(false);
            }}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              picked === b.slug
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 hover:border-ink"
            }`}
          >
            {b.title}
          </button>
        ))}
      </div>
      {book && (
        <div className="mt-8 rounded-2xl bg-paper p-6">
          <p className="text-sm uppercase tracking-wider text-ink/50">
            Your reading twins for "{book.title}"
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            {twins.map((f) => (
              <Link
                key={f.slug}
                href={`/figures/${f.slug}/`}
                className="flex items-center gap-3 rounded-full border border-ink/10 bg-white py-2 pl-2 pr-5 transition hover:border-ink"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold"
                  style={{ background: f.color.bg, color: f.color.fg }}
                >
                  {initials(f.name)}
                </span>
                <span>
                  <span className="block font-semibold leading-tight">{f.name}</span>
                  <span className="block text-xs text-ink/50">{f.role}</span>
                </span>
              </Link>
            ))}
          </div>
          <button
            onClick={share}
            className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-accent"
          >
            {copied ? "Copied. Go brag." : "Copy a shareable note"}
          </button>
        </div>
      )}
    </div>
  );
}
