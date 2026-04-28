import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl;
    const pathname = url.pathname;
    const token = req.nextauth?.token;
    const userRole = token?.role;

    if (token?.error === "RoleChanged") {
      return NextResponse.redirect(new URL("/login", req.url));
    }


    const publicRoutes = ["/", "/menu", "/login", "/register"];
    const isPublicRoute = publicRoutes.some(
      (route) =>
        pathname === route || (route !== "/" && pathname.startsWith(route)),
    );

    if (isPublicRoute) {
      return NextResponse.next();
    }

  
    const protectedRoutes = [
      "/rider",
      "/dashboard",
      "/profile",
      "/checkout",
      "/apply-rider",
      "/event-pay",
      "/reservation/table-pay", 
    ];

    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );


    if (isProtected && !token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname); 
      return NextResponse.redirect(loginUrl);
    }


    if (pathname.startsWith("/rider") && userRole !== "rider") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/dashboard") && userRole === "rider") {
      return NextResponse.redirect(new URL("/rider", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: [
    "/rider/:path*",
    "/checkout",
    "/profile/:path*",
    "/dashboard/:path*",
    "/apply-rider",
    "/event-pay",
    "/reservation/:path*",
  ],
};
