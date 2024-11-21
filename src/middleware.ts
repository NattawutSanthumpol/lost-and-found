import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOGIN,
  PROTECTED_SUB_ROUTES,
  PUBLIC_ROUTES,
  ROOT,
} from "./lib/settings";
import { auth } from "./auth";
import { getToken } from "next-auth/jwt";

// Middleware to handle route protection
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const isAuthenticated = !!session?.user;
  // const tokenUser = await getToken({
  //   req: request,
  //   secret: process.env.AUTH_SECRET,
  // });
  // console.log("getToken User => ", user);
  // console.log("isAuthenticated => ", isAuthenticated, pathname);
  // console.log("session => ", session);

  // Check if the route is in PUBLIC_ROUTES
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // console.log("isPublicRoute => ", isPublicRoute);

  // Check if the route is in PROTECTED_SUB_ROUTES
  const isProtectedRoute = PROTECTED_SUB_ROUTES.some((route) =>
    new RegExp(`^${route}`).test(pathname)
  );

  // console.log("isProtectedRoute => ", isProtectedRoute);

  // If the user tries to access a protected route without a token, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(LOGIN, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is logged in and tries to access the login page, redirect to the root page
  if (isPublicRoute && isAuthenticated && pathname === LOGIN) {
    const rootUrl = new URL(ROOT, request.url);
    return NextResponse.redirect(rootUrl);
  }

  // Allow request to continue
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
