// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");

  // Kalau tidak ada token dan mau akses halaman protected
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Kalau sudah login tapi mau akses halaman auth
  if (token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Tentukan middleware berlaku di route mana saja
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
