import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  // -------------------------
  // NOT LOGGED IN GUARD
  // -------------------------
  const protectedRoutes = [ "/admin", "/scholar"];

  if (!user && protectedRoutes.some((p) => path.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // -------------------------
  // PUBLIC ROUTES BLOCK
  // -------------------------
  if (user && path === "/login") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return res;
}

// IMPORTANT: matcher must be included
export const config = {
  matcher: ["/admin/:path*", "/scholar/:path*", "/login"],
};