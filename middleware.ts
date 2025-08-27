import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const hasAuth = req.cookies.get("sm_auth")?.value === "1";

    // редирект корня
    if (pathname === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    const isAppRoute =
        pathname.startsWith("/dashboard") || pathname.startsWith("/calendar");

    // защита «приложения»
    if (isAppRoute && !hasAuth) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // если уже залогинен — не пускать на /login
    if (pathname === "/login" && hasAuth) {
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/dashboard/:path*", "/calendar/:path*"],
};
