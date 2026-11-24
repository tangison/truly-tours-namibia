"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/* The signature move: a fixed route line along the bottom edge of the page.
   Scroll position is the playhead that draws the line through the country's
   stops; passing a section stamps its waypoint dot; a dot is clickable and
   jumps to that section. Home page only. */

const STOPS = [
  { id: "top", label: "Arrival" },
  { id: "tours", label: "The tours" },
  { id: "routes", label: "Routes in full" },
  { id: "experiences", label: "Experiences" },
  { id: "words", label: "Guest words" },
  { id: "contact", label: "Contact" },
];

/* A stylised route through Namibia: Windhoek, south-west to Sossusvlei, west
   to the coast, north along the escarpment, east into Etosha. */
const PATH =
  "M 20 58 L 150 40 C 210 30 250 34 320 30 L 470 24 C 560 22 620 14 700 12 L 830 10 C 900 9 950 12 980 14";

export default function RouteRail() {
  const pathname = usePathname();
  const pathRef = useRef<SVGPathElement>(null);
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const path = pathRef.current;
    const rail = railRef.current;
    if (!path || !rail) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    if (reduce) {
      path.style.strokeDashoffset = "0";
    }

    const dots = Array.from(rail.querySelectorAll<HTMLElement>(".tt-rail__dot"));

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const t = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
      if (!reduce) {
        path.style.strokeDashoffset = String(len * (1 - t));
      }
      dots.forEach((d, i) => {
        const at = i / (dots.length - 1);
        d.setAttribute("data-done", t >= at - 0.04 ? "true" : "false");
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = STOPS.findIndex((s) => `#${s.id}` === `#${e.target.id}`);
          if (i !== -1) dots[i]?.setAttribute("data-live", e.isIntersecting ? "true" : "false");
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    STOPS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });

    return () => {
      removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <nav ref={railRef} className="tt-rail" aria-label="Route through the page">
      <svg viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
        <path
          className="tt-rail__trace"
          d={PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path ref={pathRef} d={PATH} fill="none" stroke="none" />
      </svg>
      {STOPS.map((s, i) => (
        <button
          key={s.id}
          type="button"
          className="tt-rail__dot"
          style={{ left: `${(i / (STOPS.length - 1)) * 100}%` }}
          data-done="false"
          data-live="false"
          aria-label={`Go to ${s.label}`}
          title={s.label}
          onClick={() => {
            const el = document.getElementById(s.id);
            if (!el) return;
            const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
            el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
          }}
        />
      ))}
    </nav>
  );
}
