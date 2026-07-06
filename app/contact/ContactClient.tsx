"use client";

import React, { useState } from "react";
import { Mail, MessageCircle, Clock, Send, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";

// ── Inline toast (self-contained, no provider needed on public pages) ─────────
type ToastState = { message: string; type: "success" | "error" } | null;

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <AnimatePresence>
      <motion.div
        key={toast.message + toast.type}
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl min-w-[280px] max-w-sm"
        style={{
          background: isSuccess ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${isSuccess ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}
      >
        <span className={`text-lg font-bold ${isSuccess ? "text-green-400" : "text-red-400"}`}>
          {isSuccess ? "✓" : "✗"}
        </span>
        <p className="text-white text-sm font-semibold flex-1">{toast.message}</p>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors ml-2"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Form field types ───────────────────────────────────────────────────────────
interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const emptyForm: FormFields = { name: "", email: "", subject: "", message: "" };

export default function ContactClient() {
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<FormFields>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { name, email, subject, message } = form;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setForm(emptyForm);
        showToast("Your message has been sent successfully.", "success");
      } else {
        showToast(data.message ?? "Something went wrong. Please try again.", "error");
      }
    } catch {
      showToast("Network error. Please check your connection and try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main-content">
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0d0700] to-[#0A0A0A]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-400" aria-current="page">Contact</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Info Section */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-[#FF6B00] font-bold text-sm uppercase tracking-widest">
                GET IN TOUCH
              </p>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                WE ARE HERE TO <span className="text-[#FF6B00]">SUPPORT YOU</span>
              </h1>
              <p className="text-gray-400 text-base leading-relaxed">
                Have pre-sales questions, technical issues, or reseller enquiries? Message our team or use live chat for rapid resolution.
              </p>

              <div className="space-y-4 pt-6">
                <div className="flex gap-4 p-4 bg-[#141414] border border-[#2a2a2a] rounded-xl">
                  <Mail className="w-6 h-6 text-[#FF6B00] shrink-0" aria-hidden="true" />
                  <div>
                    <h2 className="text-white font-bold text-sm">Direct Support Email</h2>
                    <a href="mailto:support@streamb4.com" className="text-[#FF6B00] text-sm font-semibold hover:underline">
                      support@streamb4.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-[#141414] border border-[#2a2a2a] rounded-xl">
                  <Clock className="w-6 h-6 text-[#FF6B00] shrink-0" aria-hidden="true" />
                  <div>
                    <h2 className="text-white font-bold text-sm">Response Times</h2>
                    <p className="text-gray-400 text-sm">Average resolution within 10 minutes — 24/7</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-[#141414] border border-[#2a2a2a] rounded-xl">
                  <MessageCircle className="w-6 h-6 text-[#FF6B00] shrink-0" aria-hidden="true" />
                  <div>
                    <h2 className="text-white font-bold text-sm">Live Chat Support</h2>
                    <p className="text-gray-400 text-sm">Available 24 hours a day, 7 days a week</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 text-sm">
                <Link href="/faq" className="text-gray-400 hover:text-orange-400 transition-colors underline underline-offset-2">Browse FAQ →</Link>
                <Link href="/install" className="text-gray-400 hover:text-orange-400 transition-colors underline underline-offset-2">Setup guides →</Link>
              </div>

              {/* Follow STREAMB4 */}
              <div className="pt-6">
                <p className="text-[#FF6B00] font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                  Follow STREAMB4
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      name: "Discord",
                      sub: "Join the community",
                      href: "https://discord.gg/BFr5HSZfk",
                      label: "Join STREAMB4 on Discord",
                      color: "#5865F2",
                      icon: (
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
                        </svg>
                      ),
                    },
                    {
                      name: "Facebook",
                      sub: "Like our page",
                      href: "https://www.facebook.com/profile.php?id=61591545360371",
                      label: "Follow STREAMB4 on Facebook",
                      color: "#1877F2",
                      icon: (
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                        </svg>
                      ),
                    },
                    {
                      name: "X (Twitter)",
                      sub: "Latest updates",
                      href: "https://x.com/streamb4t",
                      label: "Follow STREAMB4 on X",
                      color: "#9ca3af",
                      icon: (
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622z"/>
                        </svg>
                      ),
                    },
                    {
                      name: "Instagram",
                      sub: "Behind the scenes",
                      href: "https://www.instagram.com/streamb4tv/?hl=fr",
                      label: "Follow STREAMB4 on Instagram",
                      color: "#E1306C",
                      icon: (
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                          <rect x="2" y="2" width="20" height="20" rx="5"/>
                          <circle cx="12" cy="12" r="4"/>
                          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                        </svg>
                      ),
                    },
                  ].map((s) => (
                    <motion.a
                      key={s.name}
                      href={s.href}
                      aria-label={s.label}
                      title={s.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#2a2a2a] rounded-xl transition-colors duration-300 hover:border-[#FF6B00]/30 group"
                    >
                      <span style={{ color: s.color }} className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        {s.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-bold leading-tight">{s.name}</p>
                        <p className="text-gray-600 text-[10px]">{s.sub}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl relative">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-full flex items-center justify-center mx-auto text-[#FF6B00] mb-6">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">Message Sent!</h2>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Your message has been registered. One of our specialists will reply within 10 minutes.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <h2 className="text-xl font-bold text-white mb-4">Send a Message</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="text-xs text-gray-500 font-bold block mb-2 uppercase">Your Name</label>
                      <input
                        id="contact-name"
                        name="name"
                        required
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        disabled={submitting}
                        className="w-full bg-[#0A0A0A] border border-[#2a2a2a] hover:border-[#FF6B00]/30 focus:border-[#FF6B00] rounded-lg py-3 px-4 text-sm text-white focus:outline-none transition-colors disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="text-xs text-gray-500 font-bold block mb-2 uppercase">Email Address</label>
                      <input
                        id="contact-email"
                        name="email"
                        required
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        disabled={submitting}
                        className="w-full bg-[#0A0A0A] border border-[#2a2a2a] hover:border-[#FF6B00]/30 focus:border-[#FF6B00] rounded-lg py-3 px-4 text-sm text-white focus:outline-none transition-colors disabled:opacity-60"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="text-xs text-gray-500 font-bold block mb-2 uppercase">Subject</label>
                    <input
                      id="contact-subject"
                      name="subject"
                      required
                      type="text"
                      placeholder="Pre-sales enquiry / Technical setup support"
                      value={form.subject}
                      onChange={handleChange}
                      disabled={submitting}
                      className="w-full bg-[#0A0A0A] border border-[#2a2a2a] hover:border-[#FF6B00]/30 focus:border-[#FF6B00] rounded-lg py-3 px-4 text-sm text-white focus:outline-none transition-colors disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="text-xs text-gray-500 font-bold block mb-2 uppercase">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Describe your question or issue in detail..."
                      value={form.message}
                      onChange={handleChange}
                      disabled={submitting}
                      className="w-full bg-[#0A0A0A] border border-[#2a2a2a] hover:border-[#FF6B00]/30 focus:border-[#FF6B00] rounded-lg py-3 px-4 text-sm text-white focus:outline-none transition-colors resize-none disabled:opacity-60"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" aria-hidden="true" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" aria-hidden="true" /> Send Message
                        </>
                      )}
                    </Button>
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-[#FF6B00]" aria-hidden="true" /> Or use Instant Live Chat
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Toast notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}
