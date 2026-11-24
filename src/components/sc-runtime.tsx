"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/* Mounts the scrollcraft engine on every route (the engine registers window
   listeners and rAF loops, so each route change destroys the previous
   instance), and renders the scroll-to-top control that appears after the
   first viewport and a half of scroll. */
export default function ScRuntime() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let inst: { destroy?: () => void } | null = null;
    let tries = 0;
    const tick = () => {
      const SC = (window as unknown as {
        ScrollCraft?: { mount: (r: HTMLElement) => { destroy?: () => void } };
      }).ScrollCraft;
      if (SC) inst = SC.mount(document.body);
      else if (tries++ < 60) setTimeout(tick, 50);
    };
    tick();
    return () => {
      try {
        inst?.destroy?.();
      } catch {
        /* the instance is already gone */
      }
    };
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > window.innerHeight * 1.2);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className="tt-top"
      aria-label="Back to top"
      data-show={showTop ? "true" : "false"}
      onClick={() => {
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
