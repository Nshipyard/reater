"use client";
import { useState } from "react";
import Link from "next/link";
import type { Book, Figure } from "@/lib/types";
import { Cover } from "./Cover";
import { initials } from "@/lib/site";

export interface RankedBook {
  book: Book;
  count: number;
  figures: Figure[];
}

export function TopTable({ ranked }: { ranked: RankedBook[] }) {
  const cats = ["All", ...Array.from(new Set(ranked.flatMap((r) => r.book.categories))).sort()];
  const [cat, setCat] = useState("All");
  const list = ranked.filter((r) => cat === "All" || r.book.categories.includes(cat));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              cat === c ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <ol className="mt-8 space-y-4">
        {list.map((r, i) => (
          <li key={r.book.slug}>
            <Link
              href={`/books/${r.book.slug}/`}
              className="flex items-center gap-5 rounded-3xl border border-ink/10 bg-white p-4 transition hover:shadow-[0_8px_30px_rgba(23,19,11,0.08)] sm:p-5"
            >
              <span className="font-display w-10 shrink-0 text-center text-3xl font-bold text-ink/25">
                {i + 1}
              </span>
              <div className="w-14 shrink-0 overflow-hidden rounded shadow-md sm:w-16">
                <Cover
                  isbn={r.book.isbn13}
                  title={r.book.title}
                  author={r.book.author}
                  slug={r.book.slug}
                  sizes="100px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold leading-tight sm:text-xl">
                  {r.book.title}
                </p>
                <p className="text-sm text-ink/60">{r.book.author}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {r.figures.slice(0, 6).map((f) => (
                      <span
                        key={f.slug}
                        title={f.name}
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold"
                        style={{ background: f.color.bg, color: f.color.fg }}
                      >
                        {initials(f.name)}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-ink/55">
                    Recommended by {r.count}
                  </span>
                </div>
              </div>
              <span className="hidden shrink-0 gap-1 sm:flex">
                {r.book.categories.slice(0, 2).map((c) => (
                  <span key={c} className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink/70">
                    {c}
                  </span>
                ))}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
