import Link from "next/link";
import { CONTACT } from "@/lib/site";

/* Shared chrome for the standalone routes (/brand, /privacy-policy, /terms,
   /500): the same nav pattern and the same footer as the home page, so every
   route carries the studio credit and the client's details. */

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
          <img src="/images/asset-2.webp" alt="Truly Tours Namibia" width={88} height={29} />
        </Link>
        <div className="nav__actions">
          <a
            className="btn btn--primary"
            href="https://wa.me/264814642798"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </header>
  );
}

export function SubFooter() {
  return (
    <footer className="closing ground-inverse" id="contact">
      <div className="wrap">
        <div className="footer-cta">
          <h2>Plan your Namibia trip with us</h2>
          <p className="footer-contacts">
            <a href={`tel:${CONTACT.phone.split(" / ")[0].replace(/\s+/g, "")}`}>
              {CONTACT.phone}
            </a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <span>{CONTACT.city}</span>
          </p>
        </div>
        <div className="footer__legal">
          <span>&copy; 2026 Truly Tours Namibia</span>
          <span className="muted">
            Destination photographs: Pexels, Britannica. All other photographs
            by Truly Tours Namibia.
          </span>
          <span>
            Made by{" "}
            <a
              href="https://studio.tangison.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tangison Studio
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
