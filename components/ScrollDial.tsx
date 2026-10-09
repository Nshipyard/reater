"use client";
import { useEffect, useState } from "react";

export interface DialSection {
  id: string;
  label: string;
}

/** Fixed left-rail section navigator, Stripe Press style. */
export function ScrollDial({
  sections,
  accent = "#d9481c",
}: {
  sections: DialSection[];
  accent?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const key = JSON.stringify(sections);

  useEffect(() => {
    const list: DialSection[] = JSON.parse(key);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    list.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [key]);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="opacity-50 transition hover:opacity-100"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => go(s.id)}
          title={s.label}
          aria-label={s.label}
          aria-current={active === s.id ? "true" : undefined}
          className="scroll-dial-dash rounded-full"
          style={{
            width: 4,
            height: active === s.id ? 30 : 14,
            background: active === s.id ? accent : "currentColor",
            opacity: active === s.id ? 1 : 0.28,
          }}
        />
      ))}
    </nav>
  );
}
