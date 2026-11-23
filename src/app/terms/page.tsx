import type { Metadata } from "next";
import { SubNav, SubFooter } from "@/components/subpage";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Booking, payment, cancellation and liability terms for guided Namibia tours run by Truly Tours Namibia, Windhoek.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <SubNav />
      <main id="main" className="section" style={{ "--h": 1 } as React.CSSProperties}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Legal</p>
            <h1>Terms and Conditions</h1>
            <p>
              These terms apply to every guided tour and activity run by Truly
              Tours Namibia from Windhoek. They were last updated in November
              2026. The specific payment and cancellation figures for your
              booking are confirmed in writing before you pay anything.
            </p>
          </div>

          <h2>Bookings</h2>
          <p>
            A booking is confirmed once we receive your deposit and issue a
            written confirmation. Quotations are given in Namibian dollars (N$)
            or in the currency stated on the quote, and a quote is valid for 14
            days from the date on it. Prices include exactly what the tour page
            lists under Included; anything not listed there is for your own
            account.
          </p>

          <h2>Payment</h2>
          <p>
            We ask for a deposit to hold your dates and the balance before the
            tour starts. The deposit percentage and the balance due date are
            confirmed on your booking confirmation. Bank details are supplied
            with the invoice and we never ask for card details over WhatsApp.
          </p>

          <h2>Cancellations and changes</h2>
          <p>
            If you cancel, the deposit is retained and the balance is refunded
            according to the notice period stated on your confirmation; longer
            notice means a larger refund. We may have to change an itinerary
            for reasons outside our control, such as park closures, flooding on
            gravel roads or weather. When that happens we reroute to a
            comparable alternative and tell you as early as we can. If we
            cancel a tour entirely before it starts, you get all monies back
            for that tour.
          </p>

          <h2>Responsibilities and insurance</h2>
          <p>
            You need travel insurance that covers medical treatment and
            evacuation in Namibia for the whole tour; we ask for proof before
            departure. You are responsible for valid passports, visas and any
            medication you need. Our guides make the final call on safety
            matters in parks and on walks, and instructions from them must be
            followed.
          </p>

          <h2>Liability</h2>
          <p>
            We run tours with reasonable care and use reputable partners, but
            wilderness travel carries risks that cannot be removed, including
            wildlife encounters and road conditions. We are not liable for
            losses outside our control or for losses to your own equipment.
            Any claim against us is governed by the law of Namibia.
          </p>

          <h2>Photographs</h2>
          <p>
            Guides may photograph group activities. Tell your guide at the
            start of the tour if you do not want to appear in pictures we might
            publish, and we will keep you out of them.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms: info@trulytoursnamibia.com or +264 81
            464 2798, Monday to Friday, 07:30 to 17:00.
          </p>
        </div>
      </main>
      <SubFooter />
    </>
  );
}
