import Link from "next/link";
import type { Metadata } from "next";
import {
  BOOKS,
  bookBySlug,
  figureBySlug,
  recsForBook,
  relatedBooks,
  bookCounts,
} from "@/lib/data";
import { Book3D } from "@/components/Book3D";
import { Cover } from "@/components/Cover";
import { ScrollDial } from "@/components/ScrollDial";
import { SourceBadge } from "@/components/SourceBadge";
import { BuyButtons, ShareButton } from "@/components/BuyButtons";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, initials } from "@/lib/site";

export async function generateStaticParams() {
  return BOOKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = bookBySlug(slug)!;
  const figures = [...new Set(recsForBook(slug).map((r) => figureBySlug(r.figure)?.name))].filter(Boolean);
  const title = `${b.title} by ${b.author}: who recommends it`;
  const description = `"${b.title}" was recommended by ${figures.join(", ")}. See every influential figure who picked it up, and where.`;
  return { title, description, openGraph: { title, description } };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = bookBySlug(slug)!;
  const recs = recsForBook(slug);
  const figures = [...new Map(recs.map((r) => [r.figure, figureBySlug(r.figure)!])).values()].filter(Boolean);
  const related = relatedBooks(slug, 4);
  const rank = bookCounts().findIndex((b) => b.book.slug === slug) + 1;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          name: book.title,
          author: book.author,
          isbn: book.isbn13 || undefined,
          datePublished: book.year || undefined,
          url: `${SITE_URL}/books/${book.slug}/`,
        }}
      />

      <ScrollDial
        sections={[
          { id: "overview", label: "Overview" },
          { id: "recommended-by", label: "Recommended by" },
          { id: "related", label: "Related books" },
        ]}
      />

      {/* Hero */}
      <section id="overview" className="paper-grain scroll-mt-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-16 md:grid-cols-[auto_1fr] md:pt-24">
          <div className="justify-self-center">
            <Book3D book={book} width={280} eager />
            <p className="mt-2 text-center text-sm text-ink/50">Drag to turn the book.</p>
          </div>
          <div>
            {rank > 0 && (
              <p className="inline-block rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-white">
                #{rank} most recommended
              </p>
            )}
            <h1 className="font-display mt-4 text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
              {book.title}
            </h1>
            <p className="mt-4 text-xl text-ink/70">
              {book.author}
              {book.year ? ` · ${book.year}` : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {book.categories.map((c) => (
                <Link
                  key={c}
                  href={`/top/?cat=${encodeURIComponent(c)}`}
                  className="rounded-full bg-ink/5 px-3 py-1 text-sm font-medium hover:bg-ink hover:text-paper"
                >
                  {c}
                </Link>
              ))}
            </div>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              Recommended by <strong>{figures.length}</strong>{" "}
              {figures.length === 1 ? "influential figure" : "influential figures"}
              {figures.length > 0 && (
                <>
                  :{" "}
                  {figures.map((f, i) => (
                    <span key={f.slug}>
                      <Link href={`/figures/${f.slug}/`} className="font-semibold text-accent hover:underline">
                        {f.name}
                      </Link>
                      {i < figures.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </>
              )}
              .
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <BuyButtons book={book} />
              <ShareButton title={`${book.title} by ${book.author}`} path={`/books/${book.slug}/`} />
            </div>
          </div>
        </div>
      </section>

      {/* Recommended by */}
      <section id="recommended-by" className="mx-auto max-w-4xl scroll-mt-16 px-5 py-16">
        <h2 className="font-display text-4xl font-bold md:text-5xl">Recommended by</h2>
        <div className="mt-8 space-y-4">
          {recs.map((r, i) => {
            const f = figureBySlug(r.figure)!;
            return (
              <article key={i} className="flex gap-4 rounded-3xl border border-ink/10 bg-white p-5 sm:p-6">
                <Link
                  href={`/figures/${f.slug}/`}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold"
                  style={{ background: f.color.bg, color: f.color.fg }}
                  aria-label={f.name}
                >
                  {initials(f.name)}
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link href={`/figures/${f.slug}/`} className="hover:underline">
                      <h3 className="font-display text-xl font-bold">{f.name}</h3>
                    </Link>
                    <a href={r.source.url} target="_blank" rel="noreferrer" title={`Source: ${r.source.title}`}>
                      <SourceBadge type={r.source.type} />
                    </a>
                  </div>
                  <p className="text-sm text-ink/60">{f.role}</p>
                  {r.quote && (
                    <blockquote className="mt-3 border-l-2 border-accent pl-4 font-display text-lg italic">
                      "{r.quote}"
                    </blockquote>
                  )}
                  <p className="mt-2 text-xs text-ink/55">
                    Spotted in{" "}
                    <a href={r.source.url} target="_blank" rel="noreferrer" className="font-medium underline">
                      {r.source.title}
                    </a>
                    {r.source.date ? ` · ${r.source.date}` : ""}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section id="related" className="border-t border-ink/10 scroll-mt-16">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-display text-4xl font-bold md:text-5xl">
              Readers of this also picked up
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
              {related.map((r) => (
                <Link
                  key={r.book.slug}
                  href={`/books/${r.book.slug}/`}
                  className="group rounded-3xl border border-ink/10 bg-white p-4 transition hover:shadow-[0_8px_30px_rgba(23,19,11,0.08)]"
                >
                  <div className="overflow-hidden rounded-lg shadow-md">
                    <Cover book={r.book} sizes="200px" />
                  </div>
                  <p className="font-display mt-3 font-bold leading-tight group-hover:underline">
                    {r.book.title}
                  </p>
                  <p className="text-sm text-ink/60">{r.book.author}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
