import { SignIn } from "@clerk/nextjs";

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function SignInPage() {
  if (!hasClerkKey) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Dev Environment Notice</h2>
          <p className="text-xs text-slate-400">
            Clerk publishable key is not set in `.env`. You can proceed directly to the dashboard in local demo mode.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            Enter Dashboard Directly →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <SignIn />
    </div>
  );
}
