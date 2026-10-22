import { Sidebar } from "@/components/shared/Sidebar";
import { UserButton } from "@clerk/nextjs";

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        <header className="h-16 flex items-center justify-between px-8 bg-slate-900/80 backdrop-blur border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-400">
              Cluster: <span className="text-slate-200 font-mono">us-east-prod-1</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-medium">
              <span>Tenant Credits:</span>
              <span className="font-mono font-bold text-indigo-200">24,500</span>
            </div>

            {hasClerkKey ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20">
                  AD
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-200">Admin Staff</p>
                  <p className="text-[10px] text-slate-400">Enterprise Admin</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 bg-slate-950 text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}
