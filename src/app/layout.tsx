import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { createClient } from "@/lib/supabaseServer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livo - Your Personal Life Goals & Travel Tracker",
  description:
    "Track your life goals and travel experiences in one beautiful app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background`}>
        {session && <Navigation />}
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
