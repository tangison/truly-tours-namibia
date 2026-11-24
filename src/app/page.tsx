import { TOURS, ACTIVITIES, TESTIMONIALS, CONTACT, GALLERY } from "@/lib/site";
import TSlider from "@/components/tslider";

/* The plan (scroll-craft): grammar = gallery/catalog. The visitor's question is
   "what are the options", so the page is a walkable collection: a layered hero
   that already shows object one with its museum label, a quiet route chapter,
   a sideways pan through all six tours (the peak), day-by-day routes under
   accordions, experiences under accordions, guest words in a slider, a photo
   wall, and a contact plate that resolves and holds. Grounds change per
   section on hard edges; no drift, no pins, no scrub clips (the 500KB budget
   holds, and the grammar bans argument-pin acts anyway).
   Signature move: the route rail (route-rail.tsx), a fixed line through the
   country that draws with scroll and stamps a waypoint per section. */

const WA = "https://wa.me/264814642798";

export default function Home() {
  return (
    <>
      {/* NAV (the index): four words that jump, the wordmark, one action label */}
      <header className="nav nav--split">
        <div className="wrap nav__bar">
          <a className="skip-link" href="#top">
            Skip to content
          </a>
          <nav className="nav__links" aria-label="Main">
            <div className="nav__item">
              <a className="nav__link" href="#tours">
                Tours
              </a>
            </div>
            <div className="nav__item">
              <a className="nav__link" href="#routes">
                Routes
              </a>
            </div>
            <div className="nav__item">
              <a className="nav__link" href="#experiences">
                Experiences
              </a>
            </div>
            <div className="nav__item">
              <a className="nav__link" href="#words">
                Guests
              </a>
            </div>
          </nav>
          <a className="nav__logo" href="#top" aria-label="Truly Tours Namibia, back to top">
            <img
              src="/images/asset-2.webp"
              alt="Truly Tours Namibia"
              height={34}
              width={88}
            />
          </a>
          <div className="nav__actions">
            <a className="btn btn--primary" href={WA} target="_blank" rel="noopener noreferrer">
              WhatsApp us
            </a>
          </div>
          <button
            className="nav__toggle"
            type="button"
            aria-expanded="false"
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M2 5h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <main id="top">
        {/* 1 · ARRIVAL: the collection starts at the top. Layered planes: dune
           bed behind, the first tour as a framed object, its label plate
           overlapping, the words at 1x on top. */}
        <section className="hero-sc" data-sc-act="flow" aria-labelledby="hero-h">
          <div className="hero-sc__bed" data-sc-parallax="-1.1" aria-hidden="true">
            <img
              src="/images/hero-bed.webp"
              alt=""
              width={1600}
              height={900}
              fetchPriority="high"
            />
          </div>
          <div className="hero-sc__atmo" aria-hidden="true" />
          <figure
            className="hero-sc__object"
            data-sc-parallax="-0.3"
            data-sc-reveal="iris"
            data-sc-reveal-at="0.05 0.45"
          >
            <img
              src="/images/sossusvlei.webp"
              alt="Camelthorn trees in the white clay pan of Sossusvlei under red dunes"
              width={1440}
              height={810}
              fetchPriority="high"
            />
          </figure>
          <div className="hero-sc__label tt-plate" data-sc-parallax="0.32" data-sc-in>
            <p className="tt-labelrow">Days 3 · Dunes to the coast</p>
            <h2 className="sc-display sc-display--md">Sossusvlei and Swakopmund</h2>
            <p className="tt-tourcard__route">Windhoek, Sossusvlei, Swakopmund, Windhoek</p>
            <p className="tt-tourcard__inc">
              Park fees and transport included. Accommodation and most meals too.
            </p>
            <a className="link" href="#routes">
              The full route
            </a>
          </div>
          <div className="hero-sc__type" data-sc-in data-sc-stagger="70">
            <p className="tt-labelrow">Small groups · Local guides</p>
            <h1 id="hero-h" className="sc-display sc-display--xl">
              Guided Namibia tours from Windhoek
            </h1>
            <p className="sc-lede">
              Three to thirteen days with a local guide. Park fees, transport
              and accommodation are in the price; most meals too. Every quote is
              confirmed in writing before anything is paid.
            </p>
            <div className="tt-cta-row">
              <a className="tt-btn" href={WA} target="_blank" rel="noopener noreferrer">
                WhatsApp us
              </a>
              <a className="tt-btn tt-btn--ghost" href="#tours">
                Walk the tours
              </a>
            </div>
          </div>
        </section>

        {/* 2 · ORIENTATION: the quiet chapter. The route line draws along the
           bottom edge; this act holds its name and almost nothing else moves. */}
        <section className="sc-section tt-band" data-sc-act="flow" aria-labelledby="route-h">
          <div className="sc-wrap" data-sc-in>
            <h2 id="route-h" className="sc-display sc-display--lg">
              One country, six routes
            </h2>
            <p className="sc-body">
              Every tour leaves Windhoek and returns to it. The line along the
              bottom of the page is the road: it draws while you scroll, and
              each waypoint jumps to its section.
            </p>
          </div>
        </section>

        {/* 3 · RANGE (the peak): the whole set travels sideways, one museum
           label per tour, the lead and the note as first and last cards. */}
        <section
          className="tt-pan-sec"
          id="tours"
          data-sc-act="pan"
          data-sc-span="4.2"
          aria-labelledby="tours-h"
        >
          <div data-sc-stage>
            <div className="tt-set" data-sc-pan="0.06">
              <div className="tt-set__lead">
                <p className="tt-labelrow">The set</p>
                <h2 id="tours-h" className="sc-display sc-display--lg">
                  Six tours across Namibia
                </h2>
                <p className="sc-body">
                  Every label reads the same way: days, route, inclusions.
                  Longer routes cover more of the country.
                </p>
              </div>
              {TOURS.map((t) => (
                <article className="tt-tourcard" key={t.id}>
                  <div data-sc-tilt="5">
                    <figure>
                      <img src={t.img} alt="" width={800} height={600} loading="lazy" />
                    </figure>
                  </div>
                  <div className="tt-tourcard__body">
                    <p className="tt-labelrow">
                      Days {t.days} · {t.short}
                    </p>
                    <h3>{t.title}</h3>
                    <p className="tt-tourcard__inc">
                      Park fees and transport included. Accommodation and most
                      meals too.
                    </p>
                    <a className="link" href="#routes">
                      The full route
                    </a>
                  </div>
                </article>
              ))}
              <div className="tt-set__note">
                <p className="sc-body">
                  Every route can be tailored to your dates, and prices are
                  confirmed in writing before anything is paid.
                </p>
                <a className="tt-btn tt-btn--ghost" href="#contact">
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4 · SUBSTANCE: the day-by-day routes, folded under accordions. */}
        <section className="sc-section tt-band" id="routes" data-sc-act="flow" aria-labelledby="routes-h">
          <div className="sc-wrap">
            <div data-sc-in data-sc-stagger="60">
              <h2 id="routes-h" className="sc-display sc-display--lg">
                The routes in full
              </h2>
              <p className="sc-body">
                Each day and each included item, for every tour. Open the one
                you are considering.
              </p>
            </div>
            <div className="tt-accs" data-sc-in data-sc-stagger="50">
              {TOURS.map((t) => (
                <details className="tt-acc" key={t.id}>
                  <summary>
                    <h3>{t.title}</h3>
                    <span className="tt-acc__meta">{t.days} days</span>
                    <svg className="tt-acc__chev" viewBox="0 0 14 14" aria-hidden="true">
                      <path
                        d="M5 2l5 5-5 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <div className="tt-acc__body">
                    <p>{t.itinerary}</p>
                    <p>{t.included}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 5 · APPETITE: the experiences beyond the big loops, also folded. */}
        <section className="sc-section" id="experiences" data-sc-act="flow" aria-labelledby="exp-h">
          <div className="sc-wrap">
            <div data-sc-in data-sc-stagger="60">
              <h2 id="exp-h" className="sc-display sc-display--lg">
                Experiences from Windhoek
              </h2>
              <p className="sc-body">
                Day trips and walks that fit before or after a tour. Hours and
                prices are on each label.
              </p>
            </div>
            <div className="tt-accs" data-sc-in data-sc-stagger="40">
              {ACTIVITIES.map((a) => (
                <details className="tt-acc" key={a.id}>
                  <summary>
                    <h3>{a.title}</h3>
                    <span className="tt-acc__meta">
                      {a.hours} · {a.price}
                    </span>
                    <svg className="tt-acc__chev" viewBox="0 0 14 14" aria-hidden="true">
                      <path
                        d="M5 2l5 5-5 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <div className="tt-acc__body">
                    <p>{a.text}</p>
                    <img src={a.img} alt="" width={800} height={500} loading="lazy" />
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 6 · TRUST: guest words one at a time, then the photo wall. */}
        <section className="sc-section tt-band" id="words" data-sc-act="flow" aria-labelledby="words-h">
          <div className="sc-wrap">
            <div data-sc-in data-sc-stagger="60">
              <h2 id="words-h" className="sc-display sc-display--lg">
                What past guests say
              </h2>
            </div>
            <div data-sc-in>
              <TSlider items={TESTIMONIALS} />
            </div>
            <div className="tt-wall" style={{ marginTop: "var(--sc-8)" }} data-sc-in data-sc-stagger="60">
              {GALLERY.map((g) => (
                <figure key={g.img}>
                  <img src={g.img} alt={g.alt} width={800} height={600} loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 7 · RESOLVE: the contact plate, typeset like the labels above it.
           The last act holds, and the footer lives inside it. */}
        <section className="sc-section tt-close" id="contact" data-sc-act="flow" aria-labelledby="contact-h">
          <div className="sc-wrap">
            <div data-sc-in data-sc-stagger="70">
              <p className="tt-labelrow">Contact</p>
              <h2 id="contact-h" className="sc-display sc-display--lg">
                Plan the trip with us
              </h2>
              <p className="sc-body">
                One message with your dates and the route you are considering is
                enough for a written quote.
              </p>
              <div className="tt-cta-row">
                <a className="tt-btn" href={WA} target="_blank" rel="noopener noreferrer">
                  WhatsApp us
                </a>
                <a className="tt-btn tt-btn--ghost" href={`mailto:${CONTACT.email}`}>
                  Email us
                </a>
              </div>
            </div>
            <div className="tt-plate" style={{ marginTop: "var(--sc-7)" }} data-sc-in>
              <details className="tt-acc">
                <summary>
                  <h3>About the team</h3>
                  <span className="tt-acc__meta">Windhoek</span>
                  <svg className="tt-acc__chev" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M5 2l5 5-5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <div className="tt-acc__body">
                  <p>
                    Our team is made up of knowledgeable members with years of
                    hands-on experience in Namibia&apos;s tourism industry. Each
                    team member has explored the country extensively through
                    guiding and travel planning, and holds academic
                    qualifications in tourism and related fields.
                  </p>
                  <p>
                    We believe that tourism should uplift local communities. Our
                    corporate social responsibility work supports rural
                    communities in high-risk human-wildlife conflict areas,
                    particularly small-scale farmers whose crops and livestock
                    sit beside wildlife corridors.
                  </p>
                </div>
              </details>
              <dl className="tt-facts" style={{ marginTop: "var(--sc-5)" }}>
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
                <dt>Instagram</dt>
                <dd>
                  <a href={CONTACT.instagram} target="_blank" rel="noreferrer">
                    @truly_tours_namibia
                  </a>
                </dd>
              </dl>
            </div>
            <footer className="tt-foot" style={{ marginTop: "var(--sc-8)" }}>
              <div className="tt-foot__row">
                <span>&copy; 2026 Truly Tours Namibia</span>
                <a href="/privacy-policy">Privacy</a>
                <a href="/terms">Terms</a>
                <a href="/brand">Brand</a>
              </div>
              <div className="tt-foot__row">
                <span>
                  Destination photographs: Pexels, Britannica. All other
                  photographs by Truly Tours Namibia.
                </span>
              </div>
              <div className="tt-foot__row">
                <span>
                  Made by{" "}
                  <a href="https://studio.tangison.com" target="_blank" rel="noopener noreferrer">
                    Tangison Studio
                  </a>
                </span>
              </div>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
