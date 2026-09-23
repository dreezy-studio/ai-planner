import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, sha256Hex } from "@/lib/auth";

// A "proxy" (Next.js's newer name for what used to be called middleware) is
// code that runs before any page loads, for every request that matches
// `config.matcher` below — like a bouncer checking ID at the door before
// Next.js even starts rendering the page.
export async function proxy(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    // Fail closed: an unset password should never mean "let everyone in."
    return new NextResponse("SITE_PASSWORD is not configured.", { status: 500 });
  }

  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  const expected = await sha256Hex(sitePassword);

  if (cookie === expected) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};
