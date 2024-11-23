import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {
  LOGIN,
  PROTECTED_ADMIN_ROUTES,
  PROTECTED_SUB_ROUTES,
  PUBLIC_ROUTES,
  ROOT,
  ROOT_AUTH,
} from "./lib/settings";
import { auth } from "./auth";

// Middleware to handle route protection
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "ADMIN";

  // Check if the route is in PUBLIC_ROUTES
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is in PROTECTED_SUB_ROUTES
  const isProtectedRoute = PROTECTED_SUB_ROUTES.some((route) =>
    new RegExp(`^${route}`).test(pathname)
  );

  const isProtectedAdminRoute = PROTECTED_ADMIN_ROUTES.some((route) =>
    new RegExp(`^${route}`).test(pathname)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(LOGIN, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && pathname === LOGIN) {
    const rootAuthUrl = new URL(ROOT_AUTH, request.url);
    return NextResponse.redirect(rootAuthUrl);
  }

  if (isAuthenticated && isProtectedAdminRoute && !isAdmin) {
    const rootAuthUrl = new URL(ROOT_AUTH, request.url);
    return NextResponse.redirect(rootAuthUrl);
  }

  if (pathname === "/") {
    const rootUrl = isAuthenticated
      ? new URL(ROOT_AUTH, request.url)
      : new URL(ROOT, request.url);
    return NextResponse.redirect(rootUrl);
  }

  // console.log("pathname => ", pathname);
  // console.log("isProtectedRoute => ", isProtectedRoute);
  // console.log("isAuthenticated => ", isAuthenticated);
  // console.log("||||||||||||||||||||||||||||||||||||||||||||||||");

  // Allow request to continue
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
