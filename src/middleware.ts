import { auth } from "./auth";

const PUBLIC_ROUTES = ["/", "/auth/sign-in", "/auth/sign-up"];
const DEFAULT_REDIRECT = "/dashboard";
const ROOT = "/auth/sign-in";

export default auth(req => {
  // req.auth
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  if (isPublicRoute && isAuthenticated)
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(ROOT, nextUrl));
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
