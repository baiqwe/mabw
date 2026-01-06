import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  // First, run the intl middleware to get the response with locale handling
  let response = intlMiddleware(request)

  // Create a Supabase client for session management
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          // Update the response with cookies
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: This refreshes the session if expired
  // and sets the cookies on the response
  const { data: { user } } = await supabase.auth.getUser()

  // Re-run intl middleware with the request that now has updated cookies
  response = intlMiddleware(request)

  // Copy over any auth cookies that were set
  const supabaseCookies = request.cookies.getAll().filter(c => c.name.startsWith('sb-'))
  supabaseCookies.forEach(cookie => {
    response.cookies.set(cookie.name, cookie.value)
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/(en|zh)/:path*']
}
