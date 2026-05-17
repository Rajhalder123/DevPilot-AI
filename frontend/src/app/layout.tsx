import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "DevPilot AI — Land Your Dream Developer Role with AI",
  description: "The ultimate AI-powered career platform for developers. Optimize your resume for ATS, master system design interviews, and discover high-paying jobs tailored to your GitHub patterns.",
  keywords: ["AI resume analyzer", "developer jobs", "ATS optimization", "mock interviews", "system design preparartion", "GitHub portfolio audit", "DevPilot AI"],
  authors: [{ name: "DevPilot Team", url: "https://devpilot-ai.com" }],
  robots: "index, follow",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "DevPilot AI — Land Your Dream Developer Role with AI",
    description: "The ultimate AI-powered career platform for developers. Optimize your resume for ATS, master system design interviews, and discover high-paying jobs.",
    type: "website",
    siteName: "DevPilot AI",
    locale: "en_US",
    url: "https://devpilot-ai.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPilot AI — Land Your Dream Developer Role with AI",
    description: "The ultimate AI-powered career platform for developers. Optimize your resume for ATS and land better jobs faster.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
