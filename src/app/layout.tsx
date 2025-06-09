import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { createClient } from "@/lib/supabaseServer";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import { registerServiceWorker } from "./service-worker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livo - Your Personal Life Goals & Travel Tracker",
  description:
    "Track your life goals and travel experiences in one beautiful app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#F97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== "undefined") {
    registerServiceWorker();
  }

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Livo" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <SupabaseProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
