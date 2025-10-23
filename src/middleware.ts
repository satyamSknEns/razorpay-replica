import { NextRequest, NextResponse } from "next/server";
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  console.log(pathname);
  const allowedPaths = [
    "/login",
    "/signup",
    "/forgotPassword",
    "/resetpassword",
  ];
  if (!token && !allowedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (token && allowedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/layout/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
