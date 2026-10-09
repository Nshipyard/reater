"use client";
import { useRef, useState } from "react";
import type { Book } from "@/lib/types";
import { Cover } from "./Cover";

interface Props {
  book: Book;
  width?: number;
  eager?: boolean;
}

/**
 * A book you can turn. Drag horizontally to rotate between
 * front cover, spine, and page edges.
 */
export function Book3D({ book, width = 230, eager = false }: Props) {
  const [ry, setRy] = useState(26);
  const drag = useRef<{ startX: number; startRy: number } | null>(null);

  const height = Math.round(width * 1.5);
  const t = Math.max(16, Math.round(width * 0.11));
  const spineFont = Math.max(10, Math.round(width * 0.055));

  return (
    <div className="book3d-scene" style={{ width, height: height + 34 }}>
      <div
        className="book3d"
        role="img"
        aria-label={`Three-dimensional view of ${book.title} by ${book.author}. Drag to rotate.`}
        title="Drag to rotate"
        style={{ width, height, transform: `rotateY(${ry}deg)` }}
        onPointerDown={(e) => {
          drag.current = { startX: e.clientX, startRy: ry };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const next = d.startRy + (e.clientX - d.startX) * 0.45;
          setRy(Math.max(-24, Math.min(72, next)));
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        {/* front cover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateZ(${t / 2}px)`,
            overflow: "hidden",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.10)",
            background: "#e8e0cc",
          }}
        >
          <Cover
            isbn={book.isbn13}
            title={book.title}
            author={book.author}
            slug={book.slug}
            eager={eager}
            sizes={`${width}px`}
          />
        </div>
        {/* back cover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `rotateY(180deg) translateZ(${t / 2}px)`,
            background: "#26211a",
          }}
        />
        {/* spine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: t,
            left: -t / 2,
            transform: "rotateY(-90deg)",
            background: "#26211a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="font-display"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              color: "#f2ecdc",
              fontSize: spineFont,
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              maxHeight: "92%",
            }}
          >
            {book.title} · {book.author}
          </span>
        </div>
        {/* page edges, right */}
        <div
          className="book3d-pages"
          style={{
            position: "absolute",
            top: 2,
            bottom: 2,
            width: t,
            right: -t / 2,
            transform: "rotateY(90deg)",
          }}
        />
        {/* page edges, top */}
        <div
          className="book3d-pages"
          style={{
            position: "absolute",
            left: 2,
            right: 2,
            height: t,
            top: -t / 2,
            transform: "rotateX(90deg)",
          }}
        />
      </div>
      <div
        aria-hidden
        style={{
          width: width * 0.82,
          height: 20,
          margin: "14px auto 0",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.35), transparent 70%)",
        }}
      />
    </div>
  );
}
