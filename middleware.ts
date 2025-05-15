import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // DEV MODE BYPASS (optional)
  if (process.env.NEXT_PUBLIC_DEV_MODE === "skip_auth") {
    return NextResponse.next();
  }

  // Only protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req: request });
    // Robust check: token must exist and have id or sub
    const isAuthenticated = token && (token.id || token.sub);
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/api/user/:path*"],
};
