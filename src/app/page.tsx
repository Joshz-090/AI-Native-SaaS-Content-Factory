import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Gauge, 
  CheckCircle2, 
  Terminal,
  Activity,
  Calendar,
  Lock
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-850">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-white text-base tracking-tight">
              Content Factory
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Enterprise v1.0
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5"
            >
              Telemetry
            </Link>
            <Link
              href="/dashboard/content"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
            >
              <span>Launch App</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-6 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs font-medium shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Multi-Tenant Staff Architecture • Zero Data Leakage</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Enterprise AI Content Automation at Scale
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate the &ldquo;noisy neighbor&rdquo; problem with deterministic PostgreSQL Row-Level Security, distributed BullMQ asynchronous workers, and token-bucket budget governance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard/content"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all"
            >
              <Sparkles size={17} />
              <span>Enter Content Factory</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-semibold text-sm transition-all shadow-sm"
            >
              <Activity size={16} className="text-indigo-400" />
              <span>View System Telemetry</span>
            </Link>
          </div>
        </div>

        {/* Live System Preview Frame */}
        <div className="relative max-w-5xl mx-auto mt-16 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-4 md:p-6 backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs font-mono text-slate-500 ml-2">factory-orchestrator.cluster.internal</span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              Workers: Online (32 nodes)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                <Cpu size={14} />
                <span>Async Job Queue</span>
              </div>
              <p className="text-xs text-slate-300">BullMQ + Redis broker handling exponential backoff and retries without HTTP timeouts.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                <Lock size={14} />
                <span>Hard Isolation (RLS)</span>
              </div>
              <p className="text-xs text-slate-300">PostgreSQL engine-level partitioning by organization_id physically guards cross-tenant data.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Gauge size={14} />
                <span>Atomic Quotas</span>
              </div>
              <p className="text-xs text-slate-300">Redis-backed Token Bucket guarantees budget containment and model cost attribution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 px-6 bg-slate-900/50 border-t border-slate-850">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Staff-Level Architectural Principles
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Moving beyond fragile prototype wrappers into an observable, fault-tolerant enterprise platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-white">DLP & Safety Filtering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated regex PII masking and prompt injection shields scrub sensitive organizational data prior to upstream LLM inference.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Calendar size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Broadcast Scheduling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Schedule and audit multi-channel releases across LinkedIn, Twitter/X, and internal communications with automated webhooks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Activity size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Full-Stack Observability</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                End-to-end distributed tracing via OpenTelemetry SDK measures P50, P90, and P99 synthesis latencies across worker nodes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 border-t border-slate-850 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AI-Native SaaS Content Factory. Enterprise Architecture Blueprint.</p>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-300">Dashboard</Link>
            <Link href="/dashboard/content" className="hover:text-slate-300">Content Factory</Link>
            <Link href="/dashboard/scheduler" className="hover:text-slate-300">Scheduler</Link>
            <Link href="/dashboard/analytics" className="hover:text-slate-300">Analytics</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
