import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';
import { createServerClient } from "@supabase/ssr";

// Create i18n middleware
const intlMiddleware = createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  // First handle i18n routing
  let response = intlMiddleware(request);

  // Then handle Supabase session
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh session if expired
    const user = await supabase.auth.getUser();

    // Protect dashboard routes (need to account for locale prefix)
    const pathname = request.nextUrl.pathname;
    const isDashboard = pathname.includes("/dashboard");

    if (isDashboard && user.error) {
      // Extract locale from path
      const locale = pathname.split('/')[1];
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url));
    }

    return response;
  } catch (e) {
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

