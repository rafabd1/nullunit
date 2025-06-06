import "@/styles/globals.css";
import "prism-themes/themes/prism-one-dark.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/navbar";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className={inter.className}>
      <head />
      <body className="bg-background text-foreground antialiased">
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/path-to-your-background-pattern.svg')] bg-repeat opacity-5 z-0" />
          
          <div className="relative flex flex-col items-center min-h-screen z-10">
            <div className="w-full max-w-7xl mx-auto flex flex-col flex-grow">
              <Navbar />
              <main className="flex-grow pt-16">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
