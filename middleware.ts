import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    
    // Define public paths including otpPage
    const isPublicPath = path === '/' || path === '/sign-in' || path === '/otpPage'
    
    // Check for NextAuth session token
    const hasSession = request.cookies.get('next-auth.session-token')?.value || ''

    // If trying to access protected route without session, redirect to sign-in
    // Exclude otpPage from this check
    if (!isPublicPath && !hasSession) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // If trying to access public paths with session (except otpPage), redirect to dashboard
    if (isPublicPath && hasSession && path !== '/otpPage') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next|static|favicon.ico|sitemap.xml).*)',
    ],
}

