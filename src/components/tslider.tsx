"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/site";

/* Guest words: one review at a time, arrows and dots, gentle auto-advance that
   stops for hover, focus, a hidden tab and reduced motion. */
export default function TSlider({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const paused = useRef(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onVis = () => {
      if (document.hidden) paused.current = true;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (reduce.current) return;
    const t = setInterval(() => {
      if (!paused.current) setI((v) => (v + 1) % items.length);
    }, 6500);
    return () => clearInterval(t);
  }, [items.length]);

  const go = (n: number) => setI((n + items.length) % items.length);

  return (
    <div
      className="tt-words"
      role="group"
      aria-roledescription="carousel"
      aria-label="What past guests say"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
      onFocus={() => {
        paused.current = true;
      }}
      onBlur={() => {
        paused.current = false;
      }}
    >
      <div className="tt-words__frame">
        <div className="tt-words__track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {items.map((t, k) => (
            <figure
              key={k}
              className="tt-words__slide"
              aria-hidden={k === i ? undefined : "true"}
              aria-label={`${k + 1} of ${items.length}`}
            >
              <blockquote>{t.quote}</blockquote>
              <figcaption>{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="tt-words__nav">
        <button type="button" aria-label="Previous review" onClick={() => go(i - 1)}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M9 2 4 7l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="tt-words__dots" role="tablist" aria-label="Choose a review">
          {items.map((_, k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`Review ${k + 1}`}
              className="tt-words__dot"
              data-on={k === i ? "true" : "false"}
              onClick={() => go(k)}
            />
          ))}
        </div>
        <button type="button" aria-label="Next review" onClick={() => go(i + 1)}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M5 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
