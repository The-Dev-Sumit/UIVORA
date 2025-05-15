import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE;

  // Check for development mode to skip authentication FIRST
  if (devMode === "skip_auth") {
    console.log("Development mode: Skipping auth for path:", pathname);
    return NextResponse.next();
  }

  // If not skipping auth, then proceed with token validation
  const token = await getToken({ req: request });

  // Protected routes jo login ke bina nahi khulenge
  const protectedRoutes = ["/dashboard"];

  // Check karo ki current path protected route hai ya nahi
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Agar protected route hai aur user logged in nahi hai
  if (isProtectedRoute && !token) {
    // root page pe redirect karo
    console.log(
      `Protected route ${pathname} accessed without token or in non-skip mode. Redirecting to login.`
    );
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure karo ki konse routes pe middleware chalega
export const config = {
  matcher: ["/dashboard/:path*", "/api/user/:path*"],
};
