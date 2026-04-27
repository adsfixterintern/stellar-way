import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl;
    if (!url) return NextResponse.next();

    const pathname = url.pathname;

    const token = req.nextauth?.token;
    const userRole = token?.role;

    // =========================
    // PUBLIC ROUTES (NO AUTH REQUIRED)
    // =========================
    const publicRoutes = [
      "/",
      "/menu",
      "/login",
      "/register",
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      pathname === route || pathname.startsWith(route)
    );

    if (isPublicRoute) {
      return NextResponse.next();
    }

    // =========================
    // PROTECTED ROUTES CHECK
    // =========================
    const protectedRoutes = [
      "/admin",
      "/rider",
      "/dashboard",
      "/profile",
      "/checkout",
      "/apply-rider",
    ];

    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // 🔥 ONLY REDIRECT IF REALLY NO TOKEN + PROTECTED ROUTE
    if (isProtected && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // =========================
    // ROLE BASED CONTROL
    // =========================
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/rider") && userRole !== "rider") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname === "/dashboard") {
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }

      if (userRole === "rider") {
        return NextResponse.redirect(new URL("/rider", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/rider/:path*",
    "/checkout",
    "/profile/:path*",
    "/dashboard/:path*",
    "/apply-rider",
  ],
};
