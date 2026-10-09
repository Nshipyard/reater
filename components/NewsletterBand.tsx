"use client";
import { useEffect, useRef } from "react";
import { TALLY_FORM_ID } from "@/lib/site";

/**
 * Newsletter capture. Embeds the Tally form when an ID is configured,
 * otherwise points at the Substack.
 */
export function NewsletterBand() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!TALLY_FORM_ID || !ref.current) return;
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error tally global
      if (window.Tally) window.Tally.loadEmbeds();
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="newsletter" className="mx-auto max-w-6xl scroll-mt-24 px-5">
      <div className="paper-grain rounded-[2rem] bg-ink px-8 py-14 text-center text-paper md:py-20">
        <p className="font-display text-4xl font-bold md:text-5xl">
          The Sunday Stack
        </p>
        <p className="mx-auto mt-4 max-w-xl text-paper/70">
          Five books the influential are reading, every Sunday morning. Read by
          founders, investors, and the simply curious.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          {TALLY_FORM_ID ? (
            <div ref={ref}>
              <iframe
                data-tally-src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1`}
                width="100%"
                height="180"
                title="Subscribe to the Sunday Stack"
                style={{ border: 0 }}
              />
            </div>
          ) : (
            <a
              href="https://richardson.substack.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-paper px-8 py-4 font-semibold text-ink transition hover:bg-accent hover:text-white"
            >
              Subscribe on Substack
            </a>
          )}
        </div>
        <p className="mt-5 text-xs text-paper/40">
          One email a week. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
