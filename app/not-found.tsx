import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found (404) | STREAMB4" },
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <span className="text-orange-500 text-xs font-black tracking-[0.25em] uppercase">
          Error 404
        </span>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Page Not Found
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          The page or article you are looking for does not exist, has been moved, or is no longer available.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="px-7 py-3.5 rounded-full font-bold text-black text-sm uppercase transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #ff8a00, #ffb347)" }}
          >
            Go to Homepage
          </Link>
          <Link
            href="/blog"
            className="px-7 py-3.5 rounded-full font-bold text-white text-sm uppercase border border-white/20 transition-all duration-300 hover:bg-white/10"
          >
            Browse Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
