"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AccordionItem } from "@/components/ui/Accordion";
import Link from "next/link";
import { CATEGORIZED_FAQS } from "./faqData";

export { CATEGORIZED_FAQS } from "./faqData";

export default function FaqClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = CATEGORIZED_FAQS.map(group => {
    const items = group.items.filter(
      item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...group, items };
  }).filter(group => group.items.length > 0);

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex justify-center mb-8">
            <ol className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-400" aria-current="page">FAQ</li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
              KNOWLEDGE BASE
            </p>
            <h1 className="font-black text-white mb-4" style={{ fontSize: "clamp(1.75rem, 6vw, 4rem)" }}>
              FREQUENTLY ASKED <span className="text-[#FF6B00]">QUESTIONS</span>
            </h1>
            <p className="text-gray-400 text-base mb-8 leading-relaxed">
              Everything you need to know about STREAMB4 IPTV — setup, billing, devices, and streaming quality.
            </p>

            {/* Search */}
            <div className="relative mt-4">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-500" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search questions, devices, setup guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search FAQ"
                className="w-full bg-[#141414] border border-[#2a2a2a] hover:border-[#FF6B00]/30 focus:border-[#FF6B00] rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <AnimatedSection className="py-20 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No results found for &ldquo;{searchQuery}&rdquo;. Try a different search term.
            </div>
          ) : (
            <div className="space-y-12">
              {filteredGroups.map((group, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-xl font-bold text-white border-l-2 border-[#FF6B00] pl-3 uppercase tracking-wider">
                    {group.category}
                  </h2>
                  <div className="space-y-3">
                    {group.items.map((item, itemIdx) => (
                      <AccordionItem
                        key={itemIdx}
                        question={item.question}
                        answer={item.answer}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 p-8 rounded-[24px] text-center" style={{ background: "rgba(255,107,0,0.05)", border: "1px solid rgba(255,107,0,0.15)" }}>
            <h2 className="text-xl font-black text-white mb-2">Still have questions?</h2>
            <p className="text-gray-400 text-sm mb-6">Our support team is online 24/7 and ready to help you within minutes.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/free-trial"
                className="px-6 py-3 rounded-xl font-black text-black text-sm uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #ff7a00, #ffb300)" }}
              >
                Start Free Trial
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl font-black text-white text-sm uppercase tracking-wider border border-[#FF6B00]/30 hover:border-[#FF6B00] transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
