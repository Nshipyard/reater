import type { MetadataRoute } from "next";
import { FIGURES, BOOKS } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["", "/figures/", "/books/", "/top/", "/charts/", "/about/"].map(
    (p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.8,
    })
  );
  const figures = FIGURES.map((f) => ({
    url: `${SITE_URL}/figures/${f.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
  const books = BOOKS.map((b) => ({
    url: `${SITE_URL}/books/${b.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...staticPages, ...figures, ...books];
}
