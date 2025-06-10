import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Target,
  Trophy,
  Heart,
  Star,
  Coffee,
} from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-[#FFF9F5] to-orange-50/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-600 mb-8">
              <Coffee className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">
                Your cozy bucket list companion
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 text-gray-800">
              Make Your Dreams
              <span className="text-orange-500"> Come True</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Create, track, and achieve your bucket list goals in a warm and
              friendly space. Let&apos;s make your dreams a reality, one step at
              a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-orange-200 text-orange-600 font-medium hover:bg-orange-50 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
              <Target className="h-7 w-7 text-orange-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">
              Set Your Goals
            </h3>
            <p className="text-gray-600">
              Create and organize your bucket list items with ease. Add details,
              deadlines, and track your progress in a cozy environment.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
              <Sparkles className="h-7 w-7 text-orange-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">
              Get Inspired
            </h3>
            <p className="text-gray-600">
              Discover new ideas and experiences from our warm community. Find
              inspiration for your next adventure.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-md">
            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
              <Trophy className="h-7 w-7 text-orange-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Celebrate your achievements and stay motivated with our friendly
              progress tracking features.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-white/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-600 mb-4">
              <Heart className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">
                Loved by dreamers worldwide
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Join Our Cozy Community
            </h2>
            <p className="text-gray-600">
              People are already achieving their bucket list goals with Livo
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-500 font-semibold text-lg">
                    JD
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">John Doe</h4>
                  <p className="text-sm text-gray-600">Travel Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-600">
                &quot;Livo helped me organize my travel goals and I&apos;ve
                already crossed off 5 destinations from my list! The interface
                is so warm and inviting.&quot;
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-500 font-semibold text-lg">
                    AS
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Alice Smith</h4>
                  <p className="text-sm text-gray-600">Adventure Seeker</p>
                </div>
              </div>
              <p className="text-gray-600">
                &quot;The progress tracking feature keeps me motivated to
                achieve my goals. Love the cozy, friendly design!&quot;
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white border-2 border-orange-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-500 font-semibold text-lg">
                    RJ
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">
                    Robert Johnson
                  </h4>
                  <p className="text-sm text-gray-600">Lifelong Learner</p>
                </div>
              </div>
              <p className="text-gray-600">
                &quot;Finally found a platform that helps me organize my
                learning goals in such a warm and welcoming way.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl p-12 text-center shadow-xl">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white mb-6">
            <Star className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">
              Ready to start your journey?
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            Begin Your Adventure Today
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join our warm community of dreamers and start turning your bucket
            list into reality. We&apos;re here to make it cozy and fun!
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-orange-500 font-medium hover:bg-orange-50 transition-all shadow-lg hover:shadow-white/30"
          >
            Create Your Bucket List
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
