import figuresData from "@/data/figures.json";
import booksData from "@/data/books.json";
import recsData from "@/data/recommendations.json";
import type { Book, Figure, Recommendation } from "./types";

export const FIGURES = figuresData as Figure[];
export const BOOKS = booksData as Book[];
export const RECS = recsData as Recommendation[];

export const figureBySlug = (slug: string) =>
  FIGURES.find((f) => f.slug === slug);

export const bookBySlug = (slug: string) => BOOKS.find((b) => b.slug === slug);

export const recsForFigure = (slug: string) =>
  RECS.filter((r) => r.figure === slug);

export const recsForBook = (slug: string) => RECS.filter((r) => r.book === slug);

export interface BookCount {
  book: Book;
  count: number;
  figures: Figure[];
}

export function bookCounts(): BookCount[] {
  const map = new Map<string, { figures: Figure[] }>();
  for (const r of RECS) {
    const entry = map.get(r.book) || { figures: [] };
    const fig = figureBySlug(r.figure);
    if (fig && !entry.figures.some((f) => f.slug === fig.slug)) {
      entry.figures.push(fig);
    }
    map.set(r.book, entry);
  }
  return [...map.entries()]
    .map(([slug, v]) => ({ book: bookBySlug(slug)!, count: v.figures.length, figures: v.figures }))
    .filter((b) => b.book)
    .sort((a, b) => b.count - a.count || a.book.title.localeCompare(b.book.title));
}

export const topBooks = (n: number) => bookCounts().slice(0, n);

export function sourceTypeCounts(): { type: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of RECS) map.set(r.source.type, (map.get(r.source.type) || 0) + 1);
  return [...map.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

export function categoryCounts(): { category: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of RECS) {
    const book = bookBySlug(r.book);
    if (!book) continue;
    for (const c of book.categories)
      map.set(c, (map.get(c) || 0) + 1);
  }
  return [...map.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function yearCounts(): { year: number; count: number }[] {
  const map = new Map<number, number>();
  for (const r of RECS) {
    const d = r.source.date;
    if (!d) continue;
    const y = parseInt(d.slice(0, 4), 10);
    if (!Number.isNaN(y)) map.set(y, (map.get(y) || 0) + 1);
  }
  return [...map.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
}

export function topSources(n: number): { title: string; url: string; type: string; count: number }[] {
  const map = new Map<string, { title: string; url: string; type: string; count: number }>();
  for (const r of RECS) {
    const key = r.source.url;
    const e = map.get(key) || {
      title: r.source.title,
      url: r.source.url,
      type: r.source.type,
      count: 0,
    };
    e.count += 1;
    map.set(key, e);
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, n);
}

export function relatedBooks(slug: string, n: number): BookCount[] {
  const figs = new Set(recsForBook(slug).map((r) => r.figure));
  const scores = new Map<string, number>();
  for (const r of RECS) {
    if (r.book === slug) continue;
    if (figs.has(r.figure)) scores.set(r.book, (scores.get(r.book) || 0) + 1);
  }
  return [...scores.entries()]
    .map(([s, count]) => ({ book: bookBySlug(s)!, count, figures: [] as Figure[] }))
    .filter((b) => b.book)
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

export function uniqueSources() {
  const map = new Map<string, Recommendation["source"]>();
  for (const r of RECS) if (!map.has(r.source.url)) map.set(r.source.url, r.source);
  return [...map.values()];
}

export const SOURCE_COLORS: Record<string, string> = {
  podcast: "#8B7CFF",
  youtube: "#E5484D",
  blog: "#2F7D4F",
  interview: "#E8A13D",
  newsletter: "#3D7DE8",
  book: "#8A5A2B",
  tweet: "#17130B",
  list: "#D9481C",
};

export const SOURCE_LABELS: Record<string, string> = {
  podcast: "Podcasts",
  youtube: "YouTube",
  blog: "Blogs",
  interview: "Interviews",
  newsletter: "Newsletters",
  book: "Books",
  tweet: "Posts",
  list: "Reading lists",
};
