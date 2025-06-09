"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.auth.signOut();
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <nav className="bg-surface shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl  font-bold text-primary hover:text-primary-dark transition-colors"
          >
            Livo
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/goals"
              className={`text-sm font-medium transition-colors ${
                pathname === "/goals"
                  ? "text-primary"
                  : "text-text-light hover:text-primary"
              }`}
            >
              Goals
            </Link>
            <Link
              href="/travel"
              className={`text-sm font-medium transition-colors ${
                pathname === "/travel"
                  ? "text-primary"
                  : "text-text-light hover:text-primary"
              }`}
            >
              Travel Map
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-text-light hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
