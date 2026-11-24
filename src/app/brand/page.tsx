import type { Metadata } from "next";
import Link from "next/link";
import { SubNav, SubFooter } from "@/components/subpage";

export const metadata: Metadata = {
  title: "Brand: colours, type and logo rules",
  description:
    "The Truly Tours Namibia brand: palette sampled from the logo, Schibsted Grotesk type, wordmark rules and the accent bar.",
  alternates: { canonical: "/brand" },
};

const COLORS = [
  { name: "Paper", hex: "#f4efe8", role: "Page ground" },
  { name: "Surface", hex: "#e9e2d6", role: "Bands and cards" },
  { name: "Ink", hex: "#33291c", role: "Headings and body" },
  { name: "Muted", hex: "#6b6154", role: "Secondary text" },
  { name: "Safari Orange", hex: "#c05a15", role: "Accent, actions, brand bar" },
  { name: "Dark Ground", hex: "#33291c", role: "Closing section" },
];

export default function BrandPage() {
  return (
    <>
      <SubNav />
      <main id="main" className="sc-section" data-sc-act="flow">
        <div className="sc-wrap">
          <div className="tt-doc__head" data-sc-in data-sc-stagger="70">
            <p className="tt-labelrow">Brand</p>
            <h1 className="sc-display sc-display--lg">Colours, type and logo rules</h1>
            <p className="sc-body">
              One system for every Truly Tours Namibia surface. The palette and
              the wordmark below are derived from the client&apos;s own logo
              artwork, so print and web stay consistent.
            </p>
          </div>

          <div data-sc-in data-sc-stagger="60">
            <h2 className="sc-display sc-display--md">Palette</h2>
            <p className="sc-body">
              The accent (#c05a15) is sampled directly from the logo artwork;
              the paper and ink values are the warm neutrals that sit beside it.
              Ink on paper passes WCAG AA at body sizes, and white on Safari
              Orange passes AA for large text and buttons.
            </p>
            <div
              className="tt-wall"
              style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: "var(--sc-5)" }}
            >
              {COLORS.map((c) => (
                <figure key={c.hex} style={{ aspectRatio: "auto" }}>
                  <div
                    style={{
                      background: c.hex,
                      color: c.hex === "#33291c" || c.hex === "#6b6154" ? "#f4efe8" : "#33291c",
                      padding: "24px 16px",
                      height: "100%",
                      boxSizing: "border-box",
                      borderRadius: "var(--sc-r)",
                    }}
                  >
                    <strong style={{ display: "block" }}>{c.name}</strong>
                    <span style={{ fontSize: "13px", fontVariantNumeric: "tabular-nums" }}>
                      {c.hex} · {c.role}
                    </span>
                  </div>
                </figure>
              ))}
            </div>
          </div>

          <div data-sc-in data-sc-stagger="60" style={{ marginTop: "var(--sc-9)" }}>
            <h2 className="sc-display sc-display--md">Typography</h2>
            <p className="sc-body">
              Schibsted Grotesk carries every heading and every paragraph, at
              weights 400 to 700 with tight tracking on display sizes. One
              family keeps the site fast: the font loads with preconnect hints
              and font-display: swap. Display headings set at 400 weight with
              -0.035em tracking; buttons and labels at 500.
            </p>
            <p className="sc-body">
              The logo&apos;s letterforms are a geometric-humanist grotesk:
              open counters, a two-story a and near-monolinear strokes. Schibsted
              Grotesk is the closest verified Google Font match to those shapes.
            </p>
          </div>

          <div data-sc-in data-sc-stagger="60" style={{ marginTop: "var(--sc-9)" }}>
            <h2 className="sc-display sc-display--md">Logo rules</h2>
            <p className="sc-body">
              The wordmark loads as an optimized WebP at a display height of 34px
              in the nav and 40px in the footer. Keep clear space around the mark
              equal to the height of the T. Never stretch, recolour or outline
              the mark; on the dark closing ground it reads unchanged because the
              artwork carries its own contrast.
            </p>
          </div>

          <div data-sc-in data-sc-stagger="60" style={{ marginTop: "var(--sc-9)" }}>
            <h2 className="sc-display sc-display--md">The accent bar</h2>
            <p className="sc-body">
              A 4px bar in Safari Orange (#c05a15) sits fixed on the extreme top
              edge of the viewport on every page and every breakpoint. It is
              painted with position: fixed, so it causes no layout shift. Do not
              remove it, recolour it or increase its height beyond 6px.
            </p>
          </div>

          <p style={{ marginTop: "var(--sc-8)" }} data-sc-in>
            <Link className="tt-btn tt-btn--ghost" href="/">
              Back to the tours
            </Link>
          </p>
        </div>
      </main>
      <SubFooter />
    </>
  );
}
