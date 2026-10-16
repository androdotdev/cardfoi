import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
  
  // TODO: auth checks in each page/route
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"], // Specify the routes the middleware applies to
};
