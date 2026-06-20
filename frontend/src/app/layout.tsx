import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap"
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: "swap"
});

export const metadata: Metadata = {
  title: "DevPilot AI — Your AI Copilot for Building, Debugging and Creating Faster",
  description: "DevPilot AI helps developers write code, debug problems, understand technology, and ship projects faster. Your intelligent coding companion.",
  keywords: ["AI coding assistant", "developer tools", "code generation", "bug finder", "AI copilot", "DevPilot AI"],
  authors: [{ name: "DevPilot Team", url: "https://devpilot-ai.com" }],
  robots: "index, follow",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "DevPilot AI — Your AI Copilot for Building, Debugging and Creating Faster",
    description: "Write code, debug problems, and ship projects faster with your AI developer assistant.",
    type: "website",
    siteName: "DevPilot AI",
    locale: "en_US",
    url: "https://devpilot-ai.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPilot AI — Build Faster. Code Smarter. With AI.",
    description: "Write code, debug problems, and ship projects faster with your AI developer assistant.",
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
    <html lang="en" className={cn(inter.variable, outfit.variable, "dark")} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#050505] text-white min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
