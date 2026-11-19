// SEO Audit Report — Truly Tours Namibia (docx generation)
// R1 cover (DS-1 Deep Sea), report scene Profile A (English, Times New Roman)
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  TableOfContents, SectionType, TableLayoutType,
} = require("docx");
const fs = require("fs");
const sizeOf = require("image-size");

// ---------- Palette (DS-1 Deep Sea) ----------
const P = {
  bg: "0B1C2C", accent: "529286",
  titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078",
  headingDark: "0B1C2C", body: "000000", secondary: "606060",
  tHeaderBg: "529286", tHeaderText: "FFFFFF", tInnerLine: "BECFCC", tSurface: "E8ECEB",
};
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ---------- Cover helpers (English-aware) ----------
function estimateTextWidth(text, pt) {
  let w = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0);
    const isCJK = (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3000 && code <= 0x303f);
    w += isCJK ? pt * 20 : pt * 11;
  }
  return w;
}
function splitTitleLinesEn(title, maxWidthTwips, pt) {
  const words = title.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const wd of words) {
    const cand = cur ? cur + " " + wd : wd;
    if (estimateTextWidth(cand, pt) <= maxWidthTwips || !cur) cur = cand;
    else { lines.push(cur); cur = wd; }
  }
  if (cur) lines.push(cur);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    const last = lines.pop();
    lines[lines.length - 1] += " " + last;
  }
  return lines;
}
function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
  let titlePt = preferredPt, lines;
  while (titlePt >= minPt) {
    lines = splitTitleLinesEn(title, maxWidthTwips, titlePt);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) { lines = splitTitleLinesEn(title, maxWidthTwips, minPt); titlePt = minPt; }
  return { titlePt, titleLines: lines };
}
function calcCoverSpacing(params) {
  const { titleLineCount = 1, titlePt = 36, hasSubtitle = false, hasEnglishLabel = false,
    metaLineCount = 0, fixedHeight = 800, pageHeight = 16838, marginTop = 0, marginBottom = 0 } = params;
  const SAFETY = 1200;
  const usableHeight = pageHeight - marginTop - marginBottom - SAFETY;
  const titleHeight = titleLineCount * (titlePt * 23 + 200);
  const subtitleHeight = hasSubtitle ? (12 * 23 + 600) : 0;
  const englishLabelHeight = hasEnglishLabel ? (9 * 23 + 600) : 0;
  const metaHeight = metaLineCount * (10 * 23 + 100);
  const implicitParaHeight = 3 * 300;
  const contentHeight = titleHeight + subtitleHeight + englishLabelHeight + metaHeight + fixedHeight + implicitParaHeight;
  const remainingSpace = usableHeight - contentHeight;
  const safeRemaining = Math.max(remainingSpace, 400);
  const FOOTER_MIN = 800;
  const rawTop = Math.floor(safeRemaining * 0.45);
  const rawBottom = Math.floor(safeRemaining * 0.45);
  const bottomSpacing = Math.max(rawBottom, FOOTER_MIN);
  const topSpacing = Math.max(rawTop - Math.max(0, FOOTER_MIN - rawBottom), 400);
  const midSpacing = Math.max(safeRemaining - topSpacing - bottomSpacing, 0);
  return { topSpacing, midSpacing, bottomSpacing };
}

// ---------- Recipe R1 cover ----------
function buildCoverR1(config) {
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 40, 24);
  const titleSize = titlePt * 2;
  const spacing = calcCoverSpacing({
    titleLineCount: titleLines.length, titlePt,
    hasSubtitle: !!config.subtitle, hasEnglishLabel: !!config.englishLabel,
    metaLineCount: (config.metaLines || []).length, fixedHeight: 400,
  });
  const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: P.accent, space: 12 };
  const children = [];
  children.push(new Paragraph({ spacing: { before: spacing.topSpacing } }));
  if (config.englishLabel) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 500 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: P.accent, space: 8 } },
      children: [new TextRun({ text: config.englishLabel.split("").join(" "), size: 18, color: P.accent, font: { ascii: "Arial" }, characterSpacing: 40 })],
    }));
  }
  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      indent: { left: padL },
      spacing: { after: i < titleLines.length - 1 ? 100 : 300, line: Math.ceil(titlePt * 23), lineRule: "atLeast" },
      children: [new TextRun({ text: titleLines[i], size: titleSize, bold: true, color: P.titleColor, font: { ascii: "Arial" } })],
    }));
  }
  if (config.subtitle) {
    children.push(new Paragraph({
      indent: { left: padL }, spacing: { after: 800 },
      children: [new TextRun({ text: config.subtitle, size: 24, color: P.subtitleColor, font: { ascii: "Arial" } })],
    }));
  }
  for (const line of (config.metaLines || [])) {
    children.push(new Paragraph({
      indent: { left: padL + 200 }, spacing: { after: 80 },
      border: { left: accentLeft },
      children: [new TextRun({ text: line, size: 24, color: P.metaColor, font: { ascii: "Arial" } })],
    }));
  }
  children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing } }));
  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: P.accent, space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: config.footerLeft || "", size: 16, color: P.footerColor, font: { ascii: "Arial" } }),
      new TextRun({ text: "                                        " }),
      new TextRun({ text: config.footerRight || "", size: 16, color: P.footerColor, font: { ascii: "Arial" } }),
    ],
  }));
  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.bg }, borders: noBorders, verticalAlign: "top",
        children,
      })],
    })],
  })];
}

// ---------- Body helpers ----------
const EN = { ascii: "Times New Roman", eastAsia: "Times New Roman" };
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, color: P.headingDark, font: EN })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, color: P.headingDark, font: EN })],
  });
}
function body(runsOrText) {
  const children = typeof runsOrText === "string"
    ? [new TextRun({ text: runsOrText, size: 24, color: P.body, font: EN })]
    : runsOrText;
  return new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 120, line: 312 }, children });
}
function r(text, opts = {}) { return new TextRun({ text, size: 24, color: P.body, font: EN, ...opts }); }
function evidence(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT, spacing: { after: 160, line: 312 },
    children: [new TextRun({ text: "Evidence: " + text, italics: true, size: 19, color: P.secondary, font: EN })],
  });
}
function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 80, after: 160, line: 312 },
    children: [new TextRun({ text, size: 19, color: P.secondary, font: EN })],
  });
}
function cell(text, { bold = false, fill = null, color = null, width = null, align = AlignmentType.LEFT } = {}) {
  return new TableCell({
    children: [new Paragraph({ alignment: align, spacing: { line: 312 }, children: [new TextRun({ text, bold, size: 21, color: color || P.body, font: EN })] })],
    shading: fill ? { type: ShadingType.CLEAR, fill } : undefined,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
  });
}
function hTable(headers, rows, widths) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: P.accent },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: P.accent },
      left: NB, right: NB,
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.tInnerLine },
      insideVertical: NB,
    },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: headers.map((t, i) => cell(t, { bold: true, fill: P.tHeaderBg, color: P.tHeaderText, width: widths ? widths[i] : undefined })),
      }),
      ...rows.map((row, ri) => new TableRow({
        cantSplit: true,
        children: row.map((t, i) => cell(t, { fill: ri % 2 === 0 ? P.tSurface : "FFFFFF", width: widths ? widths[i] : undefined })),
      })),
    ],
  });
}
function tableTitle(text) {
  return new Paragraph({
    keepNext: true, spacing: { before: 200, after: 80, line: 312 },
    children: [new TextRun({ text, bold: true, size: 21, color: P.headingDark, font: EN })],
  });
}

// ---------- Chart image ----------
const chartBuf = fs.readFileSync("/home/z/my-project/audit_data/scorecard.png");
const dims = sizeOf.imageSize ? sizeOf.imageSize(chartBuf) : sizeOf(chartBuf);
const chartW = 560;
const chartH = Math.round(chartW * (dims.height / dims.width));

// ---------- Body content ----------
const bodyChildren = [];

// 1. Executive Summary
bodyChildren.push(h1("1. Executive Summary"));
bodyChildren.push(body([
  r("This report presents a site-wide search engine optimisation (SEO) audit of "),
  r("trulytoursnamibia.com", { bold: true }),
  r(", a small tour-operator website for a Windhoek-based Namibian travel company, audited on 19 November 2026. Sixteen pages were fetched and inspected in full, covering every page published in the XML sitemap, and the site's live visibility was checked against Google search results. The overall rating is "),
  r("4 out of 10", { bold: true }),
  r(": the site is technically reachable, correctly indexed and visually professional, but its on-page optimisation is broken in ways that actively prevent it from ranking for the non-brand searches that matter to a tour operator."),
]));
bodyChildren.push(body([
  r("Three problems dominate the score. First, every page title on the site ends with a dangling separator and no brand name (for example \u201cTours - \u201d), because the SEO plugin's site-name field is unset. Second, at least six tour pages have titles that describe a different product than the page's URL and meta description \u2014 the \u201c10 days Tours\u201d page is titled \u201cCity/Township Tour\u201d, and the \u201cSossusvlei and Swakopmund\u201d page is titled \u201cBar Hopping\u201d \u2014 a symptom of Elementor content being copied or swapped between pages without updating SEO fields. Third, 12 of the 16 audited pages contain no H1 heading at all, while the homepage carries two. Layered on top are thin page content, a 4 MB uncompressed hero image, an estimated 5.3-second DOM-interactive time in a controlled render, and generic boilerplate structured data with no tour, price or business-location markup."),
]));
bodyChildren.push(body([
  r("The foundations are genuinely sound: robots.txt, XML sitemaps, HTTPS redirects, canonical tags and 404 handling are all correct, the domain is fully indexed, and the brand query \u201cTruly Tours Namibia\u201d returns the site at position one alongside an active Instagram profile and business-directory listings. Fixing the title template, realigning the six mismatched pages, adding one H1 per page and compressing images is roughly a week of work and would move the rating to approximately 6\u20137. A prioritised 30/60/90-day roadmap is provided in Section 9."),
]));

// 2. Scope & Method
bodyChildren.push(h1("2. Scope, Method and Evidence Base"));
bodyChildren.push(body([
  r("The audit followed a site-wide (Mode B) methodology: the robots.txt file and sitemap index were fetched first, every URL in the page sitemap was inventoried (20 URLs), and a working sample of 15 pages plus the homepage was downloaded and parsed. All four residual URLs outside the main sample (\u201c/sample-page/\u201d, \u201c/hello-world/\u201d, \u201c/tours-2/\u201d and \u201c/customer-cabinet/\u201d) were additionally status-checked. For each page the audit extracted the title tag, meta description, canonical, robots directive, heading structure, word count, image inventory and JSON-LD structured data. A headless Chromium render of the homepage was used to confirm which markup is injected by JavaScript at runtime rather than present in server HTML, and to capture realistic timing proxies."),
]));
bodyChildren.push(body([
  r("Live search visibility was verified with real search queries against Google (\u201csite:trulytoursnamibia.com\u201d for indexation and a brand-name query for reputation), executed on the audit date. Every finding in this report cites the command or check that produced it, quoted verbatim where relevant. One tooling substitution should be noted: the planned Bright Data CLI (bdata) rendering layer was not available in the audit environment, so JavaScript-rendered verification was performed with a local headless browser instead \u2014 the site's schema turned out to be server-rendered in raw HTML, so no detection coverage was lost."),
]));
bodyChildren.push(body([
  r("Out of scope are Google Search Console coverage data, field Core Web Vitals, backlink profiles and analytics \u2014 these require tools with authenticated or paid data access and are listed with recommended substitutes in Section 10. No changes were made to the website during the audit."),
]));

// 3. Tier 1
bodyChildren.push(h1("3. Tier 1 \u2014 Crawlability and Indexation (Score 8/10)"));
bodyChildren.push(body([
  r("Crawlability is the strongest tier. robots.txt is minimal and correct, allowing all user agents except /wp-admin/ and explicitly declaring the sitemap location. The sitemap index resolves to four child sitemaps (pages, posts, categories, elementor library) and every URL responds with HTTP 200. Protocol hygiene is clean: http and www variants both 301-redirect to https://trulytoursnamibia.com, non-existent URLs return a genuine 404 status rather than a soft 200, and the Sectigo TLS certificate is valid from 4 November 2026 to 21 May 2027. The indexation proxy search returned the homepage, gallery, contact page and tour pages as indexed, so Google has no structural obstacle to crawling or indexing the site."),
]));
bodyChildren.push(evidence("curl https://trulytoursnamibia.com/robots.txt \u2192 \u201cUser-agent: * / Disallow: /wp-admin/ / Sitemap: https://trulytoursnamibia.com/sitemap_index.xml\u201d; curl -I on http:// and www:// variants \u2192 \u201c301\u201d; curl https://trulytoursnamibia.com/this-page-does-not-exist-xyz/ \u2192 \u201c404\u201d."));
bodyChildren.push(body([
  r("Three hygiene issues keep this tier from scoring higher. The sitemap still lists WordPress install leftovers \u2014 \u201c/sample-page/\u201d with its default content and the default \u201c/hello-world/\u201d blog post \u2014 signalling an unfinished site. More damaging, \u201c/tours-2/\u201d is a live duplicate of the tours overview page: it returns 200, carries a self-referencing canonical rather than pointing to \u201c/tours/\u201d, has an empty title tag, and is linked twice from the homepage navigation, so search engines are invited to index two competing tours pages. Finally, \u201c/customer-cabinet/\u201d, an internal booking-plugin page, is exposed in the public sitemap where it has no search value."),
]));

// 4. Tier 2
bodyChildren.push(h1("4. Tier 2 \u2014 Technical Foundations (Score 4/10)"));
bodyChildren.push(body([
  r("The stack is WordPress 7.1.5 with the Astra theme, Elementor page builder, LiteSpeed server-side caching, and a plugin set including EWWW Image Optimizer, LatePoint booking and CookieAdmin consent. Correct mobile viewport metadata, alt attributes on all sampled images and lazy-loading markup show that basics are being attended to. Performance, however, is materially poor. Raw HTML per page runs 227\u2013284 KB, and in a controlled headless render the homepage reached DOM-interactive at 5.28 seconds and the load event at 7.2 seconds on an unthrottled connection \u2014 well above the thresholds where bounce behaviour degrades. The single largest cause is one image: \u201cZebra.png\u201d, served at 4,028 KB, a full-resolution PNG used as a content image."),
]));
bodyChildren.push(evidence("agent-browser (headless Chromium) eval of performance.getEntriesByType('navigation') on the homepage \u2192 \u201c50KB html transfer, domInteractive=5280ms, load=7205ms\u201d; curl of https://trulytoursnamibia.com/wp-content/uploads/2025/07/Zebra.png \u2192 \u201c4028 KB\u201d."));
bodyChildren.push(body([
  r("Plugin overhead compounds the image problem. LatePoint loads roughly 522 KB of JavaScript (vendor-front.js at 405 KB plus front.js at 117 KB) on every page including the homepage, where no booking widget appears; jQuery and the deprecated jquery-migrate layer are still loaded; and 13\u201314 separate script files ship per page. Despite EWWW Image Optimizer being installed, zero images across the sample are served in WebP or AVIF format, and the gallery page alone embeds 92 uncompressed raster images. Two clean-up items remain: the CookieAdmin plugin injects two stray \u201c<title>CookieAdmin</title>\u201d elements into every page's head \u2014 malformed markup that also pollutes title-tag parsing \u2014 and the \u201cgenerator\u201d meta tags advertise the exact WordPress and Elementor versions, an unnecessary disclosure to automated scanners."),
]));

// 5. Tier 3
bodyChildren.push(h1("5. Tier 3 \u2014 On-Page Optimization (Score 2.5/10)"));
bodyChildren.push(body([
  r("This is the audit's most serious finding. The title-tag template is broken site-wide: every one of the 16 audited pages ends its title with a dangling \u201c- \u201d separator and no site name, because the SEO plugin's site-name setting is empty. Search results therefore display \u201cTours - \u201d, \u201cHome - \u201d, \u201cContact - \u201d \u2014 truncated, brand-less strings that waste the most valuable pixel on the page and suppress click-through. The same broken pattern flows into the og:title social-sharing tags. On the duplicate page \u201c/tours-2/\u201d the title is entirely empty."),
]));
bodyChildren.push(evidence("curl each page + grep \u201c<title>\u201d \u2192 \u201cHome - \u201d, \u201cTours - \u201d, \u201cContact - \u201d, \u201cGallery - \u201d, \u201cGame Drive - \u201d, \u201cBar Hopping - \u201d; /tours-2/ \u2192 \u201c<title> - </title>\u201d with <link rel=\u201ccanonical\u201d href=\u201chttps://trulytoursnamibia.com/tours-2/\u201d>."));
bodyChildren.push(body([
  r("Worse than the template is a systematic title/content mismatch. On six pages the title tag describes a different product from the page's URL and its own meta description, which indicates Elementor sections were pasted or swapped between pages without updating the SEO fields. Google is being told three different stories about each of these URLs, which is close to the definition of conflicting relevance signals. Table 1 lists the mismatches verbatim."),
]));
bodyChildren.push(tableTitle("Table 1: Title tag versus page URL and meta description (verbatim excerpts)"));
bodyChildren.push(hTable(
  ["URL", "Title tag shown", "What the URL and meta description say"],
  [
    ["/10-days-tours/", "City/Township Tour -", "10 days Tours \u2014 Windhoek, Sossusvlei, Swakopmund, Spitzkoppen, Etosha"],
    ["/sossusvlei-and-swakopmund/", "Bar Hopping -", "3 days tour \u2014 Sossusvlei and Swakopmund"],
    ["/kalahari/", "Game Drive -", "13 days tour \u2014 Kalahari, Fish River Canyon, L\u00fcderitz, Sossusvlei, Swakopmund"],
    ["/tour-to-the-north/", "Taste Namibia -", "12 days Tour to the north \u2014 Swakopmund, Damaraland, Owamboland, Etosha"],
    ["/windhoek-sossusvlei/", "Step into Ancient Wisdom -", "10 days tour \u2014 Windhoek, Sossusvlei, Swakopmund, Brandberg, Twyfelfontein, Etosha"],
    ["/10-days-tours/ vs /ctt/", "Both titled as City/Township variants", "Two pages now compete for the same \u201cCity/Township Tour\u201d query space"],
  ],
  [24, 30, 46]
));
bodyChildren.push(body([
  r("The heading structure repeats the disorder. Table 2 summarises the H1 audit: eleven of the sampled tour pages have no H1 at all \u2014 their main product name is marked up as an H3 (on \u201c/kalahari/\u201d the tour title \u201cKalahari, Quiver tree forest, Fish River Canyon...\u201d is an H3, followed directly by footer H2s) \u2014 while the homepage renders two H1s. Slug strategy also undermines relevance: five product pages use inscrutable abbreviations (\u201c/ctt/\u201d, \u201c/saw/\u201d, \u201c/gde/\u201d, \u201c/tnt/\u201d, \u201c/bhw/\u201d) that neither users nor search engines can decode, and \u201c/kalahari/\u201d actually holds a 13-day multi-region tour rather than Kalahari content."),
]));
bodyChildren.push(tableTitle("Table 2: H1 heading audit across the 16-page sample"));
bodyChildren.push(hTable(
  ["Page group", "Pages", "H1 count", "Observed main title markup"],
  [
    ["Homepage", "1", "2 (duplicate)", "H1 \u201cHome\u201d + H1 \u201cWelcome to Truly Tours Namibia\u201d"],
    ["Utility pages (tours, contact, gallery, team)", "4", "1 each (correct)", "H1 \u201cTours & Activities\u201d, \u201cContact Us\u201d, \u201cGallery\u201d, \u201cOur Team\u201d"],
    ["Tour detail pages", "11", "0", "Product name in H3; no H1 element on the page"],
    ["/tours-2/ duplicate", "1", "0", "No H1, empty title, self-canonical"],
  ],
  [34, 10, 16, 40]
));
bodyChildren.push(body([
  r("Structured data is present but generic. Every page carries identical WebSite, WebPage, Organization, BreadcrumbList and SearchAction JSON-LD (confirmed both in raw HTML and after JavaScript rendering, so it is server-injected). There is no LocalBusiness or TravelAgency entity, no Product or Offer markup with prices on tour pages, no TouristDestination or FAQPage, and no Review markup on the testimonials shown on the homepage. The Organization node itself contains auto-filled filler \u2014 founder \u201ctruly tours namibia\u201d, slogan \u201cTruly Tours Namibia\u201d, no logo, address, telephone or social profile links. For a local tour operator competing in \u201cNamibia tour\u201d and \u201cEtosha safari tour\u201d result spaces, this is the cheapest missing competitive asset. Internal linking works \u2014 the homepage links 18 distinct pages 47 times \u2014 but the tour-card links all use the anchor text \u201cREAD MORE\u201d, discarding the keyword context that descriptive anchors would pass."),
]));
bodyChildren.push(evidence("python parse of JSON-LD blocks on all 16 pages \u2192 \u201c['WebSite', 'WebPage', 'Organization', 'BreadcrumbList', 'SearchAction']\u201d on every page; Organization node \u2192 \u201cfounder: [{'@type': 'Person', 'name': 'truly tours namibia'}], url: 'https://trulytoursnamibia.com/ '\u201d (trailing space, no logo/address/phone)."));

// 6. Tier 4
bodyChildren.push(h1("6. Tier 4 \u2014 Content Quality (Score 3/10)"));
bodyChildren.push(body([
  r("The visible layer of the content is good: the design is clean, the photography is real and appealing, guest testimonials are displayed with names, and the contact details (two phone numbers, info@trulytoursnamibia.com, Windhoek address) are consistent across the footer and contact page. The depth of the content behind that facade is the problem. Rendered word counts \u2014 including navigation, footers and cookie text \u2014 range from 350 to 1,085 words per page, meaning real body copy on a multi-day tour page is often only 150\u2013400 words. A 12- or 13-day itinerary is summarised in a handful of sentences with no day-by-day breakdown, no inclusions and exclusions, no rates, and no departure information, which both weakens rankings for itinerary-style queries and forces serious buyers to phone instead of self-qualifying."),
]));
bodyChildren.push(evidence("python word-count of stripped HTML across the sample \u2192 394\u20131,085 words per page (e.g. /tnt/ 424, /kalahari/ 621, /tours/ 1,085, gallery 350); meta descriptions present and well-sized (147\u2013162 characters) on all content pages."));
bodyChildren.push(body([
  r("The publishing layer is effectively unused. The blog consists of one default \u201cHello world!\u201d post in one \u201cUncategorized\u201d category, so the site has no mechanism for capturing long-tail queries such as \u201chow many days do you need in Sossusvlei\u201d or \u201cWindhoek to Etosha road trip\u201d, which are the classic top-of-funnel queries for this industry. There is no FAQ content, no destination guide material, and no pricing information anywhere on the site. One genuinely positive element should be credited: the meta descriptions are handwritten, specific and correctly sized on every content page \u2014 they simply describe the wrong product on the six mismatched pages identified in Tier 3, which is why fixing those pages matters double."),
]));

// 7. Tier 5
bodyChildren.push(h1("7. Tier 5 \u2014 Authority, Trust and Local Signals (Score 6/10)"));
bodyChildren.push(body([
  r("Off-site basics are healthier than the on-site state. The brand query \u201cTruly Tours Namibia\u201d returns the website first, the Instagram profile (@truly_tours_namibia) second, and business-directory or profile listings for \u201cTruly Tours Namibia CC\u201d further down, which indicates a claimed and at least minimally maintained business footprint. The site itself reinforces trust with named customer testimonials, a stated Namibia Tourism Board membership, a CSR page and an \u201cOur team\u201d page \u2014 all appropriate E-E-A-T signals for a business whose product is guided travel."),
]));
bodyChildren.push(evidence("Web search for \u201cTruly Tours Namibia Windhoek tours\u201d (19 Nov 2026) \u2192 rank 1: trulytoursnamibia.com; rank 2: instagram.com/truly_tours_namibia; further results: \u201cTruly Tours Namibia CC\u201d directory listings."));
bodyChildren.push(body([
  r("The weakness is that none of this authority is made machine-readable or reinforced on-site. The business schema carries no address, geo-coordinates, opening hours or sameAs links to the Instagram and directory profiles, so Google must infer entity identity instead of reading it; the testimonials carry no Review/AggregateRating markup and are not collected on a dedicated, linkable reviews page; and the team and CSR pages are a few sentences each, too thin to act as trust assets. Backlink quantity and quality could not be measured in this audit (no backlink-index tool was available) and are flagged for follow-up in Section 10 \u2014 for a site this small, even a handful of tourism-directory and partner links typically moves local rankings."),
]));

// 8. Scorecard
bodyChildren.push(h1("8. Scorecard and Rating Rationale"));
bodyChildren.push(body([
  r("Each tier is scored on 0\u201310 against its own evidence, then combined with weights that reflect SEO impact for a small local-service site: crawlability 15%, technical foundations 20%, on-page optimisation 30%, content quality 25% and authority 10%. The weighted result is 0.15\u00d78 + 0.20\u00d74 + 0.30\u00d72.5 + 0.25\u00d73 + 0.10\u00d76 = 4.1, which rounds to the overall rating of "),
  r("4/10", { bold: true }),
  r(". The site is not broken \u2014 it is indexed, crawlable, secure and credible \u2014 but its highest-weight tier (on-page) is close to non-functional, so it currently competes for almost none of its non-brand query space."),
]));
bodyChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { before: 120, after: 40 },
  children: [new ImageRun({ data: chartBuf, transformation: { width: chartW, height: chartH }, type: "png" })],
}));
bodyChildren.push(caption("Figure 1: Tier scores and weighted overall rating (4.1 \u2192 4/10)"));
bodyChildren.push(tableTitle("Table 3: Scorecard summary"));
bodyChildren.push(hTable(
  ["Tier", "Wt.", "Score", "Primary drivers"],
  [
    ["1. Crawlability & Indexation", "15%", "8.0", "Clean robots/sitemaps/redirects; leftover pages; /tours-2/ duplicate"],
    ["2. Technical Foundations", "20%", "4.0", "4 MB PNG; no WebP; ~522 KB LatePoint JS everywhere; 5.3 s DOM-interactive"],
    ["3. On-Page Optimization", "30%", "2.5", "Broken title template; 6 swapped pages; 12 pages without H1; generic schema"],
    ["4. Content Quality", "25%", "3.0", "150\u2013400 words of real body copy; no blog, FAQ or pricing"],
    ["5. Authority & Local Signals", "10%", "6.0", "Brand SERP #1; Instagram + listings; no machine-readable entity or reviews"],
  ],
  [30, 10, 10, 50]
));

// 9. Roadmap
bodyChildren.push(h1("9. Prioritized Fix Roadmap"));
bodyChildren.push(body([
  r("The roadmap is ordered by return on effort: everything in the first block is configuration or copy correction rather than development, and together the first two blocks address most of what separates the site from its query space. Impact estimates are directional, based on the audit evidence, not guarantees."),
]));
bodyChildren.push(tableTitle("Table 4: Action list in priority order"));
bodyChildren.push(hTable(
  ["P", "Action", "Addresses", "Expected effect"],
  [
    ["P1", "Set the SEO plugin site name to \u201cTruly Tours Namibia\u201d and rebuild the title template as \u201cPage | Truly Tours Namibia\u201d", "Tier 3", "All SERP snippets gain brand + keywords; quick CTR lift"],
    ["P2", "Rewrite titles, H1s and body of the six swapped pages so title = URL = description = content", "Tier 3", "Restores relevance signals on the core money pages"],
    ["P3", "Add exactly one descriptive H1 per page; demote homepage second H1; promote tour names from H3 to H1", "Tier 3", "Clear page topics for crawlers and skimmers"],
    ["P4", "Delete or 301: /tours-2/ \u2192 /tours/; remove /sample-page/, /hello-world/, /customer-cabinet/ from sitemap; noindex plugin pages", "Tier 1", "Removes duplicate and zero-value URLs from the index"],
    ["P5", "Compress Zebra.png (target < 200 KB), convert all uploads to WebP, verify EWWW bulk conversion actually ran", "Tier 2", "Largest single page-weight cut; direct speed gain"],
    ["P6", "Dequeue LatePoint and booking CSS/JS on pages without the booking widget; drop jquery-migrate", "Tier 2", "Cuts ~500+ KB of render-blocking JS sitewide"],
    ["P7", "Replace slugs /ctt/, /saw/, /gde/, /tnt/, /bhw/, /kalahari/ with descriptive slugs via 301 redirects", "Tier 3", "Keyword-bearing URLs; fixes the /kalahari/ mismatch"],
    ["P8", "Add LocalBusiness/TravelAgency schema (address, phone, geo, hours, logo, sameAs) and Product+Offer with prices on tours; mark up testimonials as Review", "Tier 3/5", "Rich-result eligibility; entity consolidation"],
    ["P9", "Expand each tour page: day-by-day itinerary, rates, inclusions, departure points, FAQ block (300\u2013600 added words)", "Tier 4", "Long-tail capture; self-qualification of buyers"],
    ["P10", "Start a small blog/destination-guide series (Sossusvlei, Etosha, Swakopmund itineraries) linking into tour pages", "Tier 4", "Top-of-funnel traffic and internal link equity"],
  ],
  [8, 40, 14, 38]
));
bodyChildren.push(body([
  r("Suggested sequencing: days 1\u20137 cover P1\u2013P4 (configuration and copy correction, roughly a day of focused work each once access is available); days 8\u201330 cover P5\u2013P7 (image bulk conversion, script conditioning and slug migrations, which need modest testing); days 31\u201390 cover P8\u2013P10, where schema implementation and content expansion benefit from being done incrementally as new material is written. After the first block, re-crawl the sample and confirm titles render with the brand suffix; after the second, run PageSpeed Insights and Search Console to validate the CWV and coverage gains that this audit could not measure directly."),
]));

// 10. Out of scope
bodyChildren.push(h1("10. Out-of-Scope Notes and Recommended Follow-Up"));
bodyChildren.push(body([
  r("Four measurement areas sit outside what could be verified here and should be checked with the right tools before drawing final conclusions. Field Core Web Vitals (real-user LCP, INP and CLS) requires PageSpeed Insights or the CrUX dataset; the headless timings in this report are controlled-render proxies, not field data. Index coverage detail \u2014 which of the 20 URLs Google actually keeps indexed, and why it excludes any \u2014 requires Google Search Console on the owner's account. Backlink quantity, quality and anchor profile require an index such as Ahrefs, Semrush or Moz. Finally, conversion behaviour (how many reservation-button clicks become bookings, and where visitors abandon) requires the site's analytics; the LatePoint reservation funnel was visible in the code but its performance was not measurable here."),
]));
bodyChildren.push(body([
  r("Two smaller caveats belong on the record. First, the audit's search-result checks were run once on 19 November 2026 and reflect that day's results; rankings for the brand query are stable indicators, but position checks for individual tour keywords would fluctuate. Second, no content accuracy review was performed \u2014 itinerary facts, prices and claim wording on the tour pages were assessed for structure and depth, not for factual correctness against Namibian parks and tourism regulations."),
]));

// ---------- Assemble document ----------
const pgSize = { width: 11906, height: 16838 };
const pgMargin = { top: 1440, bottom: 1440, left: 1701, right: 1417 };

function pageFooter(colorHex) {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: colorHex, font: EN })],
    })],
  });
}
const bodyHeader = new Header({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "SEO Audit \u2014 Truly Tours Namibia (trulytoursnamibia.com)", size: 18, color: "808080", font: EN })],
  })],
});

const doc = new Document({
  creator: "SEO Audit",
  title: "SEO Audit Report - Truly Tours Namibia",
  styles: {
    default: {
      document: {
        run: { font: EN, size: 24, color: P.body },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: EN, size: 32, bold: true, color: P.headingDark },
        paragraph: { spacing: { before: 360, after: 160, line: 312 }, outlineLevel: 0 },
      },
      heading2: {
        run: { font: EN, size: 28, bold: true, color: P.headingDark },
        paragraph: { spacing: { before: 240, after: 120, line: 312 }, outlineLevel: 1 },
      },
    },
  },
  sections: [
    { // Section 1: Cover
      properties: { page: { size: pgSize, margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
      children: buildCoverR1({
        englishLabel: "SEO PERFORMANCE AUDIT",
        title: "Website SEO Audit and Rating Report",
        subtitle: "Truly Tours Namibia  |  trulytoursnamibia.com",
        metaLines: [
          "Overall rating: 4 / 10",
          "Audit date: 19 November 2026",
          "Coverage: 16 pages inspected, all 20 sitemap URLs inventoried",
          "Method: crawl, rendered inspection and live SERP checks",
        ],
        footerLeft: "Site-wide SEO audit",
        footerRight: "November 2026",
      }),
    },
    { // Section 2: Front matter (TOC) — Roman numerals
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN } },
      },
      footers: { default: pageFooter("888888") },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 480, after: 360 },
          children: [new TextRun({ text: "Table of Contents", bold: true, size: 32, font: EN, color: P.headingDark })],
        }),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-2" }),
        new Paragraph({
          spacing: { before: 200 },
          children: [new TextRun({
            text: "Note: This Table of Contents is generated via field codes. To ensure page number accuracy after editing, please right-click the TOC and select \u201cUpdate Field.\u201d",
            italics: true, size: 18, color: "888888", font: EN,
          })],
        }),
        // No trailing PageBreak: the body starts in its own NEXT_PAGE section
      ],
    },
    { // Section 3: Body — Arabic numerals from 1
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } },
      },
      headers: { default: bodyHeader },
      footers: { default: pageFooter("808080") },
      children: bodyChildren,
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/z/my-project/download/SEO_Audit_Report_Truly_Tours_Namibia.docx", buf);
  console.log("DOCX written:", buf.length, "bytes");
});
