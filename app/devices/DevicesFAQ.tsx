"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What is an IPTV Downloader code?",
    a: "A Downloader code is a 6-digit shortcode used inside the AFTVnews Downloader app. Instead of typing a long URL with your TV remote, you enter this short code and the app automatically fetches and installs the IPTV player APK for you.",
  },
  {
    q: "Which IPTV player app is the best for Firestick in 2026?",
    a: "IPTV Smarters Pro v5 is our top recommendation for Amazon Firestick. It supports Xtream Codes, M3U playlists, and EPG (TV guide). The Downloader code is 6468112.",
  },
  {
    q: "How do I fix 'Downloader App Installation Blocked' on Firestick?",
    a: "Go to Settings → My Fire TV → Developer Options and enable 'Apps from Unknown Sources' and 'ADB Debugging'. Then try installing again through the Downloader app.",
  },
  {
    q: "Is IBO Player free to use?",
    a: "Yes, IBO Player and IBO Player Pro are free to download and use. You only need your STREAMB4 subscription credentials (server URL, username, password or MAC address) to start streaming.",
  },
  {
    q: "What is a Mac Address and Device Key for IBO Player?",
    a: "When you open IBO Player on a Samsung or LG Smart TV, it shows a unique MAC address. You send this address to STREAMB4 support, and we activate your subscription to that specific TV — no username/password needed.",
  },
];

export default function DevicesFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mb-16">
      <div className="text-center mb-10">
        <span className="text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block select-none">
          FAQ
        </span>
        <h2 className="font-anton text-4xl text-white uppercase mb-3">
          Setup &amp; Installation FAQ
        </h2>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          Common questions about sideloading, shortcodes, and IPTV player configurations.
        </p>
      </div>
      <div
        className="rounded-[20px] p-6 md:p-8"
        style={{
          background: "rgba(15, 15, 15, 0.4)",
          border: "1px solid rgba(255, 138, 0, 0.1)",
        }}
      >
        <div className="divide-y divide-white/[0.05]">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-white/[0.05]">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
                >
                  <span
                    className={`font-semibold text-sm md:text-base transition-colors duration-200 ${
                      isOpen ? "text-[#ff7a00]" : "text-white group-hover:text-orange-200"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-200"
                    style={
                      isOpen
                        ? {
                            background: "rgba(255,122,0,0.15)",
                            borderColor: "rgba(255,122,0,0.4)",
                            boxShadow: "0 0 15px rgba(255,122,0,0.2)",
                            transform: "rotate(45deg)",
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            borderColor: "rgba(255,255,255,0.08)",
                            transform: "rotate(0deg)",
                          }
                    }
                  >
                    <svg
                      className="w-3.5 h-3.5 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.25s ease-in-out",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="text-gray-400 text-sm leading-relaxed pb-5 pr-4">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
