import {
  TOURS,
  ACTIVITIES,
  TESTIMONIALS,
  CONTACT,
  GALLERY,
  SOURCED,
} from "@/lib/site";
import { TourChapters, DevelopingPhoto, KitScripts } from "@/components/moments";

/* The plan (taste-skill step 3), screens at 1440x900:
   kind: service (tour operator, site-kind other)
   deal: brand tokens from the client's logo (warm paper ground #f4efe8, brown ink, safari orange),
     pairing Schibsted Grotesk, hero film (poster = Sossusvlei, the words in a solid box on its dark foot),
     nav-split, footer-columns, close-photo, rhythm surface-pairs, buttons block, mark arc
   moments: pinned-chapters (the grand southern loop, its own 2-screen section) + picture-develops (Etosha)
   1 hero (film) 2 tours rows (services-list) 3 chapters (pinned moment, 2 screens) 4 activities (rows
   + photo pair) 5 gallery wall 6 develops + testimonials (surface band) 7 about/CSR (split) footer.closing
   Photographs are the client's own (trulytoursnamibia.com); the three destination shots the client has
   not yet photographed (canyon, Kolmanskop, aerial dunes) are free-licence stand-ins, credited in the footer. */

const CHAPTERS = [
  {
    title: "Days 1–3: the Kalahari and the canyon",
    text: "South from Windhoek into red Kalahari dunes, then the rim of the Fish River Canyon, the second largest canyon on earth, at sunset.",
    img: SOURCED.canyon,
    alt: "Fish River Canyon winding through rock at sunset",
  },
  {
    title: "Days 4–6: Lüderitz and the dunes",
    text: "The colonial harbour town of Lüderitz, the ghost town of Kolmanskop filling with sand, then north to the great dunes of Sossusvlei.",
    img: SOURCED.kolmanskop,
    alt: "Sand dune pouring through a doorway in the Kolmanskop ghost town",
  },
  {
    title: "Days 7–9: the coast and Brandberg",
    text: "Swakopmund's German architecture on the Atlantic, a marine cruise, then Namibia's highest mountain, the Brandberg, with its rock art.",
    img: "/images/swakopmund.webp",
    alt: "Swakopmund on the Atlantic coast",
  },
  {
    title: "Days 10–13: Etosha and home",
    text: "Three days of game drives around Etosha's waterholes, elephants, rhino and lions, then the long road south back to Windhoek.",
    img: "/images/etosha.webp",
    alt: "A waterhole in Etosha National Park",
  },
];

export default function Home() {
  return (
    <>
      {/* NAV (nav-split): the name in the middle, four words left, the main action right */}
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
              <a className="nav__link" href="#activities">
                Activities
              </a>
            </div>
            <div className="nav__item">
              <a className="nav__link" href="#gallery">
                Gallery
              </a>
            </div>
            <div className="nav__item">
              <a className="nav__link" href="#about">
                About
              </a>
            </div>
          </nav>
          <a className="nav__logo" href="#top">
            { }
            <img
              src="/images/asset-2.webp"
              alt="Truly Tours Namibia"
              height={34}
            />
          </a>
          <div className="nav__actions">
            <a className="btn btn--primary" href="#contact">
              Book a tour
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
        {/* HERO (film): Sossusvlei poster in a cinema frame, the words in a solid box on its dark foot */}
        <section
          className="hero hero--film"
          data-enter
          aria-labelledby="hero-h"
        >
          <div className="wrap">
            <div className="hero-text hero__in">
              <div className="hero__media hero__fill">
                { }
                <img
                  src="/images/sossusvlei.webp"
                  alt="Camelthorn trees in the white clay pan of Sossusvlei under red dunes"
                  width={1600}
                  height={900}
                  style={{
                    ["--ly-pos" as string]: "50% 62%",
                    ["--ly-pos-phone" as string]: "56% 50%",
                  }}
                  fetchPriority="high"
                />
                <div className="hero__over">
                  <div>
                    <h1 id="hero-h">
                      Guided Namibia tours from Windhoek
                    </h1>
                    <p className="hero__lead">
                      Three to thirteen days to Sossusvlei, Etosha, the coast
                      and the Kalahari, with a local guide, park fees and
                      accommodation included.
                    </p>
                    <div className="btn-row">
                      <a className="btn btn--primary" href="#tours">
                        Book a tour
                      </a>
                      <a className="btn btn--secondary" href="#activities">
                        See the activities
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TOURS (services-list): the six tours as rows beside a photograph */}
        <section className="section" id="tours" aria-labelledby="tours-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="tours-h">
                Six tours across Namibia.{" "}
                <span className="muted">
                  Every package can be tailored to your dates and route.
                </span>
              </h2>
            </div>
            <div className="grid grid--top">
              <ul className="rows span-6">
                {TOURS.map((t) => (
                  <li key={t.id} id={t.id}>
                    <details className="tour-detail">
                      <summary>
                        <span className="rows__name">
                          {t.title}
                          <small>
                            {t.days} days · {t.short}
                          </small>
                        </span>
                        <span className="rows__value">{t.days} days</span>
                      </summary>
                      <div className="tour-detail__body">
                        <p>{t.intro}</p>
                        <p className="tour-detail__itin">{t.itinerary}</p>
                        <p className="muted tour-detail__incl">{t.included}</p>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
              <div className="span-5 start-8">
                <div className="tours-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SOURCED.aerial}
                    alt="Aerial view over the red dunes of Sossusvlei"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTERS: the dealt pinned moment (GSAP scrubbed), its own two screens */}
        <TourChapters chapters={CHAPTERS} />

        {/* ACTIVITIES: rows with prices beside a photograph pair */}
        <section
          className="section"
          id="activities"
          aria-labelledby="activities-h"
        >
          <div className="wrap">
            <div className="section-head">
              <h2 id="activities-h">
                Walks, drives and classes from Windhoek
              </h2>
              <p>
                Half-day guided experiences in and around the capital, booked
                on their own or added to any tour.
              </p>
            </div>
            <div className="grid grid--top">
              <ul className="rows span-6">
                {ACTIVITIES.map((a) => (
                  <li key={a.id}>
                    <span className="rows__name">
                      {a.title}
                      <small>
                        {a.hours}
                        {a.price ? ` · ${a.price}` : ""}
                      </small>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="span-5 start-8 activities-photos">
                <div className="ap">
                  { }
                  <img
                    src="/images/city.webp"
                    alt="Windhoek's city centre between hills"
                    loading="lazy"
                  />
                </div>
                <div className="ap">
                  { }
                  <img
                    src="/images/namibian-food.webp"
                    alt="Traditional Namibian food being prepared"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY: a wall of the client's photographs, from line to line */}
        <section className="section" id="gallery" aria-labelledby="gallery-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="gallery-h">
                Namibia as our guests see it.{" "}
                <span className="muted">
                  Every photograph taken on a Truly Tours trip.
                </span>
              </h2>
            </div>
            <div className="wall">
              {GALLERY.map((g) => (
                <a
                  key={g.img}
                  className="m-zoom wall__cell"
                  href={g.img}
                  aria-label={g.alt}
                >
                  { }
                  <img src={g.img} alt={g.alt} loading="lazy" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* DEVELOPS + TESTIMONIALS (surface band): the dealt enter moment beside the guests' words */}
        <section className="section ground-surface" id="guests" aria-labelledby="guests-h">
          <div className="wrap grid grid--top">
            <div className="span-6">
              <div className="section-head">
                <h2 id="guests-h">What our guests say</h2>
                <p>
                  We take pride in serving our guests with the best experience.
                </p>
              </div>
              {TESTIMONIALS.map((t) => (
                <figure className="quote" key={t.name}>
                  <blockquote>{t.quote}</blockquote>
                  <div className="person">
                    <span className="mark mark--initial" aria-hidden="true">
                      {t.name.charAt(0)}
                    </span>
                    <span>
                      <span className="person__name">{t.name}</span>
                      <span className="person__role">Guest, Truly Tours</span>
                    </span>
                  </div>
                </figure>
              ))}
            </div>
            <DevelopingPhoto
              img="/images/elephant.webp"
              alt="Elephants walking across dry savanna in Etosha"
              className="span-6 start-7"
            />
          </div>
        </section>

        {/* ABOUT: the team and CSR, a split with the zebra photograph */}
        <section className="section" id="about" aria-labelledby="about-h">
          <div className="wrap grid grid--top">
            <div className="span-6">
              <div className="section-head">
                <h2 id="about-h">
                  A Windhoek team that grew up guiding
                </h2>
              </div>
              <p>
                Our team is made up of knowledgeable members with years of
                hands-on experience in Namibia&apos;s tourism industry. Each
                team member has explored the country extensively through
                guiding and travel planning, and holds academic qualifications
                in tourism and related fields.
              </p>
              <p>
                We believe that tourism should uplift local communities. Our
                corporate social responsibility work supports rural communities
                in high-risk human-wildlife conflict areas, particularly
                small-scale farmers whose crops and livestock sit beside
                wildlife corridors.
              </p>
              <p>
                <a className="link" href="#contact">
                  Ask us about our community work
                </a>
              </p>
            </div>
            <div className="span-5 start-8">
              <div className="tours-photo">
                { }
                <img
                  src="/images/zebra.webp"
                  alt="Zebras grazing on golden grassland"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER.CLOSING: close-photo (the rhino never used above), then the directory */}
      <footer className="footer closing" id="contact" aria-labelledby="close-h">
        <div className="wrap">
          <div className="closing__cta close--photo">
            <div className="section-head--split">
              <div>
                <h2 id="close-h">Book a tour</h2>
                <p className="t-lead">
                  Reception 7:30 to 17:00, Windhoek. We reply within a day.
                </p>
              </div>
              <a className="btn btn--primary" href={`mailto:${CONTACT.email}`}>
                Book a tour
              </a>
            </div>
            <div className="close__media">
              { }
              <img
                src="/images/rhino.webp"
                alt="A rhino standing in Etosha scrubland"
                loading="lazy"
              />
            </div>
          </div>
          <div className="closing__links">
            <div className="grid">
              <div className="span-4 stack-4">
                { }
                <img
                  className="footer-logo"
                  src="/images/asset-2.webp"
                  alt="Truly Tours Namibia"
                  height={40}
                />
                <p className="footer__lede">
                  Guided tours across Namibia, from Windhoek.
                </p>
              </div>
              <div className="span-2 footer__col">
                <h3>Tours</h3>
                <ul>
                  <li>
                    <a href="#tours">All six tours</a>
                  </li>
                  <li>
                    <a href="#chapters">The southern loop</a>
                  </li>
                  <li>
                    <a href="#activities">Activities</a>
                  </li>
                </ul>
              </div>
              <div className="span-2 footer__col">
                <h3>Company</h3>
                <ul>
                  <li>
                    <a href="#about">About us</a>
                  </li>
                  <li>
                    <a href="#gallery">Gallery</a>
                  </li>
                  <li>
                    <a href="#guests">Guests</a>
                  </li>
                </ul>
              </div>
              <div className="span-2 footer__col">
                <h3>Contact</h3>
                <ul>
                  <li>
                    <a href={`mailto:${CONTACT.email}`}>Email us</a>
                  </li>
                  <li>
                    <a href="tel:+264814642798">Call reception</a>
                  </li>
                  <li>
                    <a
                      href={CONTACT.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
              <div className="span-2 footer__col">
                <h3>Visit</h3>
                <ul>
                  <li>Windhoek, Namibia</li>
                  <li>Reception 7:30 to 17:00</li>
                  <li>Mon to Fri</li>
                </ul>
              </div>
            </div>
            <div className="footer__legal">
              <span>&copy; 2026 Truly Tours Namibia</span>
              <span className="muted">
                Destination photographs: Pexels, Britannica. All other
                photographs by Truly Tours Namibia.
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
              <div className="socials" />
            </div>
          </div>
        </div>
      </footer>

      {/* the kit's behaviour layer: nav sheet, hover layer, hero entrance */}
      <KitScripts />
    </>
  );
}
