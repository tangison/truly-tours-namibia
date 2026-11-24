import type { Metadata } from "next";
import { SubNav, SubFooter } from "@/components/subpage";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Booking, payment, cancellation and liability terms for guided Namibia tours run by Truly Tours Namibia, Windhoek.",
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    h: "Bookings",
    body: [
      "A booking is confirmed once we receive your deposit and issue a written confirmation. Quotations are given in Namibian dollars (N$) or in the currency stated on the quote, and a quote is valid for 14 days from the date on it. Prices include exactly what the tour page lists under Included; anything not listed there is for your own account.",
    ],
  },
  {
    h: "Payment",
    body: [
      "We ask for a deposit to hold your dates and the balance before the tour starts. The deposit percentage and the balance due date are confirmed on your booking confirmation. Bank details are supplied with the invoice and we never ask for card details over WhatsApp.",
    ],
  },
  {
    h: "Cancellations and changes",
    body: [
      "If you cancel, the deposit is retained and the balance is refunded according to the notice period stated on your confirmation; longer notice means a larger refund. We may have to change an itinerary for reasons outside our control, such as park closures, flooding on gravel roads or weather.",
      "When that happens we reroute to a comparable alternative and tell you as early as we can. If we cancel a tour entirely before it starts, you get all monies back for that tour.",
    ],
  },
  {
    h: "Responsibilities and insurance",
    body: [
      "You need travel insurance that covers medical treatment and evacuation in Namibia for the whole tour; we ask for proof before departure. You are responsible for valid passports, visas and any medication you need. Our guides make the final call on safety matters in parks and on walks, and instructions from them must be followed.",
    ],
  },
  {
    h: "Liability",
    body: [
      "We run tours with reasonable care and use reputable partners, but wilderness travel carries risks that cannot be removed, including wildlife encounters and road conditions. We are not liable for losses outside our control or for losses to your own equipment. Any claim against us is governed by the law of Namibia.",
    ],
  },
  {
    h: "Photographs",
    body: [
      "Guides may photograph group activities. Tell your guide at the start of the tour if you do not want to appear in pictures we might publish, and we will keep you out of them.",
    ],
  },
  {
    h: "Contact",
    body: [
      "Questions about these terms: info@trulytoursnamibia.com or +264 81 464 2798, Monday to Friday, 07:30 to 17:00.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <SubNav />
      <main id="main" className="sc-section" data-sc-act="flow">
        <div className="sc-wrap tt-doc">
          <div className="tt-doc__head" data-sc-in data-sc-stagger="70">
            <p className="tt-labelrow">Legal</p>
            <h1 className="sc-display sc-display--lg">Terms and Conditions</h1>
            <p className="sc-body">
              These terms apply to every guided tour and activity run by Truly
              Tours Namibia from Windhoek. Each section below opens. The specific
              payment and cancellation figures for your booking are confirmed in
              writing before you pay anything. Last updated in November 2026.
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
