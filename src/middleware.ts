import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const slug = request.cookies.get('slugs')?.value || null;
    const { pathname } = request.nextUrl;

    const redirectUrl = request.nextUrl.clone();

    const staticSubPages = ['profile', 'settings', 'orders'];
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 2 && segments[0] === 'clientArea' && !staticSubPages.includes(segments[1])) {
        redirectUrl.pathname = `${pathname}/profile`;
        return NextResponse.redirect(redirectUrl)
    }

    if (pathname === '/clientArea' || pathname.startsWith('/clientArea/')) {
        redirectUrl.pathname = `/clientArea/${slug}/profile`;
        return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/clientArea/:id', '/clientArea'],
}