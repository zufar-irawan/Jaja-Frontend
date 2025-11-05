import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const redirectUrl = request.nextUrl.clone();

    if (pathname === '/clientArea' || pathname.startsWith('/clientArea/')) {
        redirectUrl.pathname = `/clientArea/profile`;
        return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/clientArea'],
}