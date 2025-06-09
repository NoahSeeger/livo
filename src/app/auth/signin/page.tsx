"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Coffee } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Force a hard navigation to ensure the session is set
      window.location.href = "/goals";
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-sans">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-[#FFF9F5] to-orange-50/30" />

        {/* Back to Home Link */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Sign In Form */}
        <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-600 mb-6">
              <Coffee className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Welcome back!</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Sign in to your account
            </h1>
            <p className="text-gray-600">
              Continue your journey towards achieving your dreams
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-orange-100">
            <form onSubmit={handleSignIn} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-orange-300 text-orange-500 focus:ring-orange-200"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-8 py-4 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200"
              >
                Sign in
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-orange-600 hover:text-orange-700"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
