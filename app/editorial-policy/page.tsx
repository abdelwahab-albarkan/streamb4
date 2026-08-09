import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Policy — How We Create IPTV Content | STREAMB4",
  description: "Learn how STREAMB4 creates, reviews, and updates IPTV guides and articles. Our editorial standards, fact-checking process, and content update policy.",
  alternates: {
    canonical: "https://streamb4.com/editorial-policy",
  },
  openGraph: {
    title: "Editorial Policy | STREAMB4",
    description: "How STREAMB4 creates and maintains accurate, helpful IPTV content. Our editorial standards and review process.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "STREAMB4 Editorial Policy" }],
    url: "https://streamb4.com/editorial-policy",
  },
};

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://streamb4.com/editorial-policy#webpage",
  "url": "https://streamb4.com/editorial-policy",
  "name": "Editorial Policy — STREAMB4",
  "description": "How STREAMB4 creates, reviews, and maintains IPTV guides and articles.",
  "isPartOf": { "@id": "https://streamb4.com/#website" },
  "publisher": { "@id": "https://streamb4.com/#organization" },
  "inLanguage": "en-US",
  "datePublished": "2024-01-01",
  "dateModified": "2026-01-01",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
    { "@type": "ListItem", "position": 2, "name": "Editorial Policy", "item": "https://streamb4.com/editorial-policy" },
  ],
};

const SECTIONS = [
  {
    title: "Who Creates Our Content",
    body: `All STREAMB4 guides, tutorials, and blog articles are written by the STREAMB4 Editorial Team — a group of streaming technicians, IPTV setup specialists, and cord-cutting enthusiasts who use the product daily.

Our writers have hands-on experience configuring IPTV on Firestick, Android TV, Smart TVs (Samsung, LG, Sony), Apple TV, and MAG boxes. Technical claims in our articles reflect real device testing, not generic advice copied from other sources.

When an article covers a specific region (USA, Canada, UK), it is reviewed by a team member familiar with the local broadcast rights landscape and ISP environment for that region.`,
  },
  {
    title: "How We Create Articles",
    body: `Every piece of content published on streamb4.com follows this process:

1. **Research** — We identify questions real customers ask (via support tickets, FAQ submissions, and community forums) and research the topic using official manufacturer documentation, device specs, and firsthand testing.

2. **Writing** — Articles are written to answer the reader's specific question directly. We lead with the answer, then provide supporting detail. We avoid filler content and do not pad articles with repetitive phrasing.

3. **Technical review** — Setup guides and troubleshooting articles are tested step-by-step on physical hardware before publication. Screenshots and described steps are verified to match current device firmware and app versions.

4. **Fact-checking** — All statistics cited (channel counts, speeds, pricing) must match official STREAMB4 documentation or verifiable third-party sources. We do not publish estimated or aspirational numbers as facts.

5. **Editorial review** — A second team member reviews every article for accuracy, clarity, and adherence to this policy before it is published.`,
  },
  {
    title: "How We Update Content",
    body: `IPTV is a fast-moving field. App interfaces change, device firmware updates alter settings paths, and channel lineups evolve. Our update policy:

- **Regular review cycle** — All guides are reviewed at minimum every six months.
- **Event-triggered updates** — If a major player app (TiviMate, IPTV Smarters, XCIPTV) releases a significant update that changes setup steps, we update affected guides within 30 days.
- **Pricing and product accuracy** — Pricing information is reviewed monthly against our live pricing page. Outdated prices are corrected immediately.
- **Reader corrections** — If a reader identifies a factual error via our contact page, we investigate within 5 business days and correct if the error is confirmed.

The "Last Updated" date shown on every article reflects the most recent substantive content change — not minor formatting edits.`,
  },
  {
    title: "What We Do Not Do",
    body: `To maintain the trust of our readers, we commit to the following:

- **No fabricated testing results** — We do not invent benchmark scores, speed test results, or device comparison outcomes. If we have not tested something directly, we say so.
- **No fake reviews or testimonials** — All customer feedback referenced in our content is genuine. We do not create or purchase fake reviews.
- **No undisclosed sponsorships** — Any commercially sponsored content is clearly labelled. STREAMB4 blog articles about our own products are always written from the perspective of our actual service capabilities.
- **No misleading comparisons** — When we compare STREAMB4 to competitors or cable TV, we use publicly verifiable information and do not misrepresent competitors' offerings.
- **No keyword stuffing** — Articles are written for readers, not for search engine manipulation. We do not repeat phrases unnaturally or include content that serves no informational purpose.`,
  },
  {
    title: "Sources and References",
    body: `When our content references external information, we prefer:

- Official manufacturer documentation (Amazon, Google, Apple, Samsung, LG developer portals)
- Government and regulatory sources (FCC, Ofcom) for legal and compliance topics
- Recognised technical standards bodies (IETF, ITU) for streaming protocol information
- IPTV player app official documentation (TiviMate, IPTV Smarters official sites)

We link to primary sources wherever possible. When a source requires account access or is behind a paywall, we describe our process of accessing and verifying the information.`,
  },
  {
    title: "Corrections and Contact",
    body: `We take accuracy seriously. If you believe an article contains an error:

1. Use our [Contact page](/contact) to submit a correction request.
2. Include the article URL, the specific claim you believe is incorrect, and the source or evidence supporting your correction.
3. We will investigate and respond within 5 business days.
4. Confirmed corrections are applied to the article and the "Last Updated" date is refreshed.

For general enquiries about our editorial standards or content, email our team at support@streamb4.com.`,
  },
];

export default function EditorialPolicyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />

      <main className="min-h-screen bg-[#050505] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-400" aria-current="page">Editorial Policy</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-12 border-b border-white/[0.06] pb-10">
            <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-3">
              Content Standards
            </p>
            <h1
              className="font-black text-3xl sm:text-4xl text-white uppercase mb-4"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
            >
              Editorial Policy
            </h1>
            <p className="text-gray-400 leading-relaxed text-base">
              This page explains how STREAMB4 creates, verifies, and maintains the articles, guides, and tutorials published on streamb4.com. Our goal is to publish content that is accurate, helpful, and written by people with genuine expertise in IPTV and streaming technology.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-xs text-gray-600 font-semibold">
              <span>Published by: STREAMB4 Editorial Team</span>
              <span>·</span>
              <span>Last reviewed: January 2026</span>
              <span>·</span>
              <Link href="/contact" className="text-orange-500/70 hover:text-orange-400 transition-colors">
                Submit a correction →
              </Link>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-black text-white uppercase mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-400 text-sm leading-relaxed space-y-4">
                  {section.body.split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{
                      __html: para
                        .replace(/\*\*(.+?)\*\*/g, "<strong class=\"text-gray-300\">$1</strong>")
                        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-orange-500/80 hover:text-orange-400 transition-colors">$1</a>')
                        .replace(/\n/g, "<br/>")
                    }} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer nav */}
          <div className="mt-16 pt-10 border-t border-white/[0.06] flex flex-wrap gap-6 text-xs text-gray-600 font-semibold">
            <Link href="/about" className="hover:text-white transition-colors">About STREAMB4</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/blog" className="hover:text-white transition-colors">All Articles</Link>
          </div>

        </div>
      </main>
    </>
  );
}
