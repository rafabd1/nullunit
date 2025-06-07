import "@/styles/globals.css";
import "prism-themes/themes/prism-one-dark.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/navbar";
import { Inter } from 'next/font/google';
import { AuthProvider } from "@/providers/auth-provider";
import { type ReactNode } from "react";

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
        className={`${inter.variable} min-h-screen font-sans antialiased`}
      >
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
      </body>
    </html>
  );
}
