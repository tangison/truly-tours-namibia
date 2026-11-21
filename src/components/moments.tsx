"use client";

/**
 * The page's two dealt moments (taste-skill moments.mjs pick --page service --count 2),
 * driven by GSAP ScrollTrigger (gsap-scrolltrigger skill), not by the kit's own moment
 * modules, because this build was asked to use GSAP.
 *
 * 1. pinned-chapters (scroll, scrubbed): the 13-day grand tour section holds on screen
 *    for two screens of scroll while its four chapters open one at a time and the frame
 *    crossfades to each chapter's picture. Position: sticky inside its own 2-screen box,
 *    GSAP scrubbed to the scrollbar, a finished state at both ends (moments.md rules).
 * 2. picture-develops (enter, once): the Etosha photograph develops like a print, 1.6s,
 *    the moment it enters the viewport.
 *
 * Rules honoured (motion.md / moments.md): scrub OR toggleActions, never both; top-level
 * ScrollTriggers only; created in page order; refresh() after images load; everything
 * rests under prefers-reduced-motion and shows its finished state without script.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ kit loader
   the taste-skill's behaviour layer (nav sheet, hover, hero entrance), loaded
   as modules after hydration (the kit expects script tags at body end) */
export function KitScripts() {
  useEffect(() => {
    const srcs = [
      "/assets/system.js",
      "/assets/motion/motion.js",
      "/assets/layout/layout.js",
    ];
    const nodes = srcs.map((src) => {
      const s = document.createElement("script");
      s.type = "module";
      s.src = src;
      document.body.appendChild(s);
      return s;
    });
    return () => nodes.forEach((n) => n.remove());
  }, []);
  return null;
}

const LIVE_QUERY = "(min-width: 1024px)";

/* ------------------------------------------------------------------ chapters */
export function TourChapters({
  chapters,
}: {
  chapters: { title: string; text: string; img: string; alt: string }[];
}) {
  const host = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!host.current || reduced()) return;

      // gsap.matchMedia (the gsap-react skill's responsive answer): the pin
      // exists only at 1024px+, and crossing the breakpoint tears it down
      // and restores the rest state cleanly (no stale inline styles)
      const mm = gsap.matchMedia();
      mm.add(LIVE_QUERY, () => {
        const root = host.current!;
        const steps = gsap.utils.toArray<HTMLElement>(".tc-step", root);
        const visuals = gsap.utils.toArray<HTMLElement>(
          ".tc-frame .tc-visual",
          root,
        );
        if (steps.length < 2) return;

        // go live: the CSS pins the grid and hands the frame the visuals
        root.classList.add("is-live");

        gsap.set(steps, { autoAlpha: 1 });
        steps.forEach((step, i) => {
          gsap.set(step.querySelector(".tc-step__in"), {
            height: i === 0 ? "auto" : 0,
            opacity: i === 0 ? 1 : 0,
          });
        });
        visuals.forEach((v, i) =>
          gsap.set(v, {
            autoAlpha: i === 0 ? 1 : 0,
            scale: i === 0 ? 1 : 1.03,
          }),
        );

        // one scrubbed timeline tied to the section's own scroll run (scrub, not toggleActions)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      // hold each chapter for a spell before the next opens, so the 900px run
      // shares itself across all four (moments.md: half the chapter's share
      // moves, the rest holds)
      steps.forEach((_, i) => {
        if (i > 0) tl.to({}, { duration: 0.35 });
        if (i === 0) return;
        tl.to(steps[i - 1].querySelector(".tc-step__in"), {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        })
          .to(
            steps[i - 1].querySelector("h3"),
            { color: "var(--p-muted)", duration: 0.3 },
            "<",
          )
          .to(
            steps[i].querySelector(".tc-step__in"),
            {
              height: "auto",
              opacity: 1,
              duration: 0.5,
              ease: "power2.inOut",
            },
            "<0.15",
          )
          .to(
            steps[i].querySelector("h3"),
            { color: "var(--p-ink)", duration: 0.3 },
            "<",
          )
          .to(
            visuals[i - 1],
            { autoAlpha: 0, duration: 0.45, ease: "power1.inOut" },
            "<",
          )
          .to(
            visuals[i],
            { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power2.out" },
            "<0.05",
          );
      });
      }); // mm.add end
    },
    { scope: host },
  );

  // images load late: recalculate every trigger (gsap-scrolltrigger skill, refresh rule)
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={host}
      className="section tc-host"
      id="chapters"
      style={{ ["--h" as string]: "2" }}
      aria-labelledby="chapters-h"
    >
      <div className="wrap tc-grid">
        <div className="tc-text">
          <h2 id="chapters-h">The grand southern loop, day by day</h2>
          <ol className="tc-steps">
            {chapters.map((c, i) => (
              <li className={`tc-step${i === 0 ? " is-on" : ""}`} key={c.title}>
                <h3>{c.title}</h3>
                <div className="tc-step__in">
                  <p>{c.text}</p>
                  <figure className="tc-visual tc-visual--rest">
                    <img src={c.img} alt={c.alt} loading="lazy" width={1600} height={900} />
                  </figure>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="tc-frame frame">
          {chapters.map((c, i) => (
            <figure className={`tc-visual${i === 0 ? " is-on" : ""}`} key={`f-${c.title}`}>
              <img src={c.img} alt="" loading="lazy" width={1600} height={900} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ develops */
export function DevelopingPhoto({
  img,
  alt,
  className,
}: {
  img: string;
  alt: string;
  className?: string;
}) {
  const host = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!host.current || reduced()) return;
      // one enter moment, 1.6s, runs once (toggleActions play none none none)
      gsap.fromTo(
        host.current,
        { filter: "grayscale(1) brightness(1.25) contrast(0.7)", scale: 1.04 },
        {
          filter: "grayscale(0) brightness(1) contrast(1)",
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: host.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: host },
  );

  return (
    <figure ref={host} className={`develop ${className ?? ""}`}>
      <img src={img} alt={alt} loading="lazy" width={1600} height={900} />
    </figure>
  );
}
