import Link from "next/link";
import {
  FIGURES,
  BOOKS,
  RECS,
  topBooks,
  bookBySlug,
  recsForFigure,
  sourceTypeCounts,
  uniqueSources,
  SOURCE_COLORS,
  SOURCE_LABELS,
} from "@/lib/data";
import { Search } from "@/components/Search";
import { Cover } from "@/components/Cover";
import { FigureCard } from "@/components/FigureCard";
import { ReadingTwin } from "@/components/ReadingTwin";
import { NewsletterBand } from "@/components/NewsletterBand";
import { Donut } from "@/components/charts";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, initials } from "@/lib/site";

function withCounts() {
  return FIGURES.map((f) => {
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
}

export default function Home() {
  const figures = withCounts();
  const top = topBooks(8);
  const sources = sourceTypeCounts().map((s) => ({
    label: SOURCE_LABELS[s.type] || s.type,
    value: s.count,
    color: SOURCE_COLORS[s.type] || "#888",
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Reater",
          url: SITE_URL,
          description:
            "Book recommendations from the world's most influential people, each tracked to its source.",
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />

      {/* Hero */}
      <section className="paper-grain">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            books.nshipyard.com
          </p>
          <h1 className="font-display mt-4 max-w-4xl text-6xl font-bold leading-[0.95] tracking-tight md:text-8xl">
            Read what the influential read.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70 md:text-xl">
            Book recommendations from the world's most influential people,
            collected in one searchable place. Every pick is tracked to the
            podcast, interview, or list where it surfaced.
          </p>
          <div className="mt-8">
            <Search figures={FIGURES} books={BOOKS} />
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {[
              [FIGURES.length, "influential figures"],
              [BOOKS.length, "books tracked"],
              [RECS.length, "recommendations"],
              [uniqueSources().length, "sources cited"],
            ].map(([n, label]) => (
              <div key={label as string}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-4xl font-bold">{n}</dd>
                <dd className="text-sm text-ink/60">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Figure mosaic */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-4xl font-bold md:text-5xl">The figures</h2>
          <Link href="/figures/" className="font-semibold text-accent hover:underline">
            Browse all →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {figures.map((f) => (
            <FigureCard key={f.slug} figure={f} />
          ))}
        </div>
      </section>

      {/* Most recommended */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Most recommended</h2>
          <Link href="/top/" className="font-semibold text-accent hover:underline">
            Full ranking →
          </Link>
        </div>
        <ol className="grid gap-4 md:grid-cols-2">
          {top.map((t, i) => (
            <li key={t.book.slug}>
              <Link
                href={`/books/${t.book.slug}/`}
                className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4 transition hover:shadow-[0_8px_30px_rgba(23,19,11,0.08)]"
              >
                <span className="font-display w-8 text-center text-2xl font-bold text-ink/25">
                  {i + 1}
                </span>
                <div className="w-12 shrink-0 overflow-hidden rounded shadow">
                  <Cover
                    isbn={t.book.isbn13}
                    title={t.book.title}
                    author={t.book.author}
                    slug={t.book.slug}
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-bold">{t.book.title}</p>
                  <p className="truncate text-sm text-ink/60">{t.book.author}</p>
                </div>
                <div className="flex shrink-0 -space-x-2">
                  {t.figures.slice(0, 4).map((f) => (
                    <span
                      key={f.slug}
                      title={f.name}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold"
                      style={{ background: f.color.bg, color: f.color.fg }}
                    >
                      {initials(f.name)}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Reading twin */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <ReadingTwin books={topBooks(12)} />
      </section>

      {/* Where recs surface */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-[2rem] bg-ink p-8 text-paper md:p-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl font-bold md:text-5xl">
                Where recommendations surface
              </h2>
              <p className="mt-3 max-w-xl text-paper/70">
                Every recommendation carries its source. Podcasts dominate, but
                the long tail of newsletters and interviews is where the rare
                picks hide.
              </p>
            </div>
            <Link href="/charts/" className="font-semibold text-accent hover:underline">
              All the charts →
            </Link>
          </div>
          <div className="mt-8">
            <Donut items={sources} />
          </div>
        </div>
      </section>

      <div className="py-10">
        <NewsletterBand />
      </div>
    </>
  );
}
