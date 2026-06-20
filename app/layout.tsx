import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANCOP Scholar Portal",
  description: "Scholar submission and management system",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#258646",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PH">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        {children}

        {/* Global Toast System */}
        <Toaster
          richColors
          position="top-right"
          expand={false}
          closeButton
          toastOptions={{
            style: {
              borderRadius: "10px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}