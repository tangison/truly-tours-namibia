import type { Metadata } from "next";
import { SubNav, SubFooter } from "@/components/subpage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Truly Tours Namibia collects, uses and protects your personal details, and how to ask for access or deletion.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SubNav />
      <main id="main" className="section" style={{ "--h": 1 } as React.CSSProperties}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Legal</p>
            <h1>Privacy Policy</h1>
            <p>
              Truly Tours Namibia is a tour operator based in Windhoek. This
              policy explains what we collect when you plan a trip with us and
              what we do with it. It was last updated in November 2026.
            </p>
          </div>

          <h2>What we collect</h2>
          <p>
            When you contact us on WhatsApp, by email or by phone we keep the
            details you give us: your name, contact details, travel dates, the
            tour you are interested in and any special requirements you tell us
            about. If you book a tour we also keep the booking details needed
            to run it, such as participant names, pickup details and
            accommodation preferences. If you send us photographs from a trip,
            we keep them only with your permission to show them on this site or
            on our Instagram account.
          </p>

          <h2>What we do with it</h2>
          <p>
            We use your details to answer your questions, prepare quotations
            and run booked tours. Where a tour includes lodges, parks or
            partner services, we pass on the participant details those partners
            need to serve you, and no more than that. We do not sell your
            details and we do not send marketing unless you asked us to.
          </p>

          <h2>Where it lives</h2>
          <p>
            Inquiries and bookings are kept in our email and WhatsApp records
            on the devices we use to run the business. This website itself sets
            no advertising or tracking cookies. If we later add an analytics
            service, this policy will be updated before that happens.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us what we hold about you, ask us to correct it and ask
            us to delete it. Write to info@trulytoursnamibia.com and we will
            respond within a reasonable time. We may keep the records a booking
            requires for accounting purposes, and we will tell you if that
            applies. We handle personal details under the law of Namibia,
            including the privacy protection in Article 13 of the Namibian
            Constitution, and we apply the same care to visitors from the
            European Union that the GDPR expects.
          </p>

          <h2>Contact</h2>
          <p>
            Truly Tours Namibia, Windhoek, Namibia. Email
            info@trulytoursnamibia.com or call +264 81 464 2798.
          </p>
        </div>
      </main>
      <SubFooter />
    </>
  );
}
