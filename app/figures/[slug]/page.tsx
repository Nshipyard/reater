import Link from "next/link";
import type { Metadata } from "next";
import {
  FIGURES,
  figureBySlug,
  bookBySlug,
  recsForFigure,
  recsForBook,
  uniqueSources,
} from "@/lib/data";
import { Book3D } from "@/components/Book3D";
import { ScrollDial } from "@/components/ScrollDial";
import { SourceBadge } from "@/components/SourceBadge";
import { ShareButton } from "@/components/BuyButtons";
import { FigureReadingList } from "@/components/FigureReadingList";
import { FigureCard } from "@/components/FigureCard";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, initials } from "@/lib/site";

export async function generateStaticParams() {
  return FIGURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = figureBySlug(slug)!;
  const count = recsForFigure(slug).length;
  const title = `${f.name}'s Reading List: ${count} Books Recommended`;
  const description = `Every book ${f.name} (${f.role}) has publicly recommended, each tracked to the podcast, interview, or list where it appeared.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "profile" },
  };
}

export default async function FigurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const figure = figureBySlug(slug)!;
  const recs = recsForFigure(slug);
  const enriched = recs.map((rec) => {
    const book = bookBySlug(rec.book)!;
    const alsoBy = recsForBook(rec.book)
      .map((r) => figureBySlug(r.figure)!)
      .filter((f) => f && f.slug !== slug);
    return { rec, book, alsoBy };
  });
  const heroBooks = enriched.slice(0, 3).map((e) => e.book);
  const sources = uniqueSources().filter((s) =>
    recs.some((r) => r.source.url === s.url)
  );
  const others = FIGURES.filter((f) => f.slug !== slug)
    .slice(0, 3)
    .map((f) => {
      const fr = recsForFigure(f.slug);
      return {
        ...f,
        bookCount: fr.length,
        topBooks: fr
          .slice(0, 3)
          .map((r) => bookBySlug(r.book)!)
          .filter(Boolean)
          .map((b) => ({ slug: b.slug, title: b.title, author: b.author, isbn13: b.isbn13, coverId: b.coverId })),
      };
    });

  const { bg, fg, accent } = figure.color;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: figure.name,
            jobTitle: figure.role,
            description: figure.bio,
            url: `${SITE_URL}/figures/${figure.slug}/`,
          },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Figures", item: `${SITE_URL}/figures/` },
              { "@type": "ListItem", position: 3, name: figure.name },
            ],
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${figure.name}'s reading list`,
          itemListElement: enriched.map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Book",
              name: e.book.title,
              author: e.book.author,
              url: `${SITE_URL}/books/${e.book.slug}/`,
            },
          })),
        }}
      />

      <ScrollDial
        sections={[
          { id: "overview", label: "Overview" },
          { id: "reading-list", label: "Reading list" },
          { id: "sources", label: "Sources" },
        ]}
        accent={accent}
      />

      {/* Hero */}
      <section id="overview" className="scroll-mt-16" style={{ background: bg, color: fg }}>
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
            Reading list
          </p>
          <h1 className="font-display mt-4 max-w-4xl text-6xl font-bold leading-[0.95] tracking-tight md:text-8xl">
            {figure.name}
          </h1>
          <p className="mt-4 text-xl opacity-80">{figure.role}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">{figure.bio}</p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dd className="font-display text-4xl font-bold">{recs.length}</dd>
              <dd className="text-sm opacity-70">books tracked</dd>
            </div>
            <div>
              <dd className="font-display text-4xl font-bold">{sources.length}</dd>
              <dd className="text-sm opacity-70">sources cited</dd>
            </div>
          </dl>

          <div className="mt-12 flex flex-wrap items-end gap-8">
            {heroBooks.map((b) => (
              <Book3D key={b.slug} book={b} width={200} eager />
            ))}
          </div>
          <p className="mt-6 text-sm opacity-60">
            Drag a book to turn it and see the spine.
          </p>
        </div>
      </section>

      {/* Reading list */}
      <section id="reading-list" className="mx-auto max-w-4xl scroll-mt-16 px-5 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            The list
          </h2>
          <ShareButton title={`${figure.name}'s reading list`} path={`/figures/${figure.slug}/`} />
        </div>
        <FigureReadingList figure={figure} recs={enriched} previewCount={5} />
      </section>

      {/* Sources */}
      <section id="sources" className="border-t border-ink/10 bg-white/50 scroll-mt-16">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Sources</h2>
          <p className="mt-4 max-w-2xl text-ink/70">
            Every recommendation on this page was spotted in one of these
            places. This is the dataset: where influential people actually talk
            about books.
          </p>
          <ul className="mt-8 space-y-3">
            {sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white px-5 py-4 transition hover:border-ink"
                >
                  <span className="flex items-center gap-3">
                    <SourceBadge type={s.type} />
                    <span className="font-medium">{s.title}</span>
                  </span>
                  <span className="text-sm text-ink/50">
                    {recs.filter((r) => r.source.url === s.url).length} picks →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* More figures */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display mb-6 text-3xl font-bold md:text-4xl">Keep exploring</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((f) => (
            <FigureCard key={f.slug} figure={f} />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/figures/" className="font-semibold text-accent hover:underline">
            Browse all figures →
          </Link>
        </div>
      </section>
    </>
  );
}
