import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DEVICE_CONFIGS } from "@/lib/deviceConfigs";

function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export async function generateStaticParams() {
  return Object.keys(DEVICE_CONFIGS).map((device) => ({ device }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ device: string }> }
): Promise<Metadata> {
  const { device } = await params;
  const slug = device.toLowerCase();
  const config = DEVICE_CONFIGS[slug];

  if (!config) {
    return { robots: { index: false, follow: false } };
  }

  return {
    title: { absolute: config.title },
    description: config.metaDescription,
    alternates: {
      canonical: `https://streamb4.com/iptv/${slug}`,
    },
    openGraph: {
      title: config.title,
      description: config.metaDescription,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `STREAMB4 IPTV on ${config.name}` }],
      url: `https://streamb4.com/iptv/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.metaDescription,
    },
  };
}

export default async function DevicePage(
  { params }: { params: Promise<{ device: string }> }
) {
  const { device } = await params;
  const slug = device.toLowerCase();
  const config = DEVICE_CONFIGS[slug];

  if (!config) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://streamb4.com" },
      { "@type": "ListItem", "position": 2, "name": "IPTV Devices", "item": "https://streamb4.com/iptv" },
      { "@type": "ListItem", "position": 3, "name": config.name, "item": `https://streamb4.com/iptv/${slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Set Up STREAMB4 IPTV on ${config.name}`,
    "description": config.installSummary,
    "tool": config.compatibleApps.filter((a) => a.recommended).map((a) => ({
      "@type": "HowToTool",
      "name": a.name,
    })),
  };

  const otherDevices = Object.entries(DEVICE_CONFIGS)
    .filter(([s]) => s !== slug)
    .slice(0, 4);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(howToSchema) }} />

      <main id="main-content">
        {/* Hero */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF6B00]/5 rounded-full blur-[150px]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <nav aria-label="Breadcrumb" className="flex justify-center mb-8">
              <ol className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/iptv" className="hover:text-white transition-colors">IPTV Devices</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-400" aria-current="page">{config.shortName}</li>
              </ol>
            </nav>

            <span className="text-5xl mb-4 block" role="img" aria-label={config.name}>{config.icon}</span>
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
              {config.os}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
              {config.h1}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              {config.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-xl font-black text-black text-sm uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
              >
                Get STREAMB4 Now
              </Link>
              <Link
                href="/install"
                className="px-8 py-4 rounded-xl font-black text-white text-sm uppercase tracking-wider border border-[#FF6B00]/30 hover:border-[#FF6B00] transition-colors"
              >
                Full Install Guide
              </Link>
            </div>
          </div>
        </section>

        {/* Why good for IPTV */}
        <section className="py-16 bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-6">
              Why {config.shortName} Works Well for IPTV
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg">{config.whyGoodForIPTV}</p>

            {/* Key features */}
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-[#FF6B00] mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-12 bg-[#0d0700] border-y border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-black text-white mb-6">Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                <div className="text-xs text-[#FF6B00] uppercase tracking-wider font-bold mb-1">Internet Speed</div>
                <div className="text-white font-semibold text-sm">{config.requirements.internetSpeed}</div>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                <div className="text-xs text-[#FF6B00] uppercase tracking-wider font-bold mb-1">Resolution</div>
                <div className="text-white font-semibold text-sm">{config.requirements.resolution}</div>
              </div>
              {config.requirements.notes && (
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="text-xs text-[#FF6B00] uppercase tracking-wider font-bold mb-1">Pro Tip</div>
                  <div className="text-gray-300 text-sm">{config.requirements.notes}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Compatible Apps */}
        <section className="py-16 bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              Best IPTV Apps for {config.shortName}
            </h2>
            <p className="text-gray-400 mb-8">
              All of these apps are compatible with STREAMB4&apos;s M3U and Xtream Codes credentials.
            </p>
            <div className="space-y-4">
              {config.compatibleApps.map((app) => (
                <div
                  key={app.name}
                  className={`rounded-2xl border p-5 ${
                    app.recommended
                      ? "border-[#FF6B00]/30 bg-[#FF6B00]/5"
                      : "border-white/[0.08] bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-white">{app.name}</span>
                        {app.recommended && (
                          <span className="text-xs font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Recommended
                          </span>
                        )}
                      </div>
                      {app.note && (
                        <p className="text-sm text-gray-400 mt-1">{app.note}</p>
                      )}
                    </div>
                    {app.downloaderCode && (
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Downloader Code</div>
                        <div className="text-2xl font-black text-[#FF6B00] font-mono tracking-widest">
                          {app.downloaderCode}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Setup summary */}
        <section className="py-16 bg-[#0d0700]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-6">
              How to Set Up IPTV on {config.shortName}
            </h2>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <p className="text-gray-300 leading-relaxed mb-6">{config.installSummary}</p>
              <Link
                href="/install"
                className="inline-block text-sm font-bold text-[#FF6B00] hover:underline"
              >
                Full step-by-step installation guide →
              </Link>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="py-16 bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-8">
              Troubleshooting IPTV on {config.shortName}
            </h2>
            <ul className="space-y-4">
              {config.troubleshootingTips.map((tip) => {
                const [problem, ...rest] = tip.split(" — ");
                return (
                  <li key={tip} className="flex gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <span className="text-[#FF6B00] font-black flex-shrink-0 mt-0.5" aria-hidden="true">!</span>
                    <div className="text-sm text-gray-300">
                      {rest.length > 0 ? (
                        <>
                          <span className="font-semibold text-white">{problem} — </span>
                          {rest.join(" — ")}
                        </>
                      ) : (
                        tip
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-[#0d0700]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-8">
              Frequently Asked Questions — IPTV on {config.shortName}
            </h2>
            <div className="space-y-4">
              {config.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none hover:bg-white/[0.03] transition-colors">
                    <span className="font-semibold text-white text-sm md:text-base">{faq.q}</span>
                    <span className="text-[#FF6B00] flex-shrink-0 text-xl group-open:rotate-45 transition-transform duration-200" aria-hidden="true">+</span>
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Other Devices */}
        <section className="py-16 bg-[#0A0A0A] border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-black text-white mb-6">IPTV on Other Devices</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {otherDevices.map(([otherSlug, otherDevice]) => (
                <Link
                  key={otherSlug}
                  href={`/iptv/${otherSlug}`}
                  className="group rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center hover:border-[#FF6B00]/40 hover:bg-white/[0.06] transition-all"
                >
                  <span className="text-2xl block mb-2" role="img" aria-label={otherDevice.name}>{otherDevice.icon}</span>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-semibold">
                    {otherDevice.shortName}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/iptv" className="text-sm text-[#FF6B00] hover:underline font-semibold">
                View all compatible devices →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#0d0700]">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Stream on {config.shortName}?
            </h2>
            <p className="text-gray-400 mb-8">
              Get instant access to 50,000+ live channels and 180,000+ movies. Plans from $39.99 for 3 months.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-10 py-5 rounded-xl font-black text-black text-sm uppercase tracking-wider"
              style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
            >
              Get STREAMB4 Now
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
