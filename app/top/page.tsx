import type { Metadata } from "next";
import { bookCounts } from "@/lib/data";
import { TopTable } from "@/components/TopTable";

export const metadata: Metadata = {
  title: "Most Recommended Books",
  description:
    "The books recommended by the most influential figures, ranked and filterable by category.",
};

export default function TopPage() {
  const ranked = bookCounts();
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
        Most recommended
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        Ranked by how many influential figures publicly recommended each book.
        Filter by category to find the canon of a field.
      </p>
      <div className="mt-10">
        <TopTable ranked={ranked} />
      </div>
    </div>
  );
}
