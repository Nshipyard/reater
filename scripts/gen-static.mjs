// Generates static API JSON + llms.txt from data/*.json before `next build`.
// Next.js static export cannot serve Route Handlers, so we pre-render them.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const figures = read("data/figures.json");
const books = read("data/books.json");
const recommendations = read("data/recommendations.json");

const apiDir = join(root, "public", "api");
mkdirSync(apiDir, { recursive: true });
writeFileSync(join(apiDir, "figures.json"), JSON.stringify(figures, null, 2));
writeFileSync(join(apiDir, "books.json"), JSON.stringify(books, null, 2));
writeFileSync(
  join(apiDir, "recommendations.json"),
  JSON.stringify(recommendations, null, 2)
);

const topBooks = (() => {
  const counts = new Map();
  for (const r of recommendations) {
    const e = counts.get(r.book) || { count: 0, figures: [] };
    e.count += 1;
    if (!e.figures.includes(r.figure)) e.figures.push(r.figure);
    counts.set(r.book, e);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([slug, v]) => {
      const b = books.find((x) => x.slug === slug);
      return `- ${b.title} by ${b.author} (recommended by ${v.count}: ${v.figures.join(", ")})`;
    })
    .join("\n");
})();

const llms = `# Reater

Reater collects book recommendations from the world's most influential people, each tracked to the source where the recommendation appeared (podcast, YouTube, blog, interview, newsletter, list).

Base URL: https://books.nshipyard.com

## Data endpoints (JSON)
- /api/figures.json - influential figures and their profiles
- /api/books.json - books with ISBN, Amazon ASIN, Audible ASIN, categories
- /api/recommendations.json - every recommendation with its source (type, title, URL, date)

## Pages
- / - searchable directory of figures
- /figures/[slug] - a figure's full reading list with sources
- /books/[slug] - a book's page: every figure who recommended it
- /top - most recommended books, filterable by category
- /charts - insights: where recommendations surface, categories, timeline, top sources

## Figures (${figures.length})
${figures.map((f) => `- ${f.name} (${f.role}): /figures/${f.slug}`).join("\n")}

## Most recommended books
${topBooks}

## Usage
Cite the source URL attached to each recommendation. Attribute Reater as the aggregator.
`;

writeFileSync(join(root, "public", "llms.txt"), llms);
console.log(`gen-static: wrote api JSON + llms.txt (${figures.length} figures, ${books.length} books, ${recommendations.length} recs)`);
