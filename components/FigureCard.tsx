import Link from "next/link";
import type { Figure } from "@/lib/types";
import { Cover } from "./Cover";
import { Portrait } from "./Portrait";

export interface CardFigure extends Figure {
  bookCount: number;
  topBooks: { slug: string; title: string; author: string; isbn13: string | null; coverId: number | null }[];
}

/** Sleek horizontal figure card: portrait, identity, mini covers, count. */
export function FigureCard({ figure }: { figure: CardFigure }) {
  return (
    <Link
      href={`/figures/${figure.slug}/`}
      className="group flex items-center gap-4 rounded-3xl border border-ink/10 bg-white p-4 transition hover:shadow-[0_12px_40px_rgba(23,19,11,0.10)]"
    >
      <span
        className="w-1.5 shrink-0 self-stretch rounded-full"
        style={{ background: figure.color.bg }}
        aria-hidden="true"
      />
      <Portrait
        slug={figure.slug}
        name={figure.name}
        bg={figure.color.bg}
        fg={figure.color.fg}
        className="h-16 w-16 shrink-0 rounded-full text-base"
      />
      <div className="min-w-0 flex-1">
        <p className="font-display truncate text-lg font-bold leading-tight">
          {figure.name}
        </p>
        <p className="truncate text-sm text-ink/60">{figure.role}</p>
        <div className="mt-2 flex -space-x-2">
          {figure.topBooks.slice(0, 4).map((b) => (
            <div
              key={b.slug}
              className="w-8 overflow-hidden rounded-[4px] shadow-sm ring-2 ring-white"
            >
              <Cover book={b} sizes="64px" fallback="plain" />
            </div>
          ))}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-display text-2xl font-bold leading-none">{figure.bookCount}</p>
        <p className="mt-1 text-xs text-ink/50 transition group-hover:text-ink">
          {figure.bookCount === 1 ? "book" : "books"} →
        </p>
      </div>
    </Link>
  );
}
