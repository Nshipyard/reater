import type { Metadata } from "next";
import { FIGURES, bookBySlug, recsForFigure } from "@/lib/data";
import { FiguresDirectory } from "@/components/FiguresDirectory";

export const metadata: Metadata = {
  title: "Figures",
  description:
    "Browse every influential figure tracked on Reater, from founders and investors to presidents and authors, with their reading lists.",
};

export default function FiguresIndex() {
  const figures = FIGURES.map((f) => {
    const recs = recsForFigure(f.slug);
    return {
      ...f,
      bookCount: recs.length,
      topBooks: recs
        .slice(0, 3)
        .map((r) => bookBySlug(r.book)!)
        .filter(Boolean)
        .map((b) => ({ slug: b.slug, title: b.title, author: b.author, isbn13: b.isbn13 })),
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
        The figures
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        Founders, investors, presidents, authors, scientists. Each card shows
        their latest picks at a glance. Open a profile for the full list with
        sources.
      </p>
      <div className="mt-10">
        <FiguresDirectory figures={figures} />
      </div>
    </div>
  );
}
