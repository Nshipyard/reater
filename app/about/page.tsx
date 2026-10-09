import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How Reater collects book recommendations, tracks their sources, and serves them to humans and AI agents.",
};

const SOURCE_TYPES = [
  ["Podcasts", "A host asks what a guest is reading, or a guest brings it up unprompted."],
  ["YouTube", "Interviews, lectures, and long-form conversations."],
  ["Blogs", "Personal essays and annual lists published on personal sites."],
  ["Interviews", "Print and broadcast interviews with a reading question."],
  ["Newsletters", "What authors put in their own dispatches."],
  ["Books", "Books recommended inside other books: forewords, bibliographies, acknowledgments."],
  ["Posts", "Short-form public posts naming a book."],
  ["Reading lists", "Official annual or topical lists published by the figure."],
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
        Methodology
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/80">
        Reater answers one question: what do influential people actually read?
        Not what their publicist says they read. What they name, unprompted or
        on the record, in public.
      </p>

      <h2 className="font-display mt-14 text-3xl font-bold md:text-4xl">
        What counts as a recommendation
      </h2>
      <ul className="mt-6 space-y-4 text-lg leading-relaxed text-ink/80">
        <li>
          <strong>1. Public.</strong> The recommendation appeared somewhere
          anyone can check: a podcast episode, a published interview, a blog
          post, a list.
        </li>
        <li>
          <strong>2. Attributed.</strong> The figure named the book themselves,
          or their official list did. No "people like them also read" guessing.
        </li>
        <li>
          <strong>3. Sourced.</strong> Every entry links to the exact source.
          If a source disappears, the entry is flagged, not silently kept.
        </li>
      </ul>

      <h2 className="font-display mt-14 text-3xl font-bold md:text-4xl">
        Why sources are the product
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-ink/80">
        Tracking where a recommendation surfaced turns a list into a dataset.
        It shows which podcasts surface the most books, which newsletters break
        new picks first, and how taste travels between fields. The{" "}
        <a href="/charts/" className="font-semibold text-accent hover:underline">
          charts page
        </a>{" "}
        is built entirely from this source metadata.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {SOURCE_TYPES.map(([name, desc]) => (
          <div key={name} className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="font-display text-xl font-bold">{name}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{desc}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display mt-14 text-3xl font-bold md:text-4xl">
        Built for AI agents
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-ink/80">
        Reater is agent-first. Every page is semantic HTML with JSON-LD, and
        the whole dataset ships as JSON:
      </p>
      <ul className="mt-6 space-y-2 text-lg">
        <li><a href="/llms.txt" className="font-semibold text-accent hover:underline">/llms.txt</a> <span className="text-ink/60">- site summary for language models</span></li>
        <li><a href="/api/figures.json" className="font-semibold text-accent hover:underline">/api/figures.json</a></li>
        <li><a href="/api/books.json" className="font-semibold text-accent hover:underline">/api/books.json</a></li>
        <li><a href="/api/recommendations.json" className="font-semibold text-accent hover:underline">/api/recommendations.json</a></li>
      </ul>

      <h2 className="font-display mt-14 text-3xl font-bold md:text-4xl">
        Money and independence
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-ink/80">
        Reater earns as an Amazon Associate when readers buy through links on
        this site, and through Audible referrals. Rankings are never for sale:
        order is computed from the data, and sponsored placement does not
        exist here.
      </p>
      <p className="mt-6 text-lg leading-relaxed text-ink/80">
        Corrections welcome. If a recommendation is misattributed or a source
        link rots, it gets fixed or removed.
      </p>
    </div>
  );
}
