import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

export const runtime = 'edge';

// 从 request cookie header 获取用户语言偏好
function getLocaleFromRequest(request: Request): string {
    const cookieHeader = request.headers.get("cookie") || "";

    // 尝试多个可能的 Cookie 名称
    const possibleCookieNames = ["NEXT_LOCALE", "locale", "next-intl-locale"];

    for (const name of possibleCookieNames) {
        const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
        if (match && routing.locales.includes(match[1] as any)) {
            return match[1];
        }
    }

    // 默认使用英语
    return routing.defaultLocale;
}

// 确保 URL 包含 locale 前缀
function ensureLocaleInPath(path: string, locale: string): string {
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
        return path;
    }
    if (path.startsWith("/en/") || path.startsWith("/zh/") || path === "/en" || path === "/zh") {
        return path;
    }
    if (path === "/") {
        return `/${locale}`;
    }
    return `/${locale}${path}`;
}

// 解析 cookie string 为对象
function parseCookies(cookieHeader: string): { name: string; value: string }[] {
    if (!cookieHeader) return [];
    return cookieHeader.split(';').map(cookie => {
        const [name, ...rest] = cookie.trim().split('=');
        return { name, value: rest.join('=') };
    });
}

export async function GET(request: Request) {
    try {
        const requestUrl = new URL(request.url);
        const code = requestUrl.searchParams.get("code");
        const errorParam = requestUrl.searchParams.get("error");
        const errorDescription = requestUrl.searchParams.get("error_description");
        const next = requestUrl.searchParams.get("next") || "/";
        const origin = requestUrl.origin;
        const locale = getLocaleFromRequest(request);

        // 如果 OAuth 返回了错误
        if (errorParam) {
            console.error("OAuth error:", errorParam, errorDescription);
            return NextResponse.redirect(
                `${origin}/${locale}/sign-in?error=${encodeURIComponent(errorDescription || errorParam)}`
            );
        }

        if (code) {
            const cookieHeader = request.headers.get("cookie") || "";
            const cookies = parseCookies(cookieHeader);

            // 创建一个用于收集要设置的 cookies 的数组
            const cookiesToSet: { name: string; value: string; options?: any }[] = [];

            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() {
                            return cookies;
                        },
                        setAll(newCookies) {
                            cookiesToSet.push(...newCookies);
                        },
                    },
                }
            );

            const { error } = await supabase.auth.exchangeCodeForSession(code);

            if (!error) {
                const localizedPath = ensureLocaleInPath(next, locale);
                const forwardedHost = request.headers.get("x-forwarded-host");
                const isLocalEnv = process.env.NODE_ENV === "development";

                let redirectUrl: string;
                if (isLocalEnv) {
                    redirectUrl = `${origin}${localizedPath}`;
                } else if (forwardedHost) {
                    redirectUrl = `https://${forwardedHost}${localizedPath}`;
                } else {
                    redirectUrl = `${origin}${localizedPath}`;
                }

                const response = NextResponse.redirect(redirectUrl);

                // 设置 session cookies
                for (const cookie of cookiesToSet) {
                    response.cookies.set(cookie.name, cookie.value, cookie.options);
                }

                return response;
            } else {
                console.error("Exchange code error:", error.message);
            }
        }

        // 如果有错误或没有 code，重定向到登录页
        return NextResponse.redirect(`${origin}/${locale}/sign-in?error=auth_callback_error`);
    } catch (err) {
        console.error("Auth callback error:", err);
        // 发生异常时返回一个安全的重定向
        const requestUrl = new URL(request.url);
        return NextResponse.redirect(`${requestUrl.origin}/en/sign-in?error=unexpected_error`);
    }
}

