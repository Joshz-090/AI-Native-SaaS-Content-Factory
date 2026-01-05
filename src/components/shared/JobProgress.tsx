"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Clock 
} from "lucide-react";

interface JobProgressProps {
  jobId: string;
  onComplete?: () => void;
}

export function JobProgress({ jobId, onComplete }: JobProgressProps) {
  const [status, setStatus] = useState<"PENDING" | "PROCESSING" | "COMPLETED" | "FAILED">("PENDING");
  const [progress, setProgress] = useState(0);

  // In a real app, this would be a WebSocket listener (Pusher/Socket.io)
  // For this MVP, we'll demonstrate the smart polling pattern
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Mock API call to fetch job status
        // const res = await fetch(`/api/jobs/${jobId}`);
        // const data = await res.json();
        
        // Mock progress simulation for the demo
        setProgress((prev) => {
          if (prev >= 90 && status === "PROCESSING") return 90;
          return prev + 10;
        });

        if (progress >= 30) setStatus("PROCESSING");
        if (progress >= 100) {
          setStatus("COMPLETED");
          clearInterval(interval);
          onComplete?.();
        }
      } catch (error) {
        setStatus("FAILED");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, progress, status, onComplete]);

  const statusConfig = {
    PENDING: { color: "text-slate-500", icon: Clock, label: "Queued" },
    PROCESSING: { color: "text-indigo-600", icon: Loader2, label: "Synthesizing AI Content..." },
    COMPLETED: { color: "text-emerald-600", icon: CheckCircle2, label: "Generation Complete" },
    FAILED: { color: "text-rose-600", icon: AlertCircle, label: "Generation Failed" },
  };

  const Config = statusConfig[status];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Config.icon className={`${status === "PROCESSING" ? "animate-spin" : ""} ${Config.color}`} size={20} />
          <span className="font-medium text-slate-900">{Config.label}</span>
        </div>
        <span className="text-sm font-semibold text-slate-500">{progress}%</span>
      </div>
      
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${status === "FAILED" ? "bg-rose-500" : "bg-indigo-600"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-xs text-slate-400">
        Job ID: <span className="font-mono">{jobId}</span>
      </p>
    </div>
  );
}
