import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const redirectUrl = request.nextUrl.clone();

    const token = request.cookies.get('auth-token')?.value;

    if (pathname.startsWith('/clientArea') && !token) {
        redirectUrl.pathname = `/auth/login`;
        return NextResponse.redirect(redirectUrl);
    }

    if (pathname === '/clientArea') {
        redirectUrl.pathname = `/clientArea/profile`;
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/clientArea/:path*'],
}