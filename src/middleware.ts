import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { isRateLimitedPage } from "./utils/ratelimit";

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
): Promise<Response | undefined> {
  const rateLimited = await isRateLimitedPage(request);
  return rateLimited
    ? NextResponse.redirect(new URL("/blocked", request.url))
    : NextResponse.next();
}

export const config = {
  matcher: "/",
};
