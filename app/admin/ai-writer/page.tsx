"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/admin/ui/Toast";
import StudioStepper from "@/components/admin/studio/StudioStepper";
import PublishCenterModal from "@/components/admin/publish/PublishCenterModal";
import { analyzeContent, type SeoAnalysis } from "@/services/seo";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PromptConfig {
  prompt:             string;
  topic:              string;
  primaryKeyword:     string;
  secondaryKeywords:  string;
  country:            string;
  language:           string;
  tone:               string;
  writingStyle:       string;
  wordCount:          number;
  category:           string;
  tags:               string;
  targetAudience:     string;
  ctaStyle:           string;
}

interface SeoConfig {
  seoTitle:          string;
  metaDescription:   string;
  slug:              string;
  ogTitle:           string;
  ogDescription:     string;
  socialDescription: string;
  focusKeyword:      string;
  lsiKeywords:       string[];
}

interface OutlineSection {
  id:             string;
  level:          number;
  heading:        string;
  description:    string;
  estimatedWords: number;
  subsections?:   OutlineSection[];
}

interface GeneratedArticle {
  id:                  string;
  title:               string;
  content:             string;
  excerpt:             string;
  faqs:                Array<{ question: string; answer: string }>;
  internalLinks:       Array<{ anchor: string; url: string }>;
  externalLinks:       Array<{ anchor: string; url: string; domain: string }>;
  imagePrompts:        string[];
  featuredImagePrompt: string;
  featuredImage:       string;
  schemaMarkup:        Record<string, unknown>;
  wordCount:           number;
  readingTime:         number;
  seoScore:            number;
  readabilityScore:    number;
  eeatScore:           number;
  keywordDensity:      string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COUNTRIES  = ["US","UK","Canada","Australia","France","Germany","Spain","Morocco","UAE","Global"];
const LANGUAGES  = ["English","French","Arabic","Spanish","German","Portuguese"];
const TONES      = ["Professional","Conversational","Authoritative","Friendly","Technical","Persuasive","Inspirational"];
const STYLES     = ["Informative","How-To Guide","Listicle","Review","Comparison","Tutorial","Opinion","News","Case Study"];
const CATEGORIES = ["General","IPTV","Streaming","Technology","Entertainment","Sports","Movies & TV","How-To","Reviews","News"];
const CTA_STYLES = ["Soft Recommendation","Direct CTA","Trial Offer","Free Trial","Contact Us","Subscribe","Learn More"];

const GENERATION_STEPS = [
  "Analysing keyword intent & competition…",
  "Researching LSI and semantic keywords…",
  "Mining People Also Ask data…",
  "Identifying featured snippet opportunities…",
  "Building enterprise content outline…",
  "Writing hero introduction…",
  "Generating main content sections…",
  "Adding expert insights & data points…",
  "Writing step-by-step tutorials…",
  "Building comparison tables…",
  "Adding troubleshooting section…",
  "Writing FAQ schema (12–15 items)…",
  "Building internal link suggestions…",
  "Finding external authority sources…",
  "Generating image prompts & alt text…",
  "Compiling JSON-LD schema markup…",
  "Running enterprise quality check…",
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIWriterPage() {
  const { addToast } = useToast();

  const [currentStep,    setCurrentStep]    = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const [promptConfig, setPromptConfig] = useState<PromptConfig>({
    prompt:            "",
    topic:             "",
    primaryKeyword:    "",
    secondaryKeywords: "",
    country:           "US",
    language:          "English",
    tone:              "Professional",
    writingStyle:      "How-To Guide",
    wordCount:         3500,
    category:          "IPTV",
    tags:              "",
    targetAudience:    "IPTV users and cord-cutters",
    ctaStyle:          "Free Trial",
  });

  const [seoConfig, setSeoConfig] = useState<SeoConfig>({
    seoTitle:          "",
    metaDescription:   "",
    slug:              "",
    ogTitle:           "",
    ogDescription:     "",
    socialDescription: "",
    focusKeyword:      "",
    lsiKeywords:       [],
  });

  const [outline,       setOutline]       = useState<OutlineSection[]>([]);
  const [outlineNotes,  setOutlineNotes]  = useState("");
  const [article,       setArticle]       = useState<GeneratedArticle | null>(null);
  const [analysis,      setAnalysis]      = useState<SeoAnalysis | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const [loadingSeo,     setLoadingSeo]     = useState(false);
  const [loadingOutline, setLoadingOutline] = useState(false);
  const [generating,     setGenerating]     = useState(false);
  const [genStep,        setGenStep]        = useState(0);
  const [genProgress,    setGenProgress]    = useState(0);

  const genTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const completeStep = (stepId: number) => {
    setCompletedSteps(prev => [...new Set([...prev, stepId])]);
    setCurrentStep(stepId + 1);
  };

  const goToStep = (stepId: number) => {
    if (completedSteps.includes(stepId) || stepId < currentStep) setCurrentStep(stepId);
  };

  // ── Step 1 → 2: Generate SEO ──────────────────────────────────────────────

  const handlePromptNext = async () => {
    if (!promptConfig.primaryKeyword.trim() && !promptConfig.topic.trim()) {
      addToast("Enter a topic or primary keyword", "error"); return;
    }
    setLoadingSeo(true);
    try {
      const res  = await fetch("/api/admin/ai-seo", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt:            promptConfig.prompt,
          topic:             promptConfig.topic,
          primaryKeyword:    promptConfig.primaryKeyword,
          secondaryKeywords: promptConfig.secondaryKeywords.split(",").map(s => s.trim()).filter(Boolean),
          country:           promptConfig.country,
          language:          promptConfig.language,
          tone:              promptConfig.tone,
          category:          promptConfig.category,
        }),
      });
      const data = await res.json();
      if (data.success && data.seo) {
        setSeoConfig({
          seoTitle:          data.seo.seoTitle          ?? "",
          metaDescription:   data.seo.metaDescription   ?? "",
          slug:              data.seo.slug               ?? "",
          ogTitle:           data.seo.ogTitle            ?? "",
          ogDescription:     data.seo.ogDescription      ?? "",
          socialDescription: data.seo.socialDescription  ?? "",
          focusKeyword:      data.seo.focusKeyword       ?? promptConfig.primaryKeyword,
          lsiKeywords:       data.seo.lsiKeywords        ?? [],
        });
        completeStep(1);
      } else { addToast("SEO generation failed — check API key in Settings", "error"); }
    } catch { addToast("Failed to generate SEO settings", "error"); }
    finally  { setLoadingSeo(false); }
  };

  // ── Step 2 → 3: Generate Outline ─────────────────────────────────────────

  const handleSeoNext = async () => {
    if (!seoConfig.seoTitle.trim()) { addToast("SEO title is required", "error"); return; }
    setLoadingOutline(true);
    try {
      const res  = await fetch("/api/admin/ai-outline", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt:            promptConfig.prompt,
          topic:             promptConfig.topic,
          primaryKeyword:    promptConfig.primaryKeyword,
          secondaryKeywords: promptConfig.secondaryKeywords.split(",").map(s => s.trim()).filter(Boolean),
          seoTitle:          seoConfig.seoTitle,
          targetAudience:    promptConfig.targetAudience,
          writingStyle:      promptConfig.writingStyle,
          tone:              promptConfig.tone,
          wordCount:         promptConfig.wordCount,
          category:          promptConfig.category,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOutline(data.outline ?? []);
        setOutlineNotes(data.structureNotes ?? "");
        completeStep(2);
      } else { addToast("Outline generation failed", "error"); }
    } catch { addToast("Failed to generate outline", "error"); }
    finally  { setLoadingOutline(false); }
  };

  // ── Step 3 → 4: Generate Article ─────────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setGenStep(0);
    setGenProgress(2);
    setCurrentStep(4);
    setCompletedSteps(prev => [...new Set([...prev, 3])]);

    let i = 0;
    genTimer.current = setInterval(() => {
      i++;
      setGenStep(i);
      setGenProgress(Math.min(90, (i / GENERATION_STEPS.length) * 90 + 5));
      if (i >= GENERATION_STEPS.length && genTimer.current) clearInterval(genTimer.current);
    }, 900);

    try {
      const secKws = promptConfig.secondaryKeywords.split(",").map(s => s.trim()).filter(Boolean);
      const res = await fetch("/api/admin/ai-generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword:          promptConfig.primaryKeyword || promptConfig.topic,
          secondaryKeywords: secKws,
          articleType:      promptConfig.writingStyle,
          qualityTier:      "enterprise",
          country:          promptConfig.country,
          language:         promptConfig.language,
          tone:             promptConfig.tone,
          targetWordCount:  promptConfig.wordCount,
          category:         promptConfig.category,
          targetAudience:   promptConfig.targetAudience,
          ctaStyle:         promptConfig.ctaStyle,
          seoTitle:         seoConfig.seoTitle,
          metaDescription:  seoConfig.metaDescription,
          slug:             seoConfig.slug,
          outline:          outline.map(s => s.heading).join("\n"),
        }),
      });

      if (genTimer.current) clearInterval(genTimer.current);
      setGenProgress(100);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Generation failed");

      const generated: GeneratedArticle = {
        id:                  data.id                  ?? String(Date.now()),
        title:               data.title               ?? seoConfig.seoTitle,
        content:             data.content             ?? "",
        excerpt:             data.excerpt             ?? "",
        faqs:                data.faqs                ?? [],
        internalLinks:       data.internalLinks       ?? [],
        externalLinks:       data.externalLinks       ?? [],
        imagePrompts:        data.imagePrompts        ?? [],
        featuredImagePrompt: data.featuredImagePrompt ?? "",
        featuredImage:       data.featuredImage       ?? "",
        schemaMarkup:        data.schemaMarkup        ?? {},
        wordCount:           data.wordCount           ?? 0,
        readingTime:         data.readingTime         ?? 0,
        seoScore:            data.seoScore            ?? 0,
        readabilityScore:    data.readabilityScore    ?? 0,
        eeatScore:           data.eeatScore           ?? 0,
        keywordDensity:      data.keywordDensity      ?? "0%",
      };

      setArticle(generated);
      setEditedContent(generated.content);

      const clientAnalysis = analyzeContent({
        content:         generated.content,
        seoTitle:        seoConfig.seoTitle,
        metaDescription: seoConfig.metaDescription,
        focusKeyword:    seoConfig.focusKeyword || promptConfig.primaryKeyword,
        slug:            seoConfig.slug,
        author:          "STREAMB4 Editorial Team",
        faqs:            generated.faqs,
        schemaMarkup:    generated.schemaMarkup,
      });
      setAnalysis(clientAnalysis);
      completeStep(4);
    } catch (err) {
      if (genTimer.current) clearInterval(genTimer.current);
      setGenProgress(0);
      addToast(err instanceof Error ? err.message : "Generation failed", "error");
      setCurrentStep(3);
      setCompletedSteps(prev => prev.filter(s => s !== 3));
    } finally { setGenerating(false); }
  }, [promptConfig, seoConfig, outline, addToast]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step 5 → 6: Save & Open Publish Modal ────────────────────────────────

  const handlePublish = async () => {
    if (!article) return;
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:               article.id,
          title:            article.title,
          slug:             seoConfig.slug,
          content:          editedContent,
          excerpt:          article.excerpt,
          seoTitle:         seoConfig.seoTitle,
          metaDescription:  seoConfig.metaDescription,
          focusKeyword:     seoConfig.focusKeyword || promptConfig.primaryKeyword,
          secondaryKeywords: promptConfig.secondaryKeywords.split(",").map(s => s.trim()).filter(Boolean),
          lsiKeywords:      seoConfig.lsiKeywords,
          ogTitle:          seoConfig.ogTitle,
          ogDescription:    seoConfig.ogDescription,
          faqs:             article.faqs,
          internalLinks:    article.internalLinks,
          schemaMarkup:     article.schemaMarkup,
          category:         promptConfig.category,
          tags:             promptConfig.tags.split(",").map(s => s.trim()).filter(Boolean),
          author:           "STREAMB4 Editorial Team",
          seoScore:         analysis?.seoScore         ?? article.seoScore,
          readabilityScore: analysis?.readabilityScore ?? article.readabilityScore,
          eeatScore:        analysis?.eeatScore        ?? article.eeatScore,
          readingTime:      analysis?.readingTime      ?? article.readingTime,
          keywordDensity:   analysis ? `${analysis.keywordDensity}%` : article.keywordDensity,
          featuredImage:    article.featuredImage,
          imagePrompts:     article.imagePrompts,
          featuredImagePrompt: article.featuredImagePrompt,
          socialDescription: seoConfig.socialDescription,
          outline:          outline.map(s => s.heading).join("\n"),
          tone:             promptConfig.tone,
          writingStyle:     promptConfig.writingStyle,
          targetAudience:   promptConfig.targetAudience,
          ctaStyle:         promptConfig.ctaStyle,
          country:          promptConfig.country,
          language:         promptConfig.language,
          status:           "draft",
        }),
      });
      if (!res.ok) throw new Error("Failed to save article");
      addToast("Article saved — opening Publish Center", "success");
      completeStep(5);
      setPublishModalOpen(true);
    } catch (err) { addToast(err instanceof Error ? err.message : "Save failed", "error"); }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-[#FF7A00] font-black text-xs uppercase tracking-[0.3em] mb-2">ENTERPRISE CONTENT STUDIO</p>
        <h1 className="text-white font-black text-3xl sm:text-4xl uppercase tracking-tight">
          AI <span style={{ color: "#FF7A00" }}>WRITER</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          6-step AI-powered article creation with enterprise SEO analysis and multi-platform publishing.
        </p>
      </div>

      <StudioStepper currentStep={currentStep} completedSteps={completedSteps} onStepClick={goToStep} />

      <AnimatePresence mode="wait">

        {/* ── STEP 1: PROMPT ─────────────────────────────────────────────── */}
        {currentStep === 1 && (
          <StepCard key="step1" title="Prompt & Configuration" icon="✏️">
            <div className="space-y-5">
              <Field label="Content Brief / Prompt">
                <textarea
                  value={promptConfig.prompt}
                  onChange={e => setPromptConfig(p => ({ ...p, prompt: e.target.value }))}
                  placeholder="Describe the article you want to create. Be specific about angle, audience, and key points to cover…"
                  rows={4}
                  className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/40 resize-none"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Topic" required><TextInput value={promptConfig.topic} onChange={v => setPromptConfig(p => ({ ...p, topic: v }))} placeholder="e.g. Best IPTV Service 2026" /></Field>
                <Field label="Primary Keyword" required><TextInput value={promptConfig.primaryKeyword} onChange={v => setPromptConfig(p => ({ ...p, primaryKeyword: v }))} placeholder="e.g. best IPTV service" /></Field>
                <Field label="Secondary Keywords" hint="Comma separated"><TextInput value={promptConfig.secondaryKeywords} onChange={v => setPromptConfig(p => ({ ...p, secondaryKeywords: v }))} placeholder="IPTV subscription, live TV streaming, …" /></Field>
                <Field label="Target Audience"><TextInput value={promptConfig.targetAudience} onChange={v => setPromptConfig(p => ({ ...p, targetAudience: v }))} placeholder="e.g. IPTV users and cord-cutters" /></Field>
                <Field label="Country"><SelectInput value={promptConfig.country} onChange={v => setPromptConfig(p => ({ ...p, country: v }))} options={COUNTRIES} /></Field>
                <Field label="Language"><SelectInput value={promptConfig.language} onChange={v => setPromptConfig(p => ({ ...p, language: v }))} options={LANGUAGES} /></Field>
                <Field label="Tone"><SelectInput value={promptConfig.tone} onChange={v => setPromptConfig(p => ({ ...p, tone: v }))} options={TONES} /></Field>
                <Field label="Writing Style"><SelectInput value={promptConfig.writingStyle} onChange={v => setPromptConfig(p => ({ ...p, writingStyle: v }))} options={STYLES} /></Field>
                <Field label="Category"><SelectInput value={promptConfig.category} onChange={v => setPromptConfig(p => ({ ...p, category: v }))} options={CATEGORIES} /></Field>
                <Field label="Target Word Count">
                  <SelectInput
                    value={String(promptConfig.wordCount)}
                    onChange={v => setPromptConfig(p => ({ ...p, wordCount: Number(v) }))}
                    options={["1500","2000","3000","3500","5000","7000"]}
                  />
                </Field>
                <Field label="Tags" hint="Comma separated"><TextInput value={promptConfig.tags} onChange={v => setPromptConfig(p => ({ ...p, tags: v }))} placeholder="iptv, streaming, firestick, …" /></Field>
                <Field label="CTA Style"><SelectInput value={promptConfig.ctaStyle} onChange={v => setPromptConfig(p => ({ ...p, ctaStyle: v }))} options={CTA_STYLES} /></Field>
              </div>

              <StepFooter>
                <div />
                <OrangeButton onClick={handlePromptNext} loading={loadingSeo}>
                  {loadingSeo ? "Generating SEO…" : "Next: SEO Settings →"}
                </OrangeButton>
              </StepFooter>
            </div>
          </StepCard>
        )}

        {/* ── STEP 2: SEO SETTINGS ─────────────────────────────────────── */}
        {currentStep === 2 && (
          <StepCard key="step2" title="SEO Settings" icon="🎯">
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl text-xs" style={{ background: "rgba(255,122,0,0.06)", border: "1px solid rgba(255,122,0,0.12)" }}>
                <span className="text-orange-400">✦</span>
                <span className="text-gray-400">AI-generated SEO metadata. Review and refine before proceeding.</span>
              </div>

              <Field label="SEO Title" hint={`${seoConfig.seoTitle.length}/65 chars`} required>
                <TextInput value={seoConfig.seoTitle} onChange={v => setSeoConfig(s => ({ ...s, seoTitle: v }))} placeholder="SEO-optimised title…" />
                <TitleLengthBar length={seoConfig.seoTitle.length} min={30} max={65} />
              </Field>

              <Field label="Meta Description" hint={`${seoConfig.metaDescription.length}/160 chars`} required>
                <textarea value={seoConfig.metaDescription} onChange={e => setSeoConfig(s => ({ ...s, metaDescription: e.target.value }))} rows={3}
                  className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/40 resize-none" />
                <TitleLengthBar length={seoConfig.metaDescription.length} min={120} max={160} />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="URL Slug" required>
                  <TextInput value={seoConfig.slug} onChange={v => setSeoConfig(s => ({ ...s, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))} placeholder="url-friendly-slug" prefix="streamb4.com/blog/" />
                </Field>
                <Field label="Focus Keyword"><TextInput value={seoConfig.focusKeyword} onChange={v => setSeoConfig(s => ({ ...s, focusKeyword: v }))} placeholder="primary search keyword" /></Field>
                <Field label="OG Title"><TextInput value={seoConfig.ogTitle} onChange={v => setSeoConfig(s => ({ ...s, ogTitle: v }))} placeholder="Open Graph title…" /></Field>
                <Field label="OG Description"><TextInput value={seoConfig.ogDescription} onChange={v => setSeoConfig(s => ({ ...s, ogDescription: v }))} placeholder="Open Graph description…" /></Field>
              </div>

              <Field label="Social Description">
                <textarea value={seoConfig.socialDescription} onChange={e => setSeoConfig(s => ({ ...s, socialDescription: e.target.value }))} rows={2}
                  className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500/40 resize-none"
                  placeholder="Caption for social posts…" />
              </Field>

              {/* Google Snippet Preview */}
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-3 font-bold">Google Snippet Preview</p>
                <p className="text-xs text-gray-500">https://streamb4.com › blog › {seoConfig.slug || "your-slug"}</p>
                <p className="text-blue-400 text-sm font-medium mt-0.5">{seoConfig.seoTitle || "Your SEO Title Will Appear Here"}</p>
                <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{seoConfig.metaDescription || "Your meta description will be shown here in Google search results."}</p>
              </div>

              <StepFooter>
                <button onClick={() => setCurrentStep(1)} className="text-gray-500 hover:text-white transition-colors text-sm">← Back</button>
                <OrangeButton onClick={handleSeoNext} loading={loadingOutline}>
                  {loadingOutline ? "Building Outline…" : "Next: Outline →"}
                </OrangeButton>
              </StepFooter>
            </div>
          </StepCard>
        )}

        {/* ── STEP 3: OUTLINE ──────────────────────────────────────────── */}
        {currentStep === 3 && (
          <StepCard key="step3" title="Article Outline" icon="📋">
            <div className="space-y-4">
              {outlineNotes && (
                <div className="p-3 rounded-xl text-xs text-gray-400" style={{ background: "rgba(255,122,0,0.04)", border: "1px solid rgba(255,122,0,0.08)" }}>
                  <span className="text-orange-400 font-bold">Strategy: </span>{outlineNotes}
                </div>
              )}

              <div className="space-y-2">
                {outline.map((section, idx) => (
                  <motion.div key={section.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                    className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5"
                        style={{ background: "linear-gradient(135deg,#FF7A00,#ffb300)", color: "#000" }}>{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <input type="text" value={section.heading}
                          onChange={e => { const u = [...outline]; u[idx] = { ...section, heading: e.target.value }; setOutline(u); }}
                          className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none" />
                        <p className="text-gray-600 text-[11px] mt-0.5">{section.description}</p>
                        <p className="text-gray-700 text-[10px]">~{section.estimatedWords} words</p>
                        {(section.subsections ?? []).map((sub, si) => (
                          <div key={sub.id} className="mt-2 pl-4 border-l border-white/[0.05]">
                            <input type="text" value={sub.heading}
                              onChange={e => {
                                const u = [...outline]; const subs = [...(section.subsections ?? [])];
                                subs[si] = { ...sub, heading: e.target.value }; u[idx] = { ...section, subsections: subs }; setOutline(u);
                              }}
                              className="w-full bg-transparent text-gray-400 text-xs focus:outline-none" />
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setOutline(outline.filter((_, i) => i !== idx))}
                        className="text-gray-700 hover:text-red-400 transition-colors text-xs flex-shrink-0">×</button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button onClick={() => setOutline(prev => [...prev, { id: `c-${Date.now()}`, level: 1, heading: "New Section", description: "Describe this section", estimatedWords: 300 }])}
                className="w-full py-2 text-xs text-gray-600 hover:text-orange-400 transition-colors border border-dashed border-white/[0.06] hover:border-orange-500/20 rounded-xl">
                + Add Section
              </button>

              <StepFooter>
                <button onClick={() => setCurrentStep(2)} className="text-gray-500 hover:text-white transition-colors text-sm">← Back</button>
                <OrangeButton onClick={handleGenerate}>⚡ Generate Article</OrangeButton>
              </StepFooter>
            </div>
          </StepCard>
        )}

        {/* ── STEP 4: GENERATE ─────────────────────────────────────────── */}
        {currentStep === 4 && (
          <StepCard key="step4" title="Generating Article" icon="⚡">
            <div className="py-8 space-y-8">
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8"/>
                    <motion.circle cx="60" cy="60" r="50" fill="none" stroke="url(#pg)" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={314} animate={{ strokeDashoffset: 314 * (1 - genProgress / 100) }} transition={{ duration: 0.5 }}/>
                    <defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF7A00"/><stop offset="100%" stopColor="#ffb300"/></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white font-black text-2xl">{Math.round(genProgress)}%</span>
                    <span className="text-gray-600 text-[10px]">complete</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-orange-400 font-semibold text-sm animate-pulse">{GENERATION_STEPS[Math.min(genStep, GENERATION_STEPS.length - 1)]}</p>
                  <p className="text-gray-600 text-xs mt-1">Step {Math.min(genStep + 1, GENERATION_STEPS.length)} of {GENERATION_STEPS.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-w-lg mx-auto">
                {GENERATION_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-3 h-3 rounded-full" style={{
                      background: i < genStep ? "#22c55e" : i === genStep ? "#FF7A00" : "rgba(255,255,255,0.06)",
                      boxShadow: i === genStep ? "0 0 6px rgba(255,122,0,0.4)" : "none",
                    }}/>
                    <span className="text-[10px] truncate" style={{ color: i < genStep ? "#22c55e" : i === genStep ? "#FF7A00" : "#333" }}>
                      {step.replace("…", "")}
                    </span>
                  </div>
                ))}
              </div>

              {genProgress >= 100 && !generating && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <p className="text-green-400 font-bold text-lg">✓ Article Generated!</p>
                  <button onClick={() => setCurrentStep(5)} className="mt-4 px-6 py-2.5 rounded-xl text-sm font-black text-black"
                    style={{ background: "linear-gradient(135deg,#FF7A00,#ffb300)" }}>Review Article →</button>
                </motion.div>
              )}
            </div>
          </StepCard>
        )}

        {/* ── STEP 5: REVIEW ───────────────────────────────────────────── */}
        {currentStep === 5 && article && (
          <StepCard key="step5" title="Review & Edit" icon="🔍">
            <div className="space-y-6">
              {analysis && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <ScoreCard label="SEO Score"   value={analysis.seoScore}         color="#FF7A00" />
                  <ScoreCard label="Readability" value={analysis.readabilityScore} color="#3b82f6" />
                  <ScoreCard label="EEAT"        value={analysis.eeatScore}        color="#8b5cf6" />
                  <MetricCard label="Word Count" value={analysis.wordCount.toLocaleString()} sub="words" />
                </div>
              )}

              {analysis && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { label: "Read Time",  val: `${analysis.readingTime}min`  },
                    { label: "KW Density", val: `${analysis.keywordDensity}%` },
                    { label: "Int. Links", val: analysis.internalLinksCount   },
                    { label: "Ext. Links", val: analysis.externalLinksCount   },
                    { label: "FAQs",       val: article.faqs.length           },
                    { label: "Missing Alt",val: analysis.missingAltTags       },
                  ].map(stat => (
                    <div key={stat.label} className="text-center p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p className="text-white font-black text-sm">{stat.val}</p>
                      <p className="text-gray-600 text-[10px] mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Issues */}
              {analysis && analysis.issues.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Issues & Suggestions</p>
                  {analysis.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="mt-0.5 flex-shrink-0"
                        style={{ color: issue.severity === "error" ? "#ef4444" : issue.severity === "warning" ? "#f59e0b" : "#6b7280" }}>
                        {issue.severity === "error" ? "✗" : issue.severity === "warning" ? "⚠" : "ℹ"}
                      </span>
                      <span className="text-gray-400">{issue.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Heading structure */}
              {analysis && analysis.headingStructure.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Heading Structure</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {analysis.headingStructure.map((h, i) => (
                      <div key={i} className="flex items-center gap-2" style={{ paddingLeft: `${(h.level - 1) * 14}px` }}>
                        <span className="text-[10px] font-black text-orange-500">H{h.level}</span>
                        <span className="text-gray-400 text-xs truncate">{h.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Google Snippet Preview */}
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-3 font-bold">Google Snippet Preview</p>
                <p className="text-xs text-gray-500">https://streamb4.com › blog › {seoConfig.slug}</p>
                <p className="text-blue-400 text-sm font-medium mt-0.5">{analysis?.snippetPreview.title || seoConfig.seoTitle}</p>
                <p className="text-gray-400 text-xs mt-1">{analysis?.snippetPreview.description || seoConfig.metaDescription}</p>
              </div>

              {/* Content editor */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Article Content (Markdown)</p>
                <textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} rows={20}
                  className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-orange-500/40 resize-y"
                  style={{ background: "rgba(255,255,255,0.01)" }} />
              </div>

              {/* FAQs */}
              {article.faqs.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">FAQ Schema ({article.faqs.length} items)</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {article.faqs.slice(0, 5).map((faq, i) => (
                      <div key={i}>
                        <p className="text-white text-xs font-semibold">{faq.question}</p>
                        <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-2">{faq.answer}</p>
                      </div>
                    ))}
                    {article.faqs.length > 5 && <p className="text-gray-600 text-[11px]">+{article.faqs.length - 5} more…</p>}
                  </div>
                </div>
              )}

              {/* Internal links */}
              {article.internalLinks.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Internal Link Suggestions ({article.internalLinks.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {article.internalLinks.slice(0, 8).map((link, i) => (
                      <span key={i} className="text-[11px] px-2 py-1 rounded-lg text-orange-400"
                        style={{ background: "rgba(255,122,0,0.08)", border: "1px solid rgba(255,122,0,0.15)" }}>{link.anchor}</span>
                    ))}
                  </div>
                </div>
              )}

              <StepFooter>
                <button onClick={() => setCurrentStep(4)} className="text-gray-500 hover:text-white transition-colors text-sm">← Back</button>
                <OrangeButton onClick={handlePublish}>🚀 Open Publish Center</OrangeButton>
              </StepFooter>
            </div>
          </StepCard>
        )}

        {/* ── STEP 6: PUBLISHED ────────────────────────────────────────── */}
        {currentStep === 6 && (
          <StepCard key="step6" title="Published!" icon="🚀">
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl"
                style={{ background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.3)" }}>✓</div>
              <h2 className="text-white font-black text-xl">Article Published</h2>
              <p className="text-gray-500 text-sm">{article?.title} has been published to your selected platforms.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <a href={`/blog/${seoConfig.slug}`} target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl text-sm font-black text-black" style={{ background: "linear-gradient(135deg,#FF7A00,#ffb300)" }}>
                  View Article ↗
                </a>
                <button
                  onClick={() => { setCurrentStep(1); setCompletedSteps([]); setArticle(null); setAnalysis(null); setEditedContent(""); setOutline([]); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors border border-white/[0.08]">
                  Write Another Article
                </button>
              </div>
            </div>
          </StepCard>
        )}

      </AnimatePresence>

      {/* Publish Center Modal */}
      {article && (
        <PublishCenterModal
          open={publishModalOpen}
          onClose={() => setPublishModalOpen(false)}
          postId={article.id}
          postTitle={article.title}
          postSlug={seoConfig.slug}
        />
      )}
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function StepCard({ children, title, icon }: { children: React.ReactNode; title: string; icon: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
      className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-lg">{icon}</span>
        <h2 className="text-white font-black text-base uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}{required && <span className="text-orange-500 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-[10px] text-gray-600">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, prefix }: { value: string; onChange: (v: string) => void; placeholder?: string; prefix?: string }) {
  return (
    <div className="flex items-center border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-orange-500/40 transition-colors">
      {prefix && <span className="px-3 text-[11px] text-gray-600 bg-white/[0.02] border-r border-white/[0.06] whitespace-nowrap">{prefix}</span>}
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none" />
    </div>
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/40 transition-colors"
      style={{ background: "#0a0a0a" }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function OrangeButton({ onClick, loading, children, disabled }: { onClick: () => void; loading?: boolean; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading || disabled}
      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-black disabled:opacity-50 transition-opacity"
      style={{ background: "linear-gradient(135deg, #FF7A00, #ffb300)" }}>
      {loading && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
      {children}
    </button>
  );
}

function StepFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">{children}</div>;
}

function TitleLengthBar({ length, min, max }: { length: number; min: number; max: number }) {
  const pct = Math.min(100, (length / max) * 100);
  const ok  = length >= min && length <= max;
  return (
    <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden mt-1">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: ok ? "#22c55e" : length > max ? "#ef4444" : "#f59e0b" }} />
    </div>
  );
}

function ScoreCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="relative w-12 h-12 mx-auto mb-2">
        <svg viewBox="0 0 40 40" className="w-12 h-12 -rotate-90">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4"/>
          <motion.circle cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={100} animate={{ strokeDashoffset: 100 - (value ?? 0) }} transition={{ duration: 0.8, ease: "easeOut" }}/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-black text-xs">{value}</span>
        </div>
      </div>
      <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">{label}</p>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <p className="text-white font-black text-xl">{value}</p>
      <p className="text-gray-600 text-[10px]">{sub}</p>
      <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}
