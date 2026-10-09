import Link from "next/link";
import { Portrait } from "./Portrait";

type StackFigure = {
  slug: string;
  name: string;
  color: { bg: string; fg: string };
};

/** Overlapping row of clickable circular reader avatars (real portraits). */
export function AvatarStack({ figures, max = 8 }: { figures: StackFigure[]; max?: number }) {
  if (figures.length === 0) return null;
  const shown = figures.slice(0, max);
  const rest = figures.length - shown.length;
  return (
    <div className="flex items-center" role="list" aria-label="Readers">
      {shown.map((f, i) => (
        <Link
          key={f.slug}
          href={`/figures/${f.slug}/`}
          title={f.name}
          aria-label={f.name}
          role="listitem"
          className="block rounded-full ring-2 ring-paper transition-transform hover:z-20 hover:scale-110"
          style={{ marginLeft: i === 0 ? 0 : -10, zIndex: shown.length - i }}
        >
          <Portrait
            slug={f.slug}
            name={f.name}
            bg={f.color.bg}
            fg={f.color.fg}
            className="h-11 w-11 rounded-full text-sm"
          />
        </Link>
      ))}
      {rest > 0 && (
        <span
          className="font-display flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sm font-bold text-paper ring-2 ring-paper"
          style={{ marginLeft: -10, zIndex: 0 }}
          title={`${rest} more`}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}
