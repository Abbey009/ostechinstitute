import { NextRequest, NextResponse } from "next/server";

// List of protected admin routes
const protectedRoutes = ["/admin"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("__session")?.value; // Firebase sets __session cookie if configured

  const url = req.nextUrl;

  // Protect all admin routes
  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!token) {
      url.pathname = "/login"; // redirect to login if not authenticated
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // apply middleware to all admin paths
};
