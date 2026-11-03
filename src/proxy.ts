import { type NextRequest, NextResponse } from "next/server"
import { accessTokenCookie, verifyAccessToken } from "@/lib/access-token"

export async function proxy(request: NextRequest) {
  const isAdmin = request.nextUrl.pathname.startsWith("/admin")
  const isLogin = request.nextUrl.pathname === "/admin/login"
  const token = request.cookies.get(accessTokenCookie)?.value
  const userId = token ? await verifyAccessToken(token) : null

  if (isAdmin && !isLogin) {
    if (!userId) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.delete(accessTokenCookie)
      response.cookies.delete("convite_session")
      return response
    }

    return NextResponse.next()
  }

  if (isLogin && userId) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  const response = NextResponse.next()
  if (isLogin && token && !userId) {
    response.cookies.delete(accessTokenCookie)
    response.cookies.delete("convite_session")
  }
  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
