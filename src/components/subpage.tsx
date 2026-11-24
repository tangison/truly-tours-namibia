import Link from "next/link";
import { CONTACT } from "@/lib/site";

/* Shared chrome for the standalone routes (/brand, /privacy-policy, /terms,
   /500): the same index nav as the home page and the same contact-plate
   footer, so every route carries the studio credit and the client's details. */

const WA = "https://wa.me/264814642798";

export function SubNav() {
  return (
    <header className="nav nav--split">
      <div className="wrap nav__bar">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <nav className="nav__links" aria-label="Main">
          <div className="nav__item">
            <Link className="nav__link" href="/">
              Home
            </Link>
          </div>
          <div className="nav__item">
            <Link className="nav__link" href="/#tours">
              Tours
            </Link>
          </div>
          <div className="nav__item">
            <Link className="nav__link" href="/brand">
              Brand
            </Link>
          </div>
        </nav>
        <Link className="nav__logo" href="/" aria-label="Truly Tours Namibia, home">
          <img src="/images/asset-2.webp" alt="Truly Tours Namibia" width={88} height={34} />
        </Link>
        <div className="nav__actions">
          <a className="btn btn--primary" href={WA} target="_blank" rel="noopener noreferrer">
            WhatsApp us
          </a>
        </div>
      </div>
    </header>
  );
}

export function SubFooter() {
  return (
    <footer className="sc-section tt-close" id="contact">
      <div className="sc-wrap">
        <div data-sc-in data-sc-stagger="70">
          <p className="tt-labelrow">Contact</p>
          <h2 className="sc-display sc-display--lg">Plan the trip with us</h2>
          <div className="tt-cta-row">
            <a className="tt-btn" href={WA} target="_blank" rel="noopener noreferrer">
              WhatsApp us
            </a>
            <a className="tt-btn tt-btn--ghost" href={`mailto:${CONTACT.email}`}>
              Email us
            </a>
          </div>
        </div>
        <dl className="tt-facts" style={{ marginTop: "var(--sc-7)" }} data-sc-in>
          <dt>Phone</dt>
          <dd>
            <a href="tel:+264814642798">+264 81 464 2798</a> /{" "}
            <a href="tel:+264812582241">+264 81 258 2241</a>
          </dd>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </dd>
          <dt>Where</dt>
          <dd>{CONTACT.city}</dd>
          <dt>Hours</dt>
          <dd>{CONTACT.hours}</dd>
        </dl>
        <div className="tt-foot" style={{ marginTop: "var(--sc-7)" }}>
          <div className="tt-foot__row">
            <span>&copy; 2026 Truly Tours Namibia</span>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/brand">Brand</Link>
          </div>
          <div className="tt-foot__row">
            <span>
              Made by{" "}
              <a href="https://studio.tangison.com" target="_blank" rel="noopener noreferrer">
                Tangison Studio
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
