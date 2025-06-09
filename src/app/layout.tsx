import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { createClient } from "@/lib/supabaseServer";
import SupabaseProvider from "@/components/providers/SupabaseProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livo - Your Personal Life Goals & Travel Tracker",
  description:
    "Track your life goals and travel experiences in one beautiful app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background`}>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
