import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // ALLOW ALL TRAFFIC TEMPORARILY
    // We are debugging access. Auth is disabled in middleware.
    return NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
}
