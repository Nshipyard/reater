# Reater

What the world's most influential people read, collected in one searchable
place. Every recommendation is tracked to the source where it appeared
(podcast, YouTube, blog, interview, newsletter, reading list).

Live at **https://books.nshipyard.com**

## What it is

- **Figure profiles** (`/figures/[slug]`): full reading lists with per-book
  sources, 3D rotatable book covers, an email-gated full-list unlock.
- **Book pages** (`/books/[slug]`): every figure who recommended the book,
  the "web" of shared taste, related books.
- **Most recommended** (`/top`): ranked by recommender count, filterable by
  category.
- **Charts** (`/charts`): where recommendations surface, category mix,
  timeline, top sources, and the figure/book recommendation network.
- **AI-agent-first**: semantic HTML, JSON-LD on every page, `/llms.txt`,
  and JSON data at `/api/figures.json`, `/api/books.json`,
  `/api/recommendations.json`.

## Data model

`data/` holds three JSON files:

- `figures.json`: slug, name, role, category, bio, listUrl, color theme
- `books.json`: slug, title, author, isbn13 (Open Library covers), asin
  (Amazon), audibleAsin (Audible), year, categories
- `recommendations.json`: figure slug, book slug, optional verbatim quote,
  and source `{type, title, url, date}`

Covers come from the Open Library covers API by ISBN. Books without a
verified ISBN render a typographic fallback cover.

## Source tracking

Each recommendation records where it was spotted. Source types: podcast,
youtube, blog, interview, newsletter, book, tweet, list. This metadata
powers the charts page and is the dataset's moat: it shows where
influential people talk about books.

## Monetization

- Amazon Associates links on every book with an ASIN (`Buy on Amazon`).
- Audible links where an audiobook ASIN exists.
- Email capture: magic.link verification unlocks full reading lists and
  joins the Sunday Stack newsletter (Tally embed when configured).

## Environment

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SITE_URL` - canonical URL (default https://books.nshipyard.com)
- `NEXT_PUBLIC_AMAZON_TAG` - Amazon Associates tag (links work without it)
- `NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY` - enables real magic.link email
  verification; without it the gate runs a labeled demo
- `NEXT_PUBLIC_TALLY_FORM_ID` - Tally form for the newsletter band;
  without it, the band links to Substack

## Develop

```bash
npm install
npm run dev
```

## Build and deploy

Static export (`output: "export"`). `prebuild` regenerates `public/api/*.json`
and `public/llms.txt` from `data/`.

```bash
npm run build   # outputs to out/
```

Deploys to Vercel; `books.nshipyard.com` points at the deployment.

## Author

Richardson Dackam - [X](https://x.com/richardsondx) - [GitHub](https://github.com/richardsondx)
