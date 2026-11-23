import type { Metadata } from "next";
import Link from "next/link";
import { SubNav, SubFooter } from "@/components/subpage";

export const metadata: Metadata = {
  title: "Server error",
  description: "Something went wrong on our side. Try again or reach us on WhatsApp.",
  robots: { index: false },
};

export default function ServerErrorPage() {
  return (
    <>
      <SubNav />
      <main id="main" className="section ground-inverse" style={{ "--h": 1 } as React.CSSProperties}>
        <div className="wrap" style={{ display: "grid", alignContent: "center", gap: "16px" }}>
          <p className="eyebrow" style={{ color: "#aba39a" }}>
            Error 500
          </p>
          <h1>Something broke on our side</h1>
          <p style={{ color: "#aba39a", maxWidth: "52ch" }}>
            The page exists but our server did not answer properly. Wait a
            moment and reload, or write to us directly and we will sort out
            your tour question the old way: in a chat.
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
      <SubFooter />
    </>
  );
}
