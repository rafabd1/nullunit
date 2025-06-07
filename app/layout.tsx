import "@/styles/globals.css";
import "prism-themes/themes/prism-one-dark.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/navbar";
import { Inter } from 'next/font/google';
import { AuthProvider } from "@/providers/auth-provider";
import { type ReactNode } from "react";
import { OrbitalBackground } from '@/components/layout/orbital-background';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning lang="en" className="dark">
      <head />
      <body
        className={`${inter.variable} relative min-h-screen font-sans antialiased overflow-x-hidden`}
      >
        {/* Background container: positioned absolutely, behind the content */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <OrbitalBackground />
          <div
            className="absolute bottom-0 left-0 h-[1400px] w-[1400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-muted-foreground/5 blur-3xl"
            aria-hidden="true"
          />
        </div>

        {/* Main content container: positioned relatively to sit on top */}
        <div className="relative">
          <AuthProvider>
            <div className="px-6 pt-3 pb-6 md:px-8 md:pt-4 md:pb-8 lg:px-12 lg:pt-6 lg:pb-12">
              <div className="mx-auto w-full max-w-screen-2xl rounded-xl border border-border bg-panel/30">
                <Navbar />
                <main className="p-4 sm:p-6 lg:p-8">
                  {children}
                </main>
              </div>
            </div>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
