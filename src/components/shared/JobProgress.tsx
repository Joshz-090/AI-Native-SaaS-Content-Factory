"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Clock,
  Copy,
  Check,
  Calendar,
  Sparkles,
  Cpu,
  Layers
} from "lucide-react";
import { GeneratedContentResult } from "@/services/ai";

interface JobProgressProps {
  jobId: string;
  onComplete?: (result: GeneratedContentResult) => void;
  onReset?: () => void;
}

export function JobProgress({ jobId, onComplete, onReset }: JobProgressProps) {
  const [status, setStatus] = useState<"PENDING" | "PROCESSING" | "COMPLETED" | "FAILED">("PENDING");
  const [progress, setProgress] = useState(15);
  const [result, setResult] = useState<GeneratedContentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error("Could not fetch job status");
        
        const data = await res.json();
        if (!isMounted || !data.job) return;

        setStatus(data.job.status);
        setProgress(data.job.progress || (data.job.status === "COMPLETED" ? 100 : 50));

        if (data.job.status === "COMPLETED") {
          setResult(data.job.result);
          clearInterval(interval);
          onComplete?.(data.job.result);
        } else if (data.job.status === "FAILED") {
          setErrorMessage(data.job.error || "Generation pipeline failed.");
          clearInterval(interval);
        }
      } catch {
        // Continue polling if transient network hitch
      }
    }, 800);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [jobId, onComplete]);

  const handleCopy = () => {
    if (!result) return;
    const fullText = `${result.headline}\n\n${result.body}\n\n${result.hashtags?.join(" ") || ""}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScheduleQuick = async () => {
    if (!result) return;
    try {
      await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.headline,
          platform: "LinkedIn",
          preview: result.body.slice(0, 160) + "...",
        }),
      });
      setScheduled(true);
      setTimeout(() => setScheduled(false), 3000);
    } catch {
      // Ignore
    }
  };

  const statusConfig = {
    PENDING: { color: "text-amber-400", icon: Clock, label: "Queued in BullMQ Cluster", border: "border-amber-500/30" },
    PROCESSING: { color: "text-indigo-400", icon: Loader2, label: "Synthesizing AI Content & Visual Metadata...", border: "border-indigo-500/40" },
    COMPLETED: { color: "text-emerald-400", icon: CheckCircle2, label: "Synthesis Complete & Verified", border: "border-emerald-500/30" },
    FAILED: { color: "text-rose-400", icon: AlertCircle, label: "Job Execution Failed", border: "border-rose-500/30" },
  };

  const Config = statusConfig[status];

  return (
    <div className={`p-6 rounded-2xl bg-slate-900 border ${Config.border} shadow-2xl space-y-6 transition-all`}>
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Config.icon className={`${status === "PROCESSING" ? "animate-spin" : ""} ${Config.color}`} size={22} />
          <div>
            <span className="font-semibold text-slate-100 text-sm">{Config.label}</span>
            <p className="text-[11px] font-mono text-slate-400">ID: {jobId}</p>
          </div>
        </div>
        <span className="text-sm font-mono font-bold text-slate-300">{progress}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            status === "FAILED" 
              ? "bg-rose-500" 
              : status === "COMPLETED" 
                ? "bg-gradient-to-r from-emerald-500 to-teal-400" 
                : "bg-gradient-to-r from-indigo-500 to-cyan-400"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Error state */}
      {status === "FAILED" && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
          <div>
            <p className="font-semibold text-rose-200">Execution Error</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Completed Output Card */}
      {status === "COMPLETED" && result && (
        <div className="space-y-6 pt-4 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-[11px] font-mono">
              <Cpu size={12} />
              {result.modelVersion}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">
              <Layers size={12} />
              {result.tokensUsed} Tokens
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-[11px] font-medium">
              <CheckCircle2 size={12} />
              DLP Scanned
            </span>
          </div>

          {/* Post Content */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
              {result.headline}
            </h3>

            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed space-y-2">
              {result.body}
            </div>

            {/* Hashtags */}
            {result.hashtags && result.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {result.hashtags.map((tag: string, i: number) => (
                  <span key={i} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Generated Visual Card */}
          {result.imagePrompt && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 items-center">
              <div className="relative aspect-video md:aspect-square w-full rounded-lg overflow-hidden border border-slate-800">
                <img 
                  src={result.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"} 
                  alt="AI Generated Visual"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  <Sparkles size={14} />
                  <span>Synthesized Visual Directive</span>
                </div>
                <p className="text-xs text-slate-400 italic leading-relaxed">
                  &ldquo;{result.imagePrompt}&rdquo;
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Aspect Ratio: 16:9 • Style: Photorealistic Enterprise Cinematic
                </p>
              </div>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Full Post"}</span>
              </button>

              <button
                onClick={handleScheduleQuick}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-medium border border-indigo-800/60 transition-colors"
              >
                {scheduled ? <Check size={14} className="text-emerald-400" /> : <Calendar size={14} />}
                <span>{scheduled ? "Scheduled to Calendar!" : "Schedule Post"}</span>
              </button>
            </div>

            {onReset && (
              <button
                onClick={onReset}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Create Another Topic →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
