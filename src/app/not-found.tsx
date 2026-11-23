import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist. Pick one of the tours instead.",
  robots: { index: false },
};

/* Static export emits this as /404.html; Vercel and GitHub Pages serve it on
   unknown URLs. Branded, with recovery navigation (webmaster checklist). */
export default function NotFound() {
  return (
    <main
      id="main"
      className="section ground-inverse"
      style={{ "--h": 1 } as React.CSSProperties}
    >
      <div
        className="wrap"
        style={{ display: "grid", alignContent: "center", gap: "16px" }}
      >
        <p className="eyebrow" style={{ color: "#aba39a" }}>
          Error 404
        </p>
        <h1>That page is off the route</h1>
        <p style={{ color: "#aba39a", maxWidth: "52ch" }}>
          There is no page at this address. The tours are all on the home page,
          and if you were looking for a booking, WhatsApp is the fastest way to
          reach us.
        </p>
        <div className="nav__actions">
          <Link className="btn btn--primary" href="/">
            Back to the tours
          </Link>
          <a
            className="btn"
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
