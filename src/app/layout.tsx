import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "AI-Native SaaS Content Factory",
  description: "Enterprise-grade multi-tenant AI content automation and orchestration platform.",
};

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyContent = (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );

  if (hasClerkKey) {
    return <ClerkProvider>{bodyContent}</ClerkProvider>;
  }

  return bodyContent;
}
