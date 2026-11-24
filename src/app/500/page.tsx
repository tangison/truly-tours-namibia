import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Server error",
  description:
    "Something went wrong on our side. Try again or reach us on WhatsApp.",
  robots: { index: false },
};

/* Static export emits this as /500.html (and /500/); Vercel serves 500.html on
   server errors. Branded, with recovery navigation. */
export default function ServerErrorPage() {
  return (
    <main
      id="main"
      className="sc-section tt-close"
      style={{ minHeight: "100svh", display: "grid", alignContent: "center" }}
    >
      <div className="sc-wrap" style={{ display: "grid", gap: "var(--sc-4)" }}>
        <p className="tt-labelrow">Error 500</p>
        <h1 className="sc-display sc-display--lg">Something broke on our side</h1>
        <p className="sc-body" style={{ maxWidth: "52ch" }}>
          The page exists but our server did not answer properly. Wait a moment
          and reload, or write to us directly and we will sort out your tour
          question the old way: in a chat.
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
