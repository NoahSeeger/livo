"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Target, Settings } from "lucide-react";
import { useSupabase } from "./providers/SupabaseProvider";

export default function Navigation() {
  const pathname = usePathname();
  const { supabase, session } = useSupabase();

  const isActive = (path: string) => pathname === path;

  if (!session) return null;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-surface shadow-sm relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Livo
            </Link>

            <div className="flex items-center space-x-6">
              <Link
                href="/goals"
                className={`text-sm font-medium transition-colors ${
                  isActive("/goals")
                    ? "text-orange-500"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                Goals
              </Link>
              <Link
                href="/travel"
                className={`text-sm font-medium transition-colors ${
                  isActive("/travel")
                    ? "text-orange-500"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                Travel Map
              </Link>
              <Link
                href="/settings"
                className={`text-sm font-medium transition-colors ${
                  isActive("/settings")
                    ? "text-orange-500"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive("/")
                ? "text-orange-500"
                : "text-gray-600 hover:text-orange-500"
            }`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            href="/goals"
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive("/goals")
                ? "text-orange-500"
                : "text-gray-600 hover:text-orange-500"
            }`}
          >
            <Target size={24} />
            <span className="text-xs mt-1">Goals</span>
          </Link>

          <Link
            href="/travel"
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive("/travel")
                ? "text-orange-500"
                : "text-gray-600 hover:text-orange-500"
            }`}
          >
            <Map size={24} />
            <span className="text-xs mt-1">Travel</span>
          </Link>

          <Link
            href="/settings"
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive("/settings")
                ? "text-orange-500"
                : "text-gray-600 hover:text-orange-500"
            }`}
          >
            <Settings size={24} />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Add padding to the bottom of the content on mobile to account for the fixed navigation */}
      {/* <div className="md:hidden pb-16" /> */}
    </>
  );
}
