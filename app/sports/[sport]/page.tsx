import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SPORT_CONFIGS } from "@/lib/sportConfigs";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export async function generateStaticParams() {
  return Object.keys(SPORT_CONFIGS).map((sport) => ({ sport }));
}

export async function generateMetadata(props: { params: Promise<{ sport: string }> }): Promise<Metadata> {
  const { sport } = await props.params;
  const config = SPORT_CONFIGS[sport];
  if (!config) return {};
  return {
    title: { absolute: config.title },
    description: config.metaDescription,
    alternates: { canonical: `https://streamb4.com/sports/${sport}` },
    openGraph: {
      title: config.title,
      description: config.metaDescription,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: config.title }],
      url: `https://streamb4.com/sports/${sport}`,
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.metaDescription,
    },
  };
}

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

function FAQAccordion({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <details key={i} className="group border border-[#2a2a2a] rounded-xl overflow-hidden">
          <summary className="flex items-center justify-between p-5 bg-[#141414] hover:bg-[#1a1a1a] cursor-pointer list-none transition-colors">
            <span className="text-white font-semibold pr-4 text-sm">{faq.q}</span>
            <ChevronDown className="w-4 h-4 text-[#FF6B00] flex-shrink-0 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="px-5 pb-5 pt-3 bg-[#141414] text-gray-400 text-sm leading-relaxed border-t border-[#2a2a2a]">
            {faq.a}
          </div>
        </details>
      ))}
    </div>
  );
}

export default async function SportPage(props: { params: Promise<{ sport: string }> }) {
  const { sport } = await props.params;
  const config = SPORT_CONFIGS[sport];
  if (!config) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
      { "@type": "ListItem", "position": 2, "name": "Sports", "item": "https://streamb4.com/sports" },
      { "@type": "ListItem", "position": 3, "name": config.shortName, "item": `https://streamb4.com/sports/${sport}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <main id="main-content">

        {/* HERO */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-[#050505]">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,122,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,0,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(255,122,0,0.08), transparent 70%)", filter: "blur(80px)" }} />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#FF6B00] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/sports" className="hover:text-[#FF6B00] transition-colors">Sports</Link>
              <span>/</span>
              <span className="text-gray-300">{config.shortName}</span>
            </nav>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">{config.emoji}</span>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
                {config.channels} channels · {config.season}
              </div>
            </div>

            <h1
              className="font-black text-white uppercase leading-[0.92] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2.2rem, 7vw, 4.5rem)" }}
            >
              {config.h1}
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
              {config.intro}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-trial">
                <Button variant="primary" className="px-8 py-4 font-black text-base uppercase tracking-wide">
                  ⚡ Try Free 24 Hours
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="px-8 py-4 font-bold text-base uppercase tracking-wide">
                  View Pricing →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* BROADCASTERS */}
        <AnimatedSection className="border-y border-[#1A1A1A] bg-[#0d0d0d] py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <span className="text-gray-500 text-sm mr-2">Channels included:</span>
              {config.broadcaster.map((b) => (
                <span key={b} className="px-3 py-1.5 rounded-lg bg-[#141414] border border-[#2a2a2a] text-gray-300 text-sm font-semibold">
                  {b}
                </span>
              ))}
              <span className="text-[#FF6B00] text-sm font-semibold">+ {config.channels} total feeds</span>
            </div>
          </div>
        </AnimatedSection>

        {/* WHY STREAMB4 */}
        <AnimatedSection className="py-24 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Why STREAMB4</p>
                <h2
                  className="font-black text-white uppercase leading-[0.92] tracking-tight mb-6"
                  style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                >
                  THE BEST WAY TO WATCH{" "}
                  <span style={{ background: "linear-gradient(90deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {config.shortName}
                  </span>
                </h2>
                <ul className="space-y-3">
                  {config.whyStreamB4.map((point) => (
                    <li key={point} className="border-l-2 border-[#FF6B00]/40 pl-5 text-gray-300 text-sm leading-relaxed py-0.5">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                {/* Key Events */}
                <div className="p-6 rounded-2xl" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                  <p className="text-[#FF6B00] font-bold text-xs uppercase tracking-widest mb-4">Key Events Covered</p>
                  <div className="space-y-2">
                    {config.keyEvents.map((ev) => (
                      <div key={ev} className="text-sm text-gray-300 border-l-2 border-[#FF6B00]/30 pl-3 py-0.5">
                        {ev}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Quick Pricing */}
                <div className="p-6 rounded-2xl" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                  <p className="text-gray-400 text-sm mb-1">Plans from</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-black text-white">$9</span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-4">All sports included · No add-ons · Instant activation</p>
                  <Link href="/pricing">
                    <Button variant="primary" className="w-full font-black uppercase tracking-wide text-sm">
                      View All Plans
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* SETUP */}
        <AnimatedSection className="py-20 bg-[#0d0d0d] border-y border-[#1A1A1A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Quick Setup</p>
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight mb-8"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}
            >
              READY IN UNDER 5 MINUTES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { num: "01", title: "Get a Plan", desc: "Choose any STREAMB4 plan — all include sports." },
                { num: "02", title: "Install the App", desc: "IPTV Smarters or TiviMate on your device." },
                { num: "03", title: "Start Watching", desc: "Enter your credentials and tune to the sport." },
              ].map((step) => (
                <div key={step.num} className="p-6 rounded-2xl" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(5,5,5,0.97) 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                  <span
                    className="text-4xl font-black block mb-3"
                    style={{ fontFamily: "var(--font-anton), Anton, sans-serif", background: "linear-gradient(135deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    {step.num}
                  </span>
                  <h3 className="text-white font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/install">
                <Button variant="outline" className="font-bold uppercase tracking-wide">
                  Full Installation Guide →
                </Button>
              </Link>
              <Link href="/iptv">
                <Button variant="outline" className="font-bold uppercase tracking-wide">
                  Compatible Devices →
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection className="py-24 bg-[#0A0A0A]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-3">Questions Answered</p>
              <h2
                className="font-black text-white uppercase leading-[0.92] tracking-tight"
                style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
              >
                {config.shortName} STREAMING FAQ
              </h2>
            </div>
            <FAQAccordion faqs={config.faqs} />
          </div>
        </AnimatedSection>

        {/* RELATED */}
        <AnimatedSection className="py-16 bg-[#0d0d0d] border-y border-[#1A1A1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {config.relatedCountries.length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-4">Country Packages</p>
                  <div className="flex flex-wrap gap-2">
                    {config.relatedCountries.map((c) => (
                      <Link key={c} href={`/${c}`} className="px-4 py-2 rounded-xl bg-[#141414] border border-[#2a2a2a] text-gray-300 text-sm hover:border-[#FF6B00]/40 hover:text-[#FF6B00] transition-all">
                        {c.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} →
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {config.relatedSports.length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-4">Related Sports</p>
                  <div className="flex flex-wrap gap-2">
                    {config.relatedSports.map((s) => (
                      <Link key={s} href={`/sports/${s}`} className="px-4 py-2 rounded-xl bg-[#141414] border border-[#2a2a2a] text-gray-300 text-sm hover:border-[#FF6B00]/40 hover:text-[#FF6B00] transition-all">
                        {s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} →
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <section className="relative py-24 overflow-hidden bg-[#050505]">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg,rgba(255,122,0,0.06) 0%,rgba(5,5,5,1) 50%,rgba(255,179,0,0.04) 100%)" }} />
          <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
            <h2
              className="font-black text-white uppercase leading-[0.92] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              WATCH {config.shortName}{" "}
              <span style={{ background: "linear-gradient(90deg,#ff7a00,#ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                TONIGHT
              </span>
            </h2>
            <p className="text-gray-400 mb-8">Try STREAMB4 free for 24 hours — no credit card, full access.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/free-trial">
                <Button variant="primary" className="px-10 py-5 font-black text-base uppercase tracking-wide">
                  ⚡ Get Free Trial Now
                </Button>
              </Link>
              <Link href="/sports">
                <Button variant="outline" className="px-8 py-5 font-bold text-base uppercase tracking-wide">
                  All Sports →
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
