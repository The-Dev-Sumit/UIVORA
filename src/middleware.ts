import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE;

  console.log("[Middleware] Current NEXT_PUBLIC_DEV_MODE:", devMode);
  console.log("[Middleware] Request Pathname:", pathname);

  // Check for development mode to skip authentication FIRST
  if (devMode === "skip_auth") {
    console.log(
      "[Middleware] DEV_MODE IS 'skip_auth'. Bypassing auth for path:",
      pathname
    );
    return NextResponse.next();
  }

  // If not skipping auth, then proceed with token validation
  console.log(
    "[Middleware] DEV_MODE IS NOT 'skip_auth'. Proceeding with token validation..."
  );
  const token = await getToken({ req: request });
  console.log(
    "[Middleware] Token after getToken():",
    JSON.stringify(token, null, 2)
  ); // Log the token structure

  // Protected routes jo login ke bina nahi khulenge
  const protectedRoutes = ["/dashboard"];

  // Check karo ki current path protected route hai ya nahi
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  console.log(
    "[Middleware] Is Protected Route (",
    pathname,
    "):",
    isProtectedRoute
  );

  // Agar protected route hai aur user logged in nahi hai
  if (isProtectedRoute && !token) {
    console.log(
      "[Middleware] PROTECTED ROUTE (true) AND TOKEN (false). Redirecting to login for path:",
      pathname
    );
    // root page pe redirect karo
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedRoute && token) {
    console.log(
      "[Middleware] PROTECTED ROUTE (true) AND TOKEN (true). Allowing access for path:",
      pathname
    );
  }

  if (!isProtectedRoute) {
    console.log(
      "[Middleware] NOT a protected route. Allowing access for path:",
      pathname
    );
  }

  return NextResponse.next();
}

// Configure karo ki konse routes pe middleware chalega
export const config = {
  matcher: ["/dashboard/:path*", "/api/user/:path*"],
};
