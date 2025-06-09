import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // List of paths that are accessible to unauthenticated users
  const publicPaths = [
    "/welcome",
    "/auth/signin",
    "/auth/signup",
    "/auth/verify-email",
  ];
  // Check if the current path is a public path
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Case 1: User is NOT authenticated
  if (!session) {
    // If trying to access a non-public path, redirect to /welcome
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/welcome", request.url));
    }
    // Otherwise, allow access to public paths
    return response;
  }

  // Case 2: User IS authenticated
  if (session) {
    // If trying to access a public path, redirect to /goals
    if (isPublicPath) {
      return NextResponse.redirect(new URL("/goals", request.url));
    }
    // Otherwise, allow access to authenticated paths
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (if you have one and want to exclude it)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
