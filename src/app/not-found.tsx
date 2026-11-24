import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist. Pick one of the tours instead.",
  robots: { index: false },
};

/* Static export emits this as /404.html; Vercel and GitHub Pages serve it on
   unknown URLs. Branded, with recovery navigation. */
export default function NotFound() {
  return (
    <main
      id="main"
      className="sc-section tt-close"
      style={{ minHeight: "100svh", display: "grid", alignContent: "center" }}
    >
      <div className="sc-wrap" style={{ display: "grid", gap: "var(--sc-4)" }}>
        <p className="tt-labelrow">Error 404</p>
        <h1 className="sc-display sc-display--lg">That page is off the route</h1>
        <p className="sc-body" style={{ maxWidth: "52ch" }}>
          There is no page at this address. The tours are all on the home page,
          and if you were looking for a booking, WhatsApp is the fastest way to
          reach us.
        </p>
        <div className="tt-cta-row">
          <Link className="tt-btn" href="/">
            Back to the tours
          </Link>
          <a
            className="tt-btn tt-btn--ghost"
            href="https://wa.me/264814642798"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#f4efe8", borderColor: "#6b6154" }}
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </main>
  );
}
