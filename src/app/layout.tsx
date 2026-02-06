import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/components/AuthProvider";
import { ToastProvider } from "@/context/ToastContext";
import { Outfit } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: "Skrooge - Australia's Best Deal Aggregator",
  description: "Find the best deals across all major Australian retailers. Track prices, get alerts, and never miss a bargain again.",
  keywords: ["deals", "bargains", "Australia", "price tracking", "shopping", "discounts", "Skrooge"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} dark`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('skrooge-theme') || 'dark';
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <Sidebar />
              {/* Mobile: add top padding for fixed header. Desktop: add left margin for sidebar */}
              <main className="pt-16 lg:pt-0 lg:ml-64 min-h-screen transition-all duration-300">
                {/* Global Search Bar - Fixed height to match sidebar */}
                <div className="sticky top-16 lg:top-0 z-30 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-color)] px-4 sm:px-6 h-[88px] flex items-center">
                  <SearchBar />
                </div>
                {children}
              </main>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
