import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const userRole = token?.role;

    if (path === "/dashboard" && userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (path.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*", 
    "/checkout", 
    "/profile/:path*", 
    "/dashboard/:path*",
    "/dashboard" 
  ],
};