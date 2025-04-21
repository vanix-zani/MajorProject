import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/login", "/register"]
  const isPublicPath = publicPaths.includes(path)

  // Define admin paths that require admin role
  const isAdminPath = path.startsWith("/admin")

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect logic for public paths
  if (isPublicPath) {
    // If user is logged in and trying to access login/register page, redirect to dashboard
    if (token && (path === "/login" || path === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Allow access to public paths
    return NextResponse.next()
  }

  // If user is not logged in and trying to access protected path, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user is trying to access admin path but is not an admin, redirect to dashboard
  if (isAdminPath && token.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Allow access to protected paths for authenticated users
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /favicon.ico, /sitemap.xml (inside /public)
     */
    "/((?!api|_next|fonts|favicon.ico|sitemap.xml).*)",
  ],
}
