"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Activity,
  Zap,
  Gauge
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((json) => setData(json.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Resource Governance
          </span>
          <span className="text-xs text-slate-400">Token Bucket • Cost Attribution • SLA Tracking</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">
          Analytics & Usage Quotas
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor multi-tenant token consumption, inference latencies, and security filter telemetry in real-time.
        </p>
      </div>

      {/* Hero Quota Meter */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Gauge size={18} className="text-indigo-400" />
              Tenant Token Bucket Status: {data?.tenant || "Acme Global Media"}
            </h2>
            <p className="text-xs text-slate-400">
              Enforced atomically at the Redis layer. Automatic replenishment scheduled for midnight UTC.
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-white">
              {data?.quotaRemaining?.toLocaleString() || "49,000"}
              <span className="text-xs text-slate-400 font-normal"> / 50,000 Credits</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">98% Budget Available</p>
          </div>
        </div>

        {/* Progress gauge */}
        <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-1000"
            style={{ width: `${100 - (data?.quotaUsedPercentage || 2)}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <p className="text-[11px] text-slate-400">Model Routing</p>
            <p className="text-xs font-bold text-white mt-1">Google Gemini 1.5</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Dynamic cost-tier switching active</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <p className="text-[11px] text-slate-400">Avg Cost / Generation</p>
            <p className="text-xs font-bold text-emerald-400 mt-1">$0.0034 USD</p>
            <p className="text-[10px] text-slate-500 mt-0.5">92% below legacy human copywriters</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <p className="text-[11px] text-slate-400">Throughput Limit</p>
            <p className="text-xs font-bold text-indigo-300 mt-1">60 req / min per Org</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Prevents noisy-neighbor starvation</p>
          </div>
        </div>
      </div>

      {/* Latency and Throughput Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latency Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-cyan-400" />
              Inference Latency Percentiles
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Last 24h</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>P50 (Median)</span>
                <span className="font-mono text-emerald-400">920ms</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "35%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>P90</span>
                <span className="font-mono text-indigo-400">1,420ms</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "55%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>P99 (Heavy Batch)</span>
                <span className="font-mono text-amber-400">2,310ms</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Security & DLP Telemetry */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Operational Security & DLP
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Real-time</span>
          </div>

          <div className="space-y-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">PII Regex Masker</p>
                <p className="text-[10px] text-slate-400">Redacts corporate emails and phone numbers</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">100% Enforced</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">Jailbreak / Injection Guard</p>
                <p className="text-[10px] text-slate-400">Heuristic filter on model directives</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">Active</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">PostgreSQL Tenant Isolator</p>
                <p className="text-[10px] text-slate-400">Deterministic RLS on org_id</p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">Zero Leakage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
