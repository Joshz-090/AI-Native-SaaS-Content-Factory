"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Share2, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  ArrowUpRight
} from "lucide-react";

export default function SchedulerPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPlatform, setNewPlatform] = useState("LinkedIn");
  const [newPreview, setNewPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  async function fetchSchedules() {
    try {
      const res = await fetch("/api/schedules");
      if (res.ok) {
        const data = await res.json();
        setSchedules(data.schedules || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          platform: newPlatform,
          preview: newPreview.trim() || newTitle.trim(),
        }),
      });

      if (res.ok) {
        await fetchSchedules();
        setIsModalOpen(false);
        setNewTitle("");
        setNewPreview("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Distribution Engine
            </span>
            <span className="text-xs text-slate-400">Automated Webhooks & Multi-Account Broadcast</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">
            Publishing Calendar & Schedule
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Coordinate multi-platform dissemination with automated release cadences and audit logging.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all self-start sm:self-center"
        >
          <Plus size={16} />
          <span>Schedule Post</span>
        </button>
      </div>

      {/* Schedule Items List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CalendarIcon size={16} className="text-indigo-400" />
            Queued Broadcasts ({schedules.length})
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Timezone: UTC (Auto-Converted)</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {schedules.map((item) => (
            <div key={item.id} className="p-5 hover:bg-slate-850 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.platform === "LinkedIn" 
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : item.platform === "Twitter/X"
                        ? "bg-slate-800 text-slate-300 border border-slate-700"
                        : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  }`}>
                    {item.platform}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock size={12} />
                    {new Date(item.scheduledFor).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight truncate">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.preview}
                </p>

                <p className="text-[10px] text-slate-500">
                  Initiated by <span className="text-slate-400 font-medium">{item.author}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  item.status === "SCHEDULED" 
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : item.status === "PUBLISHED"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {item.status}
                </span>

                <button 
                  onClick={() => alert(`Broadcasting payload to ${item.platform} webhook sandbox...`)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" 
                  title="Trigger Test Distribution"
                >
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-white">Schedule AI Broadcast</h3>

            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Campaign / Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Q4 Thought Leadership Drop"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Distribution Destination</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="LinkedIn">LinkedIn (Corporate Page & Executive Handles)</option>
                  <option value="Twitter/X">Twitter/X (Brand Account)</option>
                  <option value="Substack">Substack (Enterprise Digest)</option>
                  <option value="Internal Newsletter">Internal Slack / Email Newsletter</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Content Snippet</label>
                <textarea
                  value={newPreview}
                  onChange={(e) => setNewPreview(e.target.value)}
                  rows={3}
                  placeholder="Paste or write the post body here..."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  {isSubmitting ? "Queueing..." : "Add to Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
