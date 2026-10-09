import Link from "next/link";
import type { Metadata } from "next";
import { BOOKS, bookCounts } from "@/lib/data";
import { Cover } from "@/components/Cover";
import { initials } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Books",
  description: "Every book tracked on Reater, with the influential figures who recommended each one.",
};

export default function BooksIndex() {
  const counts = bookCounts();
  const all = BOOKS.map((b) => ({
    book: b,
    entry: counts.find((c) => c.book.slug === b.slug),
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">All books</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        {BOOKS.length} books, each one recommended in public by someone
        influential, each one tracked to its source.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {all.map(({ book, entry }) => (
          <Link
            key={book.slug}
            href={`/books/${book.slug}/`}
            className="group rounded-3xl border border-ink/10 bg-white p-4 transition hover:shadow-[0_8px_30px_rgba(23,19,11,0.08)]"
          >
            <div className="overflow-hidden rounded-lg shadow-md">
              <Cover book={book} sizes="220px" />
            </div>
            <p className="font-display mt-3 font-bold leading-tight group-hover:underline">
              {book.title}
            </p>
            <p className="truncate text-sm text-ink/60">{book.author}</p>
            {entry && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {entry.figures.slice(0, 4).map((f) => (
                    <span
                      key={f.slug}
                      title={f.name}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-white text-[9px] font-bold"
                      style={{ background: f.color.bg, color: f.color.fg }}
                    >
                      {initials(f.name)}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-ink/55">
                  {entry.count} {entry.count === 1 ? "reader" : "readers"}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
