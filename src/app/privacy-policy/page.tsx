import type { Metadata } from "next";
import { SubNav, SubFooter } from "@/components/subpage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Truly Tours Namibia collects, uses and protects your personal details, and how to ask for access or deletion.",
  alternates: { canonical: "/privacy-policy" },
};

const SECTIONS = [
  {
    h: "What we collect",
    body: [
      "When you contact us on WhatsApp, by email or by phone we keep the details you give us: your name, contact details, travel dates, the tour you are interested in and any special requirements you tell us about.",
      "If you book a tour we also keep the booking details needed to run it, such as participant names, pickup details and accommodation preferences. If you send us photographs from a trip, we keep them only with your permission to show them on this site or on our Instagram account.",
    ],
  },
  {
    h: "What we do with it",
    body: [
      "We use your details to answer your questions, prepare quotations and run booked tours. Where a tour includes lodges, parks or partner services, we pass on the participant details those partners need to serve you, and no more than that.",
      "We do not sell your details and we do not send marketing unless you asked us to.",
    ],
  },
  {
    h: "Where it lives",
    body: [
      "Inquiries and bookings are kept in our email and WhatsApp records on the devices we use to run the business. This website itself sets no advertising or tracking cookies. If we later add an analytics service, this policy will be updated before that happens.",
    ],
  },
  {
    h: "Your choices",
    body: [
      "You can ask us what we hold about you, ask us to correct it and ask us to delete it. Write to info@trulytoursnamibia.com and we will respond within a reasonable time. We may keep the records a booking requires for accounting purposes, and we will tell you if that applies.",
      "We handle personal details under the law of Namibia, including the privacy protection in Article 13 of the Namibian Constitution, and we apply the same care to visitors from the European Union that the GDPR expects.",
    ],
  },
  {
    h: "Contact",
    body: [
      "Truly Tours Namibia, Windhoek, Namibia. Email info@trulytoursnamibia.com or call +264 81 464 2798.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SubNav />
      <main id="main" className="sc-section" data-sc-act="flow">
        <div className="sc-wrap tt-doc">
          <div className="tt-doc__head" data-sc-in data-sc-stagger="70">
            <p className="tt-labelrow">Legal</p>
            <h1 className="sc-display sc-display--lg">Privacy Policy</h1>
            <p className="sc-body">
              Truly Tours Namibia is a tour operator based in Windhoek. Each
              section below opens: what we collect, what we do with it, where it
              lives, and your choices. Last updated in November 2026.
            </p>
          </div>
          <div className="tt-accs" data-sc-in data-sc-stagger="50">
            {SECTIONS.map((s) => (
              <details className="tt-acc" key={s.h}>
                <summary>
                  <h3>{s.h}</h3>
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
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>
      <SubFooter />
    </>
  );
}
