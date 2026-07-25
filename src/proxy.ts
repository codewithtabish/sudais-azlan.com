// src/proxy.ts

import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // ✅ Never protect Clerk webhooks
  // if (pathname.startsWith("/api/webhooks")) {
  //   return;
  // }

  // ✅ Protect all dashboard routes
  if (pathname.startsWith("/dashboard")) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API & tRPC routes
    "/(api|trpc)(.*)",
  ],
};