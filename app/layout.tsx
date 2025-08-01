import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google'
import { GeistSans } from 'geist/font/sans';
import "./globals.css";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Text Underlay",
  description: "Create text underlay designs",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className} suppressHydrationWarning>
        <SupabaseProvider>
            <UserProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <div>
                  {children}
                  <Analytics />
                  <SpeedInsights />
                  <Toaster />
                </div>
              </ThemeProvider>
            </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
