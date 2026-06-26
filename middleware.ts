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
          cookiesToSet.forEach(({ name, value }) => {
            res.cookies.set(name, value);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

 
  const protectedRoutes = ["/dashboard", "/admin", "/profile"];

  if (!user && protectedRoutes.some((p) => path.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }


  const publicRoutes = ["/login"];

  if (user && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }


  let role: "admin" | "scholar" | null = null;
  let mustChangePassword = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, must_change_password")
      .eq("id", user.id)
      .single();

    role = profile?.role ?? null;
    mustChangePassword = profile?.must_change_password ?? false;
  }


  if (user && mustChangePassword && path !== "/change-password") {
    return NextResponse.redirect(
      new URL("/change-password", req.url)
    );
  }



  // ADMIN ONLY ROUTES
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // SCHOLAR ONLY ACCESS TO DASHBOARD
  if (path.startsWith("/dashboard") && role === "admin") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return res;
}


export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/login",
    "/change-password",
  ],
};