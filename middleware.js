import { NextResponse } from 'next/server';

// Since auth is now handled by the Express backend via Bearer tokens in localStorage,
// the Next.js middleware simply allows all requests - Express protects API endpoints.
// Role-based redirect is handled client-side in each page via useSession().
export async function middleware(req) {
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/teacher/:path*', '/parent/:path*'],
};
