"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  TrendingUp,
  Activity
} from "lucide-react";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [analyticsRes, jobsRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/jobs"),
        ]);
        
        if (analyticsRes.ok) {
          const aData = await analyticsRes.json();
          setStats(aData.data);
        }

        if (jobsRes.ok) {
          const jData = await jobsRes.json();
          setRecentJobs(jData.jobs || []);
        }
      } catch (err) {
        console.error("Dashboard overview data loading error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-900/40 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Staff Engine Active
            </span>
            <span className="text-xs text-slate-400">PostgreSQL RLS • BullMQ Worker Pool</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Operational Overview & Telemetry
          </h1>
          <p className="text-slate-400 text-xs max-w-2xl">
            Real-time multi-tenant observability, token-bucket budget allocation, and generative automation across your enterprise workspace.
          </p>
        </div>

        <Link
          href="/dashboard/content"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 shrink-0 self-start md:self-center transition-all"
        >
          <Sparkles size={15} />
          <span>Launch Content Factory</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Credits Remaining</span>
            <Layers size={16} className="text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {stats?.quotaRemaining?.toLocaleString() || "49,000"}
            </span>
            <span className="text-xs text-slate-500">/ 50,000</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-1.5 rounded-full" 
              style={{ width: `${100 - (stats?.quotaUsedPercentage || 2)}%` }} 
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Generations Completed</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {stats?.completedGenerations || "24"}
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> 98.4% success
            </span>
          </div>
          <p className="text-[11px] text-slate-500">0 dropped jobs in BullMQ</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Avg Synthesis Latency</span>
            <Clock size={16} className="text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {stats?.averageLatencyMs || "1,420"}
            </span>
            <span className="text-xs text-slate-500">ms</span>
          </div>
          <p className="text-[11px] text-slate-500">P99: 2,310ms across workers</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">DLP / Injections Filtered</span>
            <ShieldAlert size={16} className="text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {stats?.securityEventsBlocked || "3"}
            </span>
            <span className="text-xs text-amber-400 font-medium">Blocked</span>
          </div>
          <p className="text-[11px] text-slate-500">PII auto-masked before inference</p>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs Feed */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={17} className="text-indigo-400" />
              <h2 className="text-base font-bold text-white">Recent Generative Pipelines</h2>
            </div>
            <Link 
              href="/dashboard/content" 
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              New Job <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {recentJobs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs space-y-2">
                <p>No jobs triggered yet in this session.</p>
                <Link
                  href="/dashboard/content"
                  className="inline-block px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 font-semibold"
                >
                  Create Your First Post
                </Link>
              </div>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {job.result?.headline || job.topic}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-slate-500">{job.id}</span>
                      <span className="text-[10px] text-slate-400">• {job.tone || "Executive"}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    job.status === "COMPLETED" 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : job.status === "PROCESSING"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & System Health */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu size={16} className="text-cyan-400" />
              Infrastructure Topology
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Database Engine</span>
                <span className="font-mono text-emerald-400 font-medium">PostgreSQL (RLS)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Queue Broker</span>
                <span className="font-mono text-indigo-400 font-medium">BullMQ + Redis</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Telemetry</span>
                <span className="font-mono text-purple-400 font-medium">OpenTelemetry OTLP</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Auth & Tenancy</span>
                <span className="font-mono text-amber-400 font-medium">Clerk Multi-Org</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 shadow-md space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Need Content Scheduled?
            </h4>
            <p className="text-xs text-slate-400">
              Easily plan publication cadence across multiple executive social handles and company channels.
            </p>
            <Link
              href="/dashboard/scheduler"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Open Publishing Calendar <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
