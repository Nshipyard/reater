"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Book, Figure } from "@/lib/types";

interface Props {
  figures: Figure[];
  books: Book[];
}

/** Site-wide search across figures and books. */
export function Search({ figures, books }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return { figures: [], books: [] };
    return {
      figures: figures
        .filter(
          (f) =>
            f.name.toLowerCase().includes(needle) ||
            f.role.toLowerCase().includes(needle)
        )
        .slice(0, 5),
      books: books
        .filter(
          (b) =>
            b.title.toLowerCase().includes(needle) ||
            b.author.toLowerCase().includes(needle)
        )
        .slice(0, 5),
    };
  }, [q, figures, books]);

  const has = results.figures.length + results.books.length > 0;

  return (
    <div ref={boxRef} className="relative w-full max-w-2xl">
      <div className="flex items-center gap-3 rounded-full border-2 border-ink/15 bg-white px-6 py-4 shadow-[0_2px_24px_rgba(23,19,11,0.08)] transition focus-within:border-ink">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search people or books. Try Obama, Sapiens, Gates."
          aria-label="Search figures and books"
          className="w-full bg-transparent text-lg outline-none placeholder:text-ink/40"
        />
      </div>
      {open && q.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-xl">
          {!has && (
            <p className="px-6 py-5 text-sm text-ink/60">
              Nothing found for "{q}". More figures arrive every week.
            </p>
          )}
          {results.figures.length > 0 && (
            <div className="px-2 py-2">
              <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-ink/40">
                People
              </p>
              {results.figures.map((f) => (
                <Link
                  key={f.slug}
                  href={`/figures/${f.slug}/`}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 hover:bg-paper"
                >
                  <span className="font-display text-lg font-semibold">{f.name}</span>
                  <span className="text-sm text-ink/50">{f.role}</span>
                </Link>
              ))}
            </div>
          )}
          {results.books.length > 0 && (
            <div className="px-2 py-2">
              <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-ink/40">
                Books
              </p>
              {results.books.map((b) => (
                <Link
                  key={b.slug}
                  href={`/books/${b.slug}/`}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 hover:bg-paper"
                >
                  <span className="font-display text-lg font-semibold">{b.title}</span>
                  <span className="text-sm text-ink/50">{b.author}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
