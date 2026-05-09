import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "DevPilot AI — Free AI Career Platform for Students & Developers",
  description: "Analyze your resume, review GitHub repos, practice interviews with AI, and find jobs — all free. Built for students who dream big.",
  keywords: ["AI resume analyzer", "mock interview", "github reviewer", "job matching", "career platform", "students", "developers"],
  openGraph: {
    title: "DevPilot AI — Your AI Career Copilot",
    description: "Free AI-powered career platform for students. Resume analysis, interview prep, GitHub reviews & job matching.",
    type: "website",
    siteName: "DevPilot AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPilot AI — Free AI Career Platform",
    description: "Resume analysis, mock interviews, GitHub reviews & job matching — all powered by AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen selection:bg-blue-500/30" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
