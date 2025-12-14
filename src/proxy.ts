import { ADMIN_SESSION_KEY } from "@/environment";
import { NextResponse, type NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function proxy(req: NextRequest) {
  const cookies = req.cookies.get("adminKey")?.value;
  const pathname = req.nextUrl.pathname;

  if (cookies !== ADMIN_SESSION_KEY && pathname.startsWith("/admin")) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("adminKey");
    return res;
  } else if (cookies === ADMIN_SESSION_KEY && ["/"].includes(pathname)) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/admin/:path"],
};
