"use client";
import type React from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from "@/components/i18n-provider";
import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-r from-green-100 to-[#F4E1C1] dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider>
            {children}
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
