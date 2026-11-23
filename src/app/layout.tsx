import type { Metadata, Viewport } from "next";
import "./globals.css";

/* Production URL: the clean Vercel deployment (Tangison webmaster checklist).
   Canonical, OG URLs and the sitemap all resolve against it. */
export const PROD_URL = "https://truly-tours-namibia.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(PROD_URL),
  title: {
    default: "Truly Tours Namibia: guided tours from Windhoek",
    template: "%s | Truly Tours Namibia",
  },
  description:
    "Guided Namibia tours from Windhoek: 3 to 13-day loops to Sossusvlei, Etosha, Swakopmund and the Kalahari, plus Windhoek city, township and bushmen walks.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Truly Tours Namibia: guided tours from Windhoek",
    description:
      "3 to 13-day guided tours across Namibia, plus city, township and cultural walks from Windhoek.",
    type: "website",
    url: "/",
    siteName: "Truly Tours Namibia",
    images: [
      {
        url: "/images/sossusvlei.webp",
        width: 1600,
        height: 900,
        alt: "Dead trees in the white clay pan of Sossusvlei",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Truly Tours Namibia",
    description: "Guided Namibia tours from Windhoek.",
    images: ["/images/sossusvlei.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4efe8",
};

/* Structured data: real business data only (phones, email, city, Instagram
   come from the client's contact block; nothing invented). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TourOperator",
  name: "Truly Tours Namibia",
  description:
    "Guided Namibia tours from Windhoek: 3 to 13-day loops to Sossusvlei, Etosha, Swakopmund and the Kalahari, plus Windhoek city, township and bushmen walks.",
  url: PROD_URL,
  telephone: ["+264 81 464 2798", "+264 81 258 2241"],
  email: "info@trulytoursnamibia.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Windhoek",
    addressCountry: "NA",
  },
  areaServed: "Namibia",
  sameAs: ["https://www.instagram.com/truly_tours_namibia"],
  openingHours: "Mo-Fr 07:30-17:00",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-type="service"
      data-radius="soft"
      data-buttons="block"
      data-motion
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400..700&display=swap"
          rel="stylesheet"
        />
        {/* taste-skill kit: system + motion + layout, in the order start.mjs prints */}
        <link rel="stylesheet" href="/assets/system.css" />
        <link rel="stylesheet" href="/assets/ui/cards.css" />
        <link rel="stylesheet" href="/assets/motion/motion.css" />
        <link rel="stylesheet" href="/assets/layout/layout.css" />
        {/* the brand tokens the deal printed (start.mjs brand from the client's logo colours) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--p-bg:#f4efe8;--p-surface:#e9e2d6;--p-ink:#33291c;--p-muted:#6b6154;--p-accent:#c05a15;--p-accent-ink:#ffffff;--p-action:#c05a15;--p-action-ink:#ffffff;--p-inv-bg:#33291c;--p-inv-surface:#3f3528;--p-inv-ink:#f4efe8;--p-inv-muted:#aba39a;--p-inv-accent:#c05a15;--p-inv-accent-ink:#ffffff;--p-inv-action:#c05a15;--p-inv-action-ink:#ffffff;--font-display:"Schibsted Grotesk",system-ui,sans-serif;--font-text:"Schibsted Grotesk",system-ui,sans-serif;--display-weight:400;--display-tracking:-0.035em;--display-tracking-xl:-0.042em;--ly-scale:0.98}`,
          }}
        />
        {/* the hero's entrance guard (motion.md) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* the brand bar: 4px accent on the extreme top edge, from the logo artwork */}
        <div className="brand-bar" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
