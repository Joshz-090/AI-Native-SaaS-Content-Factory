"use client";

import { useState, useEffect } from "react";
import { Save, Key, Sliders, Sparkles, Check } from "lucide-react";

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState("");
  const [brandVoice, setBrandVoice] = useState(
    "Authoritative, forward-looking, enterprise-focused, data-backed with clear executive takeaways."
  );
  const [modelChoice, setModelChoice] = useState("gemini-3.5-flash-lite");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/organization/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.brandVoice) setBrandVoice(data.settings.brandVoice);
          if (data.settings.modelChoice) setModelChoice(data.settings.modelChoice);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch("/api/organization/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandVoice, modelChoice }),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            System Preferences
          </span>
          <span className="text-xs text-slate-400">Model Configuration • Security Bounds • Webhook Endpoints</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">
          Tenant Configuration
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure AI model parameters, security guardrails, and enterprise brand voice defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Voice Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-400" />
            Enterprise Brand Voice & Persona Directives
          </h2>
          <p className="text-xs text-slate-400">
            Every synthesized post will strictly inherit this global framing before passing through safety sanitizers.
          </p>

          <textarea
            value={brandVoice}
            onChange={(e) => setBrandVoice(e.target.value)}
            rows={3}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Model Selection Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders size={16} className="text-cyan-400" />
            Default Generative Model Engine
          </h2>
          <p className="text-xs text-slate-400">
            Configure default model routing for async generation jobs in BullMQ workers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <label className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              modelChoice === "gemini-1.5-pro"
                ? "bg-indigo-950/40 border-indigo-500 text-white"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Google Gemini 1.5 Pro</span>
                <input 
                  type="radio" 
                  name="model" 
                  checked={modelChoice === "gemini-1.5-pro"} 
                  onChange={() => setModelChoice("gemini-1.5-pro")}
                  className="accent-indigo-500" 
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Deep multi-channel reasoning, optimal for executive briefings and complex analytical thought leadership.
              </p>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              modelChoice === "gemini-3.5-flash-lite"
                ? "bg-indigo-950/40 border-indigo-500 text-white"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Google Gemini 3.5 Flash Lite</span>
                <input 
                  type="radio" 
                  name="model" 
                  checked={modelChoice === "gemini-3.5-flash-lite"} 
                  onChange={() => setModelChoice("gemini-3.5-flash-lite")}
                  className="accent-indigo-500" 
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Ultra-low latency inference (sub-500ms) with lightweight token overhead.
              </p>
            </label>
          </div>
        </div>

        {/* Security and API Key Configuration */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key size={16} className="text-amber-400" />
            AI Provider Credentials (Optional Override)
          </h2>
          <p className="text-xs text-slate-400">
            By default, system uses the workspace server environment key (`GEMINI_API_KEY`). You may supply a custom BYOK (Bring Your Own Key) for this tenant.
          </p>

          <input
            type="password"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="AIzaSy... (Leave empty to use cluster defaults)"
            className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
              <Check size={14} /> Preferences updated successfully!
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Save size={15} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
