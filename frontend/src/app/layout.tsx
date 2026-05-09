import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });

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
    <html lang="en" suppressHydrationWarning className={cn(outfit.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen selection:bg-blue-500/30" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
