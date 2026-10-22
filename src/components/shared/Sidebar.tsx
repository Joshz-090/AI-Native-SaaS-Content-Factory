"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PenTool, 
  Calendar, 
  Settings, 
  BarChart3,
  Users,
  Shield,
  Layers,
  Sparkles,
  FileText
} from "lucide-react";
import { OrganizationSwitcher } from "@clerk/nextjs";

const routes = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Content Factory",
    icon: PenTool,
    href: "/dashboard/content",
    badge: "AI",
  },
  {
    label: "Studio Editor",
    icon: FileText,
    href: "/dashboard/editor",
  },
  {
    label: "Scheduler",
    icon: Calendar,
    href: "/dashboard/scheduler",
  },
  {
    label: "Analytics & Quotas",
    icon: BarChart3,
    href: "/dashboard/analytics",
  },
  {
    label: "Team & Tenants",
    icon: Users,
    href: "/dashboard/admin",
  },
  {
    label: "Configuration",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full bg-slate-900 text-slate-200 w-64 border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              Content Factory
            </h1>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400">
              Enterprise AI Core
            </p>
          </div>
        </Link>
      </div>
      
      {/* Organization Switcher */}
      <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/50">
        {hasClerkKey ? (
          <OrganizationSwitcher 
            appearance={{
              elements: {
                rootBox: "w-full",
                organizationSwitcherTrigger: "w-full bg-slate-800/80 hover:bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700/60 text-xs",
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700/50 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <Layers size={14} className="text-indigo-400 shrink-0" />
              <div className="truncate">
                <p className="font-medium text-slate-200 truncate">Acme Global Media</p>
                <p className="text-[10px] text-slate-400">RLS Tenant #001</p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Workflows & Orchestration
        </p>
        {routes.map((route) => {
          const isActive = pathname === route.href || (route.href !== "/dashboard" && pathname?.startsWith(route.href));
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`
                group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 font-semibold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'}
              `}
            >
              <div className="flex items-center gap-3">
                <route.icon 
                  size={17} 
                  className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'} 
                />
                <span>{route.label}</span>
              </div>
              {route.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                  {route.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Security Status Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/40 text-[11px]">
          <Shield size={16} className="text-cyan-400 shrink-0" />
          <div className="overflow-hidden">
            <p className="font-medium text-slate-200">RLS & DLP Active</p>
            <p className="text-[10px] text-slate-400">Zero PII Leakage Guard</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
