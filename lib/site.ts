export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://books.nshipyard.com";
export const SITE_NAME = "Reater";

export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "";
export const MAGIC_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY || "";
export const TALLY_FORM_ID = process.env.NEXT_PUBLIC_TALLY_FORM_ID || "";

export function amazonUrl(asin: string): string {
  return AMAZON_TAG
    ? `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`
    : `https://www.amazon.com/dp/${asin}`;
}

export function audibleUrl(asin: string): string {
  return `https://www.audible.com/pd/${asin}`;
}

export function coverUrl(
  isbn13: string,
  size: "S" | "M" | "L" = "M"
): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn13}-${size}.jpg?default=false`;
}

export function coverUrlById(
  coverId: number,
  size: "S" | "M" | "L" = "M"
): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg?default=false`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
