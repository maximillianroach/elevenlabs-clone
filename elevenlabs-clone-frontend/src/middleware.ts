import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";

export async function middleware(request: NextRequest) {
  // tells us if the user is logged in
  const session = await auth();

  const path = request.nextUrl.pathname;

  // if the user is on a different page/already signed in but tries to go to
  // signin/signup we want to redirect them away
  const isAuthRoute = path === "/app/sign-in" || path === "/app/sign-up";

  // checks if the route is any non-auth route
  const isProtectedRoute = path.startsWith("/app/") && !isAuthRoute;

  // if the user is logged in but tries to go to a sign-in page, then redirect to dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(
      new URL("/app/speech-synthesis/text-to-speech", request.url),
    );
  }

  // if the user isn't logged in but tries to go to a non-auth route,
  // we redirect them to the sign-in page but keep a reference to
  // a callback url so they will be sent where they wanted to go after
  // they login
  if (!session && isProtectedRoute) {
    const signInUrl = new URL("/app/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// The middleware is applied to all paths in the app
export const config = {
  matcher: ["/app/:path*"],
};
