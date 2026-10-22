"use client";

import { useState } from "react";
import { Sparkles, Send, Sliders, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import { JobProgress } from "@/components/shared/JobProgress";

const TONES = [
  "Thought Leadership",
  "Technical Deep-Dive",
  "Product Launch",
  "Executive Briefing",
  "Conversational / Storytelling",
];

const SUGGESTIONS = [
  "How Deterministic RLS Prevents Multi-Tenant Data Leakage in AI SaaS",
  "The 2026 Enterprise Blueprint for Distributed BullMQ Job Orchestration",
  "Mitigating Prompt Injection & PII Exposure in Autonomous AI Workflows",
  "Why Token-Bucket Rate Limiting is Critical for LLM Cost Governance",
];

export default function ContentFactoryPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Thought Leadership");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          tone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit content generation job.");
      }

      setActiveJobId(data.jobId);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Enterprise Pipeline
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck size={13} className="text-emerald-400" />
            DLP & Prompt Injection Protected
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">
          AI Content Factory
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Synthesize publication-grade multi-channel content with automated visual directives and deterministic tenant isolation.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="topic" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Content Directive / Core Topic
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Architecting zero-trust agentic systems in regulated healthcare fintech..."
              rows={4}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm resize-none"
              required
            />
          </div>

          {/* Tone Selector */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Sliders size={13} className="text-indigo-400" />
              Strategic Tone & Narrative Frame
            </label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    tone === t
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {submitError && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="text-rose-400 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !topic.trim()}
            className={`
              w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all
              ${isSubmitting || !topic.trim()
                ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed" 
                : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/25"}
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Dispatching to BullMQ Pipeline...
              </span>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Enterprise Content & Visuals
              </>
            )}
          </button>
        </form>
      </div>

      {/* Real-time Job Progress & Output */}
      {activeJobId && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <JobProgress 
            jobId={activeJobId}
            onReset={() => {
              setActiveJobId(null);
              setTopic("");
            }}
          />
        </div>
      )}

      {/* Suggested Topics Pills */}
      {!activeJobId && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Zap size={13} className="text-amber-400" />
            <span>Preset Enterprise Directives</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setTopic(suggestion)}
                className="p-3.5 text-xs text-left text-slate-300 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 rounded-xl transition-all group"
              >
                <span className="text-indigo-400 font-semibold group-hover:text-indigo-300">Prompt: </span>
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
