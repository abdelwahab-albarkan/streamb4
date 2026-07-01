"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

/* ============================================
   BOTTOM FEATURES STRIP CUSTOM ICONS (SVG)
   ============================================ */

import {
  FeatureLightning,
  FeatureShield,
  FeatureDevices,
  FeatureSupport,
  FeatureFile,
  FeatureDiamond
} from "@/components/ui/icons";

const devices = [
  {
    name: "Fire TV Stick",
    desc: "Plug in and stream in seconds.",
    type: "firestick",
    image: "/devices/10.png",
    blendMode: "multiply" as const,
  },
  {
    name: "Android TV",
    desc: "Built for Android TV devices.",
    type: "android-tv",
    image: "/devices/5.png",
    blendMode: "multiply" as const,
  },
  {
    name: "Smart TV",
    desc: "Samsung, LG, Sony & more.",
    type: "smart-tv",
    image: "/devices/1.png",
    blendMode: "multiply" as const,
  },
  {
    name: "Apple TV",
    desc: "Smooth performance on Apple TV.",
    type: "apple-tv",
    image: "/devices/7.png",
    blendMode: "multiply" as const,
  },
  {
    name: "MAG Box",
    desc: "MAG devices fully supported.",
    type: "mag-box",
    image: "/devices/4.png",
    blendMode: "multiply" as const,
  },
  {
    name: "Windows",
    desc: "Windows PC & laptops supported.",
    type: "windows",
    image: "/devices/9.png",
    blendMode: "normal" as const,
  },
  {
    name: "MacOS",
    desc: "Stream on Mac with top quality.",
    type: "macos",
    image: "/devices/2.png",
    blendMode: "multiply" as const,
  },
  {
    name: "Linux",
    desc: "Works perfectly on all Linux distros.",
    type: "linux",
    image: "/devices/6.png",
    blendMode: "multiply" as const,
  },
  {
    name: "iPhone",
    desc: "iOS app for iPhone & iPad.",
    type: "iphone",
    image: "/devices/88.png",
    blendMode: "normal" as const,
  },
  {
    name: "Android",
    desc: "Android phones & tablets.",
    type: "android",
    image: "/devices/3.png",
    blendMode: "multiply" as const,
  },
];

interface DeviceCardProps {
  device: typeof devices[0];
}

function DeviceCard({ device }: DeviceCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
      className="relative group overflow-hidden flex flex-col items-center p-5 pb-6 rounded-[20px] cursor-pointer"
      style={{
        background: "rgba(15,15,15,0.6)",
        border: "1px solid rgba(255,138,0,0.15)",
      }}
      whileHover={{
        y: -6,
        scale: 1.03,
        border: "1px solid rgba(255,138,0,0.45)",
        boxShadow: "0 0 40px rgba(255,138,0,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Checkmark badge */}
      <div
        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center select-none z-20"
        style={{
          background: "linear-gradient(135deg, #ff8a00, #ffb347)",
          boxShadow: "0 0 10px rgba(255,138,0,0.4)",
        }}
      >
        <svg
          className="w-3 h-3 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Bottom ambient inside card */}
      <div
        className="absolute inset-0 rounded-[20px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "radial-gradient(ellipse at bottom, rgba(255,138,0,0.08), transparent 70%)",
        }}
      />

      {/* Image + bottom light */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center mb-5 pt-4">
          {/* === BOTTOM ORANGE LIGHT === */}
          {/* This is the key premium effect */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              background: "radial-gradient(ellipse, #ff8a00, #ffb347)",
              opacity: hovered ? 1 : 0.7,
              width: hovered ? "7rem" : "6rem",
              height: "12px",
              filter: hovered ? "blur(6px)" : "blur(8px)",
              transition: "all 0.3s ease",
            }}
          />

          {/* Wider soft glow spread */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-6 rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(255,138,0,0.4), transparent)",
              filter: "blur(15px)",
            }}
          />

          {/* Floor reflection line */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #ff8a00, transparent)",
              opacity: 0.9,
            }}
          />

          {/* === DEVICE IMAGE === */}
          <motion.div
            whileHover={{
              y: -4,
              filter: "drop-shadow(0 0 12px rgba(255,138,0,0.4))",
              transition: { duration: 0.3 },
            }}
            className="relative z-10"
          >
            <Image
              src={device.image}
              alt={`Watch STREAMB4 on ${device.name}`}
              width={120}
              height={100}
              className="object-contain w-[120px] h-[100px]"
              style={{
                mixBlendMode: device.blendMode,
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))",
              }}
            />
          </motion.div>

          {/* === AMBIENT GLOW BEHIND IMAGE === */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div
              className="w-24 h-24 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, #ff8a00, transparent)",
                filter: "blur(20px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Name + desc */}
      <h3 className="text-white font-black text-base text-center mb-2 leading-tight group-hover:text-orange-100 transition-colors duration-200 z-10">
        {device.name}
      </h3>
      <p className="text-[#bdbdbd] text-xs text-center leading-relaxed z-10">
        {device.desc}
      </p>
    </motion.div>
  );
}

export function DevicesSection() {
  return (
    <section className="relative py-24 bg-[#0a0a0a] overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-[0.06]"
          style={{
            background: "radial-gradient(ellipse, #ff8a00, transparent)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-6"
        >
          COMPATIBILITY
        </motion.p>

        {/* Big headline — white + orange gradient */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center font-anton uppercase leading-tight mb-6"
          style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", fontFamily: "var(--font-anton), Anton, sans-serif" }}
        >
          <span className="text-white">WATCH ON EVERY </span>
          <span
            style={{
              background: "linear-gradient(90deg, #ff8a00, #ffb347)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SCREEN YOU OWN.
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-16"
        >
          <p className="text-gray-400 text-lg mb-1">
            Enjoy seamless streaming on all your favorite devices.
          </p>
          <p className="text-gray-400 text-lg">
            One subscription.{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #ff8a00, #ffb347)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
              }}
            >
              Unlimited entertainment.
            </span>
          </p>
        </motion.div>

        {/* Device Cards Grid */}
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        >
          {devices.map((device) => (
            <DeviceCard key={device.name} device={device} />
          ))}
        </motion.div>

        {/* Bottom Features Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-[20px] px-8 py-5"
          style={{
            background: "rgba(15,15,15,0.8)",
            border: "1px solid rgba(255,138,0,0.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-orange-500/10">
            {[
              {
                icon: <FeatureLightning />,
                title: "Instant Activation",
                sub: "Get started in seconds",
              },
              {
                icon: <FeatureShield />,
                title: "99.99% Uptime",
                sub: "Reliable & stable servers",
              },
              {
                icon: <FeatureDevices />,
                title: "Works On All Devices",
                sub: "TV, Mobile, PC & more",
              },
              {
                icon: <FeatureSupport />,
                title: "24/7 Customer Support",
                sub: "We're here anytime",
              },
              {
                icon: <FeatureFile />,
                title: "No Contracts",
                sub: "Cancel anytime",
              },
              {
                icon: <FeatureDiamond />,
                title: "Premium Streaming",
                sub: "4K · HDR · No Buffering",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center gap-3 px-3 py-3 lg:py-0 lg:px-6"
              >
                {feature.icon}
                <div>
                  <p className="text-white font-bold text-sm leading-none mb-1 group-hover:text-orange-100 transition-colors duration-200">
                    {feature.title}
                  </p>
                  <p className="text-[#bdbdbd] text-xs">{feature.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
