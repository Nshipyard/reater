interface Slice {
  label: string;
  value: number;
  color: string;
}

/** Donut chart, hand-rolled SVG. No chart library, ships almost nothing. */
export function Donut({ items, size = 220 }: { items: Slice[]; size?: number }) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const r = 80;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label="Donut chart">
        {items.map((it, i) => {
          const frac = it.value / total;
          const dash = frac * c;
          const off = acc * c;
          acc += frac;
          return (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={it.color}
              strokeWidth="34"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-off}
              transform="rotate(-90 100 100)"
            />
          );
        })}
        <text x="100" y="96" textAnchor="middle" fontSize="30" fontWeight="700" fill="currentColor" className="font-display">
          {total}
        </text>
        <text x="100" y="120" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.6">
          recommendations
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-sm" style={{ background: it.color }} />
            <span className="font-medium">{it.label}</span>
            <span className="text-ink/50">{it.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HBars({
  items,
  color = "#d9481c",
}: {
  items: { label: string; value: number; href?: string }[];
  color?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i}>
          <div className="mb-1 flex items-baseline justify-between gap-4 text-sm">
            {it.href ? (
              <a href={it.href} className="font-medium hover:underline">
                {it.label}
              </a>
            ) : (
              <span className="font-medium">{it.label}</span>
            )}
            <span className="shrink-0 tabular-nums text-ink/60">{it.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full"
              style={{ width: `${(it.value / max) * 100}%`, background: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function YearBars({ items }: { items: { year: number; count: number }[] }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  const W = 560;
  const H = 200;
  const bw = Math.min(34, (W / Math.max(items.length, 1)) * 0.55);
  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full" role="img" aria-label="Recommendations by source year">
      {items.map((it, i) => {
        const h = (it.count / max) * H;
        const x = (i + 0.5) * (W / items.length) - bw / 2;
        return (
          <g key={it.year}>
            <rect x={x} y={H - h} width={bw} height={h} rx="4" fill="#d9481c" opacity="0.85" />
            <text x={x + bw / 2} y={H + 20} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.6">
              {it.year}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

interface NetNode {
  name: string;
  color?: string;
}

/** Bipartite figure/book recommendation web. */
export function NetworkGraph({
  figures,
  books,
  links,
}: {
  figures: NetNode[];
  books: NetNode[];
  links: [number, number][];
}) {
  const W = 720;
  const rowH = 44;
  const H = Math.max(figures.length, books.length) * rowH + 20;
  const fx = 130;
  const bx = W - 130;
  const fy = (i: number) => 20 + i * rowH;
  const by = (i: number) => 20 + i * rowH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Network of who recommended which books">
      {links.map(([fi, bi], i) => (
        <path
          key={i}
          d={`M ${fx} ${fy(fi)} C ${fx + 140} ${fy(fi)}, ${bx - 140} ${by(bi)}, ${bx} ${by(bi)}`}
          fill="none"
          stroke="#d9481c"
          strokeWidth="1.4"
          opacity="0.35"
        />
      ))}
      {figures.map((f, i) => (
        <g key={i}>
          <circle cx={fx} cy={fy(i)} r="7" fill={f.color || "#17130b"} />
          <text x={fx - 16} y={fy(i) + 5} textAnchor="end" fontSize="13" fill="currentColor">
            {f.name}
          </text>
        </g>
      ))}
      {books.map((b, i) => (
        <g key={i}>
          <circle cx={bx} cy={by(i)} r="7" fill="none" stroke="#17130b" strokeWidth="2" />
          <text x={bx + 16} y={by(i) + 5} fontSize="13" fill="currentColor">
            {b.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
