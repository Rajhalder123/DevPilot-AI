import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "DevPilot AI — Land Better Developer Jobs Faster",
  description: "Build Your Developer Career with AI. Analyze resumes, improve ATS scores, prepare for interviews, and discover AI-powered job opportunities tailored for developers.",
  keywords: ["AI resume analyzer", "mock interview", "github reviewer", "job matching", "career platform", "students", "developers"],
  openGraph: {
    title: "DevPilot AI — Land Better Developer Jobs Faster",
    description: "Build Your Developer Career with AI. Analyze resumes, improve ATS scores, prepare for interviews, and discover AI-powered job opportunities tailored for developers.",
    type: "website",
    siteName: "DevPilot AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPilot AI — Land Better Developer Jobs Faster",
    description: "Build Your Developer Career with AI. Analyze resumes, improve ATS scores, prepare for interviews, and discover AI-powered job opportunities tailored for developers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, "font-sans")}>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen selection:bg-indigo-500/30" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
