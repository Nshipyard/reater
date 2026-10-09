import Link from "next/link";
import type { Metadata } from "next";
import {
  FIGURES,
  RECS,
  bookCounts,
  sourceTypeCounts,
  categoryCounts,
  yearCounts,
  topSources,
  SOURCE_COLORS,
  SOURCE_LABELS,
} from "@/lib/data";
import { Donut, HBars, YearBars, NetworkGraph } from "@/components/charts";
import { SourceBadge } from "@/components/SourceBadge";

export const metadata: Metadata = {
  title: "Charts and Insights",
  description:
    "What the data says: where influential figures recommend books, which categories dominate, and which sources surface the most picks.",
};

export default function ChartsPage() {
  const sources = sourceTypeCounts().map((s) => ({
    label: SOURCE_LABELS[s.type] || s.type,
    value: s.count,
    color: SOURCE_COLORS[s.type] || "#888",
  }));
  const top = bookCounts().slice(0, 10);
  const cats = categoryCounts().slice(0, 10);
  const years = yearCounts();
  const topSrc = topSources(8);

  const netBooks = top.slice(0, 8);
  const netFigures = [...new Map(top.flatMap((t) => t.figures).map((f) => [f.slug, f])).values()].slice(0, 12);
  const netLinks: [number, number][] = [];
  netBooks.forEach((t, bi) => {
    t.figures.forEach((f) => {
      const fi = netFigures.findIndex((x) => x.slug === f.slug);
      if (fi >= 0) netLinks.push([fi, bi]);
    });
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
        Charts and insights
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        {RECS.length} recommendations from {FIGURES.length} figures, and counting.
        Because every pick carries its source, the dataset answers questions no
        book list can.
      </p>

      <section className="mt-14 rounded-[2rem] bg-ink p-8 text-paper md:p-12">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Where do recommendations surface?
        </h2>
        <p className="mt-3 max-w-2xl text-paper/70">
          The mix of podcasts, blogs, interviews, and lists behind every pick.
          If you want to find what influential people read next, this is where
          to listen.
        </p>
        <div className="mt-8">
          <Donut items={sources} />
        </div>
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <section className="rounded-[2rem] border border-ink/10 bg-white p-8">
          <h2 className="font-display text-3xl font-bold">Most recommended books</h2>
          <div className="mt-6">
            <HBars
              items={top.map((t) => ({
                label: `${t.book.title} (${t.book.author})`,
                value: t.count,
                href: `/books/${t.book.slug}/`,
              }))}
            />
          </div>
        </section>
        <section className="rounded-[2rem] border border-ink/10 bg-white p-8">
          <h2 className="font-display text-3xl font-bold">Categories that dominate</h2>
          <div className="mt-6">
            <HBars items={cats.map((c) => ({ label: c.category, value: c.count }))} color="#1d3a8f" />
          </div>
        </section>
      </div>

      {years.length > 1 && (
        <section className="mt-14 rounded-[2rem] border border-ink/10 bg-white p-8 md:p-12">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Recommendations by source year
          </h2>
          <p className="mt-3 max-w-2xl text-ink/70">
            When the sources behind the picks were published. A living dataset
            keeps moving right.
          </p>
          <div className="mt-8">
            <YearBars items={years} />
          </div>
        </section>
      )}

      <section className="mt-14">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          The recommendation web
        </h2>
        <p className="mt-3 max-w-2xl text-ink/70">
          Figures on the left, their most-picked books on the right. The
          densest knots are the closest thing the influential have to a shared
          canon.
        </p>
        <div className="mt-8 rounded-[2rem] border border-ink/10 bg-white p-6 md:p-10">
          <NetworkGraph
            figures={netFigures.map((f) => ({ name: f.name, color: f.color.bg }))}
            books={netBooks.map((t) => ({ name: t.book.title }))}
            links={netLinks}
          />
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] border border-ink/10 bg-white p-8 md:p-12">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Sources that surface the most picks
        </h2>
        <ul className="mt-8 space-y-3">
          {topSrc.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 rounded-2xl border border-ink/10 px-5 py-4 transition hover:border-ink"
              >
                <span className="flex items-center gap-3">
                  <SourceBadge type={s.type as "podcast"} />
                  <span className="font-medium">{s.title}</span>
                </span>
                <span className="text-sm text-ink/50">{s.count} picks →</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link href="/about/" className="font-semibold text-accent hover:underline">
            How the dataset is built →
          </Link>
        </p>
      </section>
    </div>
  );
}
