"use client";
import { useState } from "react";
import Link from "next/link";
import type { Book, Figure, Recommendation } from "@/lib/types";
import { Cover } from "./Cover";
import { SourceBadge } from "./SourceBadge";
import { BuyButtons, ShareButton } from "./BuyButtons";
import { EmailGate } from "./EmailGate";
import { initials } from "@/lib/site";

export interface EnrichedRec {
  rec: Recommendation;
  book: Book;
  alsoBy: Figure[];
}

function BookRow({ item, accent }: { item: EnrichedRec; accent: string }) {
  const { rec, book, alsoBy } = item;
  return (
    <article className="flex gap-5 rounded-3xl border border-ink/10 bg-white p-5 transition hover:shadow-[0_8px_30px_rgba(23,19,11,0.08)] sm:p-6">
      <Link
        href={`/books/${book.slug}/`}
        className="w-20 shrink-0 sm:w-24"
        aria-label={`About ${book.title}`}
      >
        <Cover
          isbn={book.isbn13}
          title={book.title}
          author={book.author}
          slug={book.slug}
          className="rounded-md shadow-md"
          sizes="120px"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <Link href={`/books/${book.slug}/`} className="hover:underline">
              <h3 className="font-display text-xl font-bold leading-tight sm:text-2xl">
                {book.title}
              </h3>
            </Link>
            <p className="mt-0.5 text-sm text-ink/60">
              {book.author}
              {book.year ? ` · ${book.year}` : ""}
            </p>
          </div>
          <a
            href={rec.source.url}
            target="_blank"
            rel="noreferrer"
            title={`Source: ${rec.source.title}`}
          >
            <SourceBadge type={rec.source.type} />
          </a>
        </div>

        {rec.quote && (
          <blockquote
            className="mt-3 border-l-2 pl-4 font-display text-lg italic leading-snug"
            style={{ borderColor: accent }}
          >
            "{rec.quote}"
          </blockquote>
        )}

        <p className="mt-3 text-xs text-ink/55">
          Spotted in{" "}
          <a href={rec.source.url} target="_blank" rel="noreferrer" className="font-medium underline">
            {rec.source.title}
          </a>
          {rec.source.date ? ` · ${rec.source.date}` : ""}
        </p>

        {alsoBy.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-ink/55">Also loved by</span>
            <div className="flex -space-x-2">
              {alsoBy.slice(0, 5).map((f) => (
                <Link
                  key={f.slug}
                  href={`/figures/${f.slug}/`}
                  title={f.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold"
                  style={{ background: f.color.bg, color: f.color.fg }}
                >
                  {initials(f.name)}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <BuyButtons book={book} />
          <ShareButton title={`${book.title} by ${book.author}`} path={`/books/${book.slug}/`} />
        </div>
      </div>
    </article>
  );
}

interface Props {
  figure: Figure;
  recs: EnrichedRec[];
  previewCount?: number;
}

/** Reading list with email-gated full unlock. */
export function FigureReadingList({ figure, recs, previewCount = 5 }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const accent = figure.color.accent;
  const visible = recs.slice(0, previewCount);
  const locked = recs.slice(previewCount);

  return (
    <div className="space-y-5">
      {visible.map((item) => (
        <BookRow key={`${item.rec.figure}-${item.rec.book}`} item={item} accent={accent} />
      ))}

      {locked.length > 0 && !unlocked && (
        <div className="pt-4">
          <EmailGate
            figureSlug={figure.slug}
            figureName={figure.name}
            accent={accent}
            onUnlock={() => setUnlocked(true)}
          />
          <div aria-hidden className="pointer-events-none mt-6 select-none space-y-5 opacity-60 blur-[6px]">
            {locked.slice(0, 2).map((item) => (
              <BookRow key={`locked-${item.rec.book}`} item={item} accent={accent} />
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-ink/55">
            {locked.length} more {locked.length === 1 ? "book" : "books"} waiting
            behind the list.
          </p>
        </div>
      )}

      {locked.length > 0 && unlocked && (
        <div className="space-y-5">
          {locked.map((item) => (
            <BookRow key={`${item.rec.figure}-${item.rec.book}`} item={item} accent={accent} />
          ))}
        </div>
      )}
    </div>
  );
}
