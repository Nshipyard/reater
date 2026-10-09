"use client";
import { useState } from "react";
import type { Figure } from "@/lib/types";
import { FigureCard } from "./FigureCard";

export interface FigureWithCount extends Figure {
  bookCount: number;
  topBooks: { slug: string; title: string; author: string; isbn13: string | null; coverId: number | null }[];
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
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {list.map((f) => (
          <FigureCard key={f.slug} figure={f} />
        ))}
      </div>
      {list.length === 0 && (
        <p className="mt-10 text-center text-ink/60">No figures in this category yet.</p>
      )}
    </div>
  );
}
