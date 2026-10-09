export type SourceType =
  | "podcast"
  | "youtube"
  | "blog"
  | "interview"
  | "newsletter"
  | "book"
  | "tweet"
  | "list";

export interface RecSource {
  type: SourceType;
  title: string;
  url: string;
  date: string | null;
}

export interface FigureColor {
  bg: string;
  fg: string;
  accent: string;
}

export interface Figure {
  slug: string;
  name: string;
  role: string;
  category: string;
  bio: string;
  listUrl: string | null;
  color: FigureColor;
}

export interface Book {
  slug: string;
  title: string;
  author: string;
  isbn13: string | null;
  coverId: number | null;
  asin: string | null;
  audibleAsin: string | null;
  year: number | null;
  categories: string[];
}

export interface Recommendation {
  figure: string;
  book: string;
  quote: string | null;
  source: RecSource;
}
