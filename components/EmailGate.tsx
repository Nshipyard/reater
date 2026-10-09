"use client";
import { useEffect, useState } from "react";
import { MAGIC_PUBLISHABLE_KEY } from "@/lib/site";

type State = "idle" | "sent" | "verifying" | "done";

interface Props {
  figureSlug: string;
  figureName: string;
  accent?: string;
  onUnlock: () => void;
}

/**
 * Email gate for the full reading list. Uses magic.link when a publishable
 * key is configured; otherwise runs an honest labeled demo of the flow.
 */
export function EmailGate({ figureSlug, figureName, accent = "#d9481c", onUnlock }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const storageKey = `reater_verified_${figureSlug}`;
  const realMode = MAGIC_PUBLISHABLE_KEY.length > 0;

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey)) {
        setState("done");
        onUnlock();
      }
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    setState("done");
    onUnlock();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (realMode) {
      setState("verifying");
      try {
        const { Magic } = await import("magic-sdk");
        const magic = new Magic(MAGIC_PUBLISHABLE_KEY);
        await magic.auth.loginWithEmailOTP({ email });
        finish();
      } catch {
        setError("Verification failed. Try again.");
        setState("idle");
      }
    } else {
      setState("sent");
    }
  };

  if (state === "done") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-ink/15 bg-white/60 p-5">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full text-white"
          style={{ background: accent }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <p className="text-sm">
          <strong>Verified.</strong> The full list is unlocked on this browser.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-2 border-dashed border-ink/20 bg-white/70 p-8 text-center">
      <p className="font-display text-3xl font-bold">
        Unlock {figureName}'s full reading list
      </p>
      <p className="mx-auto mt-3 max-w-md text-ink/70">
        Enter your email, click the verification link we send, and the complete
        list opens. You also join the Sunday reading email. No spam, unsubscribe
        anytime.
      </p>

      {state === "idle" || state === "verifying" ? (
        <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            disabled={state === "verifying"}
            className="flex-1 rounded-full border border-ink/20 bg-white px-5 py-3 outline-none focus:border-ink"
          />
          <button
            type="submit"
            disabled={state === "verifying"}
            className="rounded-full px-6 py-3 font-semibold text-white transition disabled:opacity-60"
            style={{ background: accent }}
          >
            {state === "verifying" ? "Verifying." : "Send my link"}
          </button>
        </form>
      ) : (
        <div className="mx-auto mt-6 max-w-md rounded-2xl bg-paper p-5 text-left">
          <p className="font-semibold">Check your inbox</p>
          <p className="mt-1 text-sm text-ink/70">
            We sent a verification link to <strong>{email}</strong>. Click it
            and this list unlocks.
          </p>
          {!realMode && (
            <button
              onClick={finish}
              className="mt-4 rounded-full border border-ink/25 px-4 py-2 text-sm font-medium hover:bg-white"
            >
              Simulate the verification click (demo mode)
            </button>
          )}
        </div>
      )}
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {!realMode && state === "idle" && (
        <p className="mt-4 text-xs text-ink/50">
          Demo mode: connect a magic.link key to send real verification emails.
        </p>
      )}
    </div>
  );
}
