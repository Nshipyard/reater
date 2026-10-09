import type { SourceType } from "@/lib/types";

const LABELS: Record<SourceType, string> = {
  podcast: "Podcast",
  youtube: "YouTube",
  blog: "Blog",
  interview: "Interview",
  newsletter: "Newsletter",
  book: "Book",
  tweet: "Post",
  list: "Reading list",
};

function Icon({ type }: { type: SourceType }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;
  switch (type) {
    case "podcast":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" {...p}>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <path d="M12 19v3" />
        </svg>
      );
    case "youtube":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" {...p}>
          <rect x="2" y="5" width="20" height="14" rx="4" />
          <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "blog":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" {...p}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      );
    case "interview":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" {...p}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "newsletter":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" {...p}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 6L2 7" />
        </svg>
      );
    case "book":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" {...p}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "tweet":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" {...p}>
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      );
    case "list":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" {...p}>
          <path d="M8 6h13M8 12h13M8 18h13" />
          <path d="M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
  }
}

export function SourceBadge({ type }: { type: SourceType }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-current/20 px-2.5 py-1 text-xs font-medium opacity-80">
      <Icon type={type} />
      {LABELS[type]}
    </span>
  );
}

export function sourceLabel(type: SourceType): string {
  return LABELS[type];
}
