"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Save,
  Calendar,
  Copy,
  Check,
  Share2,
  Sliders,
  ArrowLeft,
  FileText,
} from "lucide-react";
import Link from "next/link";

function EditorContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";
  const initialJobId = searchParams.get("id") || "";

  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [hashtags, setHashtags] = useState("#EnterpriseAI #Innovation #DigitalTransformation");
  const [platform, setPlatform] = useState<"LinkedIn" | "Twitter/X" | "Substack">("LinkedIn");
  const [scheduledDate, setScheduledDate] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialJobId) {
      fetch(`/api/jobs/${initialJobId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.job?.result) {
            setHeadline(data.job.result.headline || "");
            setBody(data.job.result.body || "");
            if (data.job.result.hashtags) {
              setHashtags(data.job.result.hashtags.join(" "));
            }
          }
        })
        .catch(console.error);
    } else if (initialTopic) {
      setHeadline(`Strategic Perspectives: ${initialTopic}`);
      setBody(
        `In today's rapidly evolving market, ${initialTopic} represents a pivotal frontier for forward-looking enterprises.\n\nKey takeaways:\n1. Establish robust deterministic governance.\n2. Measure end-to-end telemetry and cost attribution.\n3. Empower distributed teams with autonomous tools.`
      );
    } else {
      setHeadline("Accelerating Enterprise Content Production with Zero Data Leakage");
      setBody(
        "Modern digital teams need high-velocity content automation without sacrificing security, tenant privacy, or budget predictability.\n\nBy leveraging PostgreSQL Row-Level Security and resilient worker pools, organizations can scale generative marketing deterministically."
      );
    }
  }, [initialJobId, initialTopic]);

  const handleCopy = () => {
    const fullText = `${headline}\n\n${body}\n\n${hashtags}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveDraft = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !body.trim()) return;

    setIsScheduling(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: headline.trim(),
          platform,
          scheduledFor: scheduledDate || new Date(Date.now() + 86400000).toISOString(),
          preview: body.slice(0, 180) + "...",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to schedule publication.");
      }

      setScheduleSuccess(true);
      setTimeout(() => setScheduleSuccess(false), 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error scheduling post.");
    } finally {
      setIsScheduling(false);
    }
  };

  const charCount = (headline + body).length;
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/content"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-indigo-400" />
              Content Studio & Refinement Editor
            </h1>
            <p className="text-xs text-slate-400">
              Fine-tune synthesized copy, audit visual directives, and schedule multi-channel distribution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
          >
            {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{isCopied ? "Copied!" : "Copy Payload"}</span>
          </button>

          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            {isSaved ? <Check size={14} className="text-emerald-400" /> : <Save size={14} />}
            <span>{isSaved ? "Saved" : "Save Draft"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Main Canvas */}
        <div className="lg:col-span-2 space-y-5">
          {/* Headline Input */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Executive Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Enter compelling headline..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500 outline-none font-semibold"
            />
          </div>

          {/* Body Copy Textarea */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Synthesized Body Copy
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {wordCount} words • ~{readingTime} min read • {charCount} chars
              </span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              placeholder="Craft or refine your post content..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-100 placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed font-sans resize-y"
            />
          </div>

          {/* Hashtags Input */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Categorization Hashtags
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-indigo-300 focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
            />
          </div>
        </div>

        {/* Sidebar: Scheduling & Distribution */}
        <div className="space-y-5">
          <form
            onSubmit={handleSchedule}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Calendar size={16} className="text-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Schedule Publication
              </h2>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                {errorMsg}
              </p>
            )}

            {scheduleSuccess && (
              <p className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                <Check size={14} /> Scheduled successfully!
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Target Channel</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value="LinkedIn">LinkedIn Pulse / Feed</option>
                <option value="Twitter/X">Twitter/X Thread</option>
                <option value="Substack">Substack Publication</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Publication Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isScheduling}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Share2 size={14} />
              <span>{isScheduling ? "Adding to Queue..." : "Confirm Schedule"}</span>
            </button>
          </form>

          {/* Guidelines Box */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-2 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles size={13} className="text-indigo-400" /> Enterprise Brand Safety
            </p>
            <p className="leading-relaxed">
              All scheduled content is subjected to outbound PII audits and token rate limiter reconciliation prior to webhook dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading editor studio...</div>}>
      <EditorContent />
    </Suspense>
  );
}
