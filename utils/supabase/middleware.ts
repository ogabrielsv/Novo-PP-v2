import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Simplified Middleware to prevent Vercel Edge Runtime 500 Errors
    // We will handle Auth protection in the Server Components (files in app/admin/...)
    return NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
}
