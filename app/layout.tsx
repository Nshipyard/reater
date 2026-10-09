import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const OG_TITLE = "Reater: What the world's most influential people read";
const OG_DESCRIPTION =
  "752 book recommendations from 150 of the world's most influential people, each tracked to the source where it appeared.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: OG_TITLE,
    template: "%s | Reater",
  },
  description: OG_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Reater",
    url: SITE_URL,
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-card.png`,
        width: 1200,
        height: 630,
        alt: OG_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [`${SITE_URL}/og-card.png`],
  },
  robots: { index: true, follow: true },
};

function Header() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">
          Reater
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link href="/figures/" className="hidden hover:underline sm:inline">
            Figures
          </Link>
          <Link href="/top/" className="hidden hover:underline sm:inline">
            Top Books
          </Link>
          <Link href="/charts/" className="hidden hover:underline sm:inline">
            Charts
          </Link>
          <Link href="/about/" className="hidden hover:underline sm:inline">
            About
          </Link>
          <Link
            href="/#newsletter"
            className="rounded-full bg-ink px-4 py-2 text-paper transition hover:bg-accent"
          >
            Get the reading list
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">Reater</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/70">
            What the world's most influential people read, collected in one
            searchable place. Every recommendation is tracked to the source
            where it appeared.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold uppercase tracking-wider text-paper/50">
            Explore
          </p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/figures/" className="hover:underline">Figures</Link></li>
            <li><Link href="/top/" className="hover:underline">Most recommended books</Link></li>
            <li><Link href="/charts/" className="hover:underline">Charts and insights</Link></li>
            <li><Link href="/about/" className="hover:underline">Methodology</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold uppercase tracking-wider text-paper/50">
            For AI agents
          </p>
          <ul className="mt-3 space-y-2">
            <li><a href="/llms.txt" className="hover:underline">llms.txt</a></li>
            <li><a href="/api/figures.json" className="hover:underline">Figures API</a></li>
            <li><a href="/api/books.json" className="hover:underline">Books API</a></li>
            <li><a href="/api/recommendations.json" className="hover:underline">Recommendations API</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-paper/50 sm:flex-row sm:justify-between">
          <p>
            As an Amazon Associate, Reater earns from qualifying purchases made
            through links on this site.
          </p>
          <p>
            Built by <a href="https://x.com/richardsondx" className="underline">Richardson Dackam</a>
            {" · "}
            <a href="https://github.com/richardsondx" className="underline">GitHub</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
