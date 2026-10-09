import Link from "next/link";
import type { Figure } from "@/lib/types";
import { Cover } from "./Cover";
import { initials } from "@/lib/site";

export interface CardFigure extends Figure {
  bookCount: number;
  topBooks: { slug: string; title: string; author: string; isbn13: string | null; coverId: number | null }[];
}

/** At-a-glance figure card: identity, book count, mini covers. */
export function FigureCard({ figure }: { figure: CardFigure }) {
  return (
    <Link
      href={`/figures/${figure.slug}/`}
      className="group overflow-hidden rounded-3xl border border-ink/10 bg-white transition hover:shadow-[0_12px_40px_rgba(23,19,11,0.10)]"
    >
      <div
        className="flex items-center gap-4 p-5"
        style={{ background: figure.color.bg, color: figure.color.fg }}
      >
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 font-display text-lg font-bold"
          style={{ borderColor: figure.color.fg }}
        >
          {initials(figure.name)}
        </span>
        <div className="min-w-0">
          <p className="font-display text-xl font-bold leading-tight">{figure.name}</p>
          <p className="truncate text-sm opacity-70">{figure.role}</p>
        </div>
      </div>
      <div className="flex items-center justify-between p-5">
        <div className="flex -space-x-3">
          {figure.topBooks.slice(0, 3).map((b) => (
            <div key={b.slug} className="w-12 overflow-hidden rounded shadow-md ring-2 ring-white">
              <Cover book={b} sizes="80px" />
            </div>
          ))}
        </div>
        <span className="text-sm font-semibold text-ink/60 transition group-hover:text-ink">
          {figure.bookCount} {figure.bookCount === 1 ? "book" : "books"} →
        </span>
      </div>
    </Link>
  );
}
