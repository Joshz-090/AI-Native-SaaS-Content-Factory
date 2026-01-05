"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { JobProgress } from "@/components/shared/JobProgress";

export default function ContentFactoryPage() {
  const [topic, setTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setIsSubmitting(true);
    
    // In a real app, this would call a Server Action
    // const jobId = await createContentJob(topic);
    
    // Simulation for demo
    setTimeout(() => {
      setActiveJobId("job_" + Math.random().toString(36).substr(2, 9));
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Content Factory</h1>
        <p className="text-slate-500 mt-2">Generate high-quality enterprise content from a single topic input.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="topic" className="text-sm font-semibold text-slate-700">
              What should we write about today?
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The impact of Generative AI on Enterprise Cybersecurity in 2026..."
              className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !!activeJobId}
            className={`
              w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all
              ${isSubmitting || !!activeJobId ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'}
            `}
          >
            {isSubmitting ? (
              "Initializing Engine..."
            ) : (
              <>
                <Sparkles size={20} />
                Generate Enterprise Content
              </>
            )}
          </button>
        </form>
      </div>

      {activeJobId && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <JobProgress 
            jobId={activeJobId} 
            onComplete={() => console.log("Job Done!")}
          />
        </div>
      )}

      {!activeJobId && !isSubmitting && (
        <div className="grid grid-cols-3 gap-4">
          {[
            "Market Trends Q3",
            "Sustainability Report",
            "Product Launch: X1"
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setTopic(suggestion)}
              className="p-4 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors text-left border border-slate-200"
            >
              Suggest: <span className="font-semibold">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
