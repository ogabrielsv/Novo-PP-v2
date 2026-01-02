import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // If env vars are missing, just return the response without supabase auth to avoid crashing the whole site
        // Ideally we should log this, but console.log might not be visible in edge runtime easily
        console.error("Missing Supabase Environment Variables");
        return response;
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Simplified cookie setting to avoid potential loop/crash on Vercel Edge
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect Admin Routes
    if (request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login') &&
        !user) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Redirect to dashboard if logged in and trying to access login
    if (request.nextUrl.pathname === '/admin/login' && user) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    return response
}
