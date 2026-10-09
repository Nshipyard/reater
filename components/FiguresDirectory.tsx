"use client";
import { useState } from "react";
import Link from "next/link";
import type { Figure } from "@/lib/types";
import { Cover } from "./Cover";
import { initials } from "@/lib/site";

export interface FigureWithCount extends Figure {
  bookCount: number;
  topBooks: { slug: string; title: string; author: string; isbn13: string | null }[];
}

const CATEGORIES = ["All", "Founders", "Investors", "Leaders", "Authors", "Scientists", "Artists"];

export function FiguresDirectory({ figures }: { figures: FigureWithCount[] }) {
  const [cat, setCat] = useState("All");
  const list = figures.filter((f) => cat === "All" || f.category === cat);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
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
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f) => (
          <Link
            key={f.slug}
            href={`/figures/${f.slug}/`}
            className="group overflow-hidden rounded-3xl border border-ink/10 bg-white transition hover:shadow-[0_12px_40px_rgba(23,19,11,0.10)]"
          >
            <div className="flex items-center gap-4 p-5" style={{ background: f.color.bg, color: f.color.fg }}>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 font-display text-lg font-bold" style={{ borderColor: f.color.fg }}>
                {initials(f.name)}
              </span>
              <div className="min-w-0">
                <p className="font-display text-xl font-bold leading-tight">{f.name}</p>
                <p className="truncate text-sm opacity-70">{f.role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-5">
              <div className="flex -space-x-3">
                {f.topBooks.slice(0, 3).map((b) => (
                  <div key={b.slug} className="w-12 overflow-hidden rounded shadow-md ring-2 ring-white">
                    <Cover isbn={b.isbn13} title={b.title} author={b.author} slug={b.slug} sizes="80px" />
                  </div>
                ))}
              </div>
              <span className="text-sm font-semibold text-ink/60 transition group-hover:text-ink">
                {f.bookCount} {f.bookCount === 1 ? "book" : "books"} →
              </span>
            </div>
          </Link>
        ))}
      </div>
      {list.length === 0 && (
        <p className="mt-10 text-center text-ink/60">No figures in this category yet.</p>
      )}
    </div>
  );
}
