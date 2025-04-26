import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Protected routes jo login ke bina nahi khulenge
  const protectedRoutes = ["/dashboard"];

  // Check karo ki current path protected route hai ya nahi
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Agar protected route hai aur user logged in nahi hai
  if (isProtectedRoute && !token) {
    // Login page pe redirect karo
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure karo ki konse routes pe middleware chalega
export const config = {
  matcher: ["/dashboard/:path*", "/api/user/:path*"],
};
