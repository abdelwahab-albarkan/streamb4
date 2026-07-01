"use client";

import React from "react";
import { Check, Shield, DollarSign, Users, Award, TrendingUp, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { openTawkChat } from "@/lib/hooks/useTawk";

const RESELLER_PACKAGES = [
  {
    credits: 10,
    price: 300,
    creditCost: 30,
    avgSellingPrice: 100,
    profit: 700,
    popular: false,
  },
  {
    credits: 50,
    price: 1100,
    creditCost: 22,
    avgSellingPrice: 100,
    profit: 3900,
    popular: true,
  },
  {
    credits: 100,
    price: 1800,
    creditCost: 18,
    avgSellingPrice: 100,
    profit: 8200,
    popular: false,
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Buy Reseller Package",
    description: "Purchase one of our credit packages to activate your account. 1 credit represents a 1-year subscription.",
  },
  {
    step: "02",
    title: "Access Dashboard",
    description: "Access your easy-to-use, white-label reseller panel where you can manage all users and free trials.",
  },
  {
    step: "03",
    title: "Generate Subscriptions",
    description: "Create customer subscriptions, customize playlists, activate trial lines, and manage expiration dates.",
  },
  {
    step: "04",
    title: "Grow Your Brand",
    description: "Collect payments directly from your clients using your own brand name and keep 100% of the profits.",
  },
];

const RESELLER_FAQS = [
  {
    question: "What is the IPTV Reseller program?",
    answer: "Our reseller program lets you sell our premium Streaming subscriptions to your customers. You will receive a specialized control panel where you can generate new accounts, manage existing users, and issue free trial codes. You buy credits from us and sell subscriptions at your own pricing.",
  },
  {
    question: "How do credit points work?",
    answer: "Reselling is based on credit points. 1 Credit corresponds to 1 Subscription year (12 months). You can also use credits for shorter subscriptions: 0.1 credits for 1 month, 0.25 credits for 3 months, or 0.5 credits for 6 months.",
  },
  {
    question: "Do credit points expire?",
    answer: "No, your reseller credits never expire. You can keep them in your dashboard until you sell them to customers.",
  },
  {
    question: "Can I use my own brand and logo?",
    answer: "Yes, this program is 100% white label. Your customers will connect to servers without our brand name showing, allowing you to establish your own independent IPTV business.",
  },
];

export default function ResellerClient() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF6B00]/5 rounded-full blur-[150px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest mb-4">
              PARTNER PROGRAM
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
              BUILD A PROFITABLE <br />
              <span className="text-[#FF6B00]">IPTV BUSINESS</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Earn up to 300% margins reselling the highest quality IPTV service. Get a white-label dashboard, 24/7 dedicated support, and complete flexibility.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 bg-[#0d0d0d] relative border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RESELLER_PACKAGES.map((pkg, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div
                  className={`p-8 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${
                    pkg.popular
                      ? "border-[#FF6B00] bg-[#1A1A1A] scale-102"
                      : "border-[#2a2a2a] bg-[#141414]"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-black font-extrabold text-xs px-3 py-1 rounded-full">
                      POPULAR CHOICE
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      {pkg.credits} Credits Package
                    </h3>
                    <div className="flex items-baseline gap-1 my-4">
                      <span className="text-4xl font-extrabold text-white">${pkg.price}</span>
                      <span className="text-gray-400 text-sm">one-time payment</span>
                    </div>
                    <ul className="space-y-3.5 my-6">
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-[#FF6B00]" />
                        <span>${pkg.creditCost} per Credit Point</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-[#FF6B00]" />
                        <span>Average profit margin: 300%</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-[#FF6B00]" />
                        <span>No credit expiration</span>
                      </li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => openTawkChat('Hi! I am interested in the reseller program 🤝')}
                    className="w-full mt-4"
                    variant={pkg.popular ? "primary" : "outline"}
                  >
                    Buy Package
                  </Button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            How does it work?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="p-6 rounded-xl bg-[#141414] border border-[#2a2a2a] relative">
                  <div className="text-4xl font-black text-[#FF6B00]/20 absolute top-4 right-4 select-none">
                    {step.step}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-3 mt-4">{step.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#0d0d0d] border-t border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Reseller FAQ
          </h2>
          <div className="space-y-4">
            {RESELLER_FAQS.map((faq, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.05}>
                <div className="p-6 rounded-xl bg-[#141414] border border-[#2a2a2a]">
                  <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#FF6B00] shrink-0" />
                    {faq.question}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed pl-7">{faq.answer}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
