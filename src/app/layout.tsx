import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/components/AuthProvider";

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
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
            <Sidebar />
            {/* Mobile: add top padding for fixed header. Desktop: add left margin for sidebar */}
            <main className="pt-16 lg:pt-0 lg:ml-64 min-h-screen transition-all duration-300">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
