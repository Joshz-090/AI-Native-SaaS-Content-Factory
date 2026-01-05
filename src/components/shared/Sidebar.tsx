"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PenTool, 
  Calendar, 
  Settings, 
  BarChart3,
  Users
} from "lucide-react";
import { OrganizationSwitcher } from "@clerk/nextjs";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Content Factory",
    icon: PenTool,
    href: "/dashboard/content",
  },
  {
    label: "Scheduler",
    icon: Calendar,
    href: "/dashboard/scheduler",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
  },
  {
    label: "Team Management",
    icon: Users,
    href: "/dashboard/admin",
    adminOnly: true,
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          AI Factory
        </h1>
      </div>
      
      <div className="px-4 py-2 border-b border-slate-800">
        <OrganizationSwitcher 
          appearance={{
            elements: {
              rootBox: "w-full",
              organizationSwitcherTrigger: "w-full bg-slate-800 text-white hover:bg-slate-700 px-3 py-2 rounded-md",
            }
          }}
        />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-md transition-colors
              ${pathname === route.href ? 'bg-indigo-600' : 'hover:bg-slate-800'}
            `}
          >
            <route.icon size={20} />
            <span>{route.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
