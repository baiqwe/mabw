import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";

export const runtime = 'edge';

// 从 Cookie 或请求获取用户语言偏好
async function getLocaleFromCookie(): Promise<string> {
    const cookieStore = await cookies();

    // 尝试多个可能的 Cookie 名称
    const possibleCookieNames = ["NEXT_LOCALE", "locale", "next-intl-locale"];

    for (const name of possibleCookieNames) {
        const cookie = cookieStore.get(name);
        if (cookie?.value && routing.locales.includes(cookie.value as any)) {
            return cookie.value;
        }
    }

    // 默认使用英语
    return routing.defaultLocale;
}

// 确保 URL 包含 locale 前缀
function ensureLocaleInPath(path: string, locale: string): string {
    // 如果路径已经以 locale 开头，直接返回
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
        return path;
    }
    // 如果路径以其他 locale 开头，替换它
    if (path.startsWith("/en/") || path.startsWith("/zh/") || path === "/en" || path === "/zh") {
        return path; // 保持原有 locale
    }
    // 如果只是根路径 "/"，添加 locale
    if (path === "/") {
        return `/${locale}`;
    }
    // 其他情况，添加 locale 前缀
    return `/${locale}${path}`;
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") || "/";
    const origin = requestUrl.origin;

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // 成功登录，获取用户语言偏好并重定向到目标页面
            const locale = await getLocaleFromCookie();
            const localizedPath = ensureLocaleInPath(next, locale);

            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocalEnv = process.env.NODE_ENV === "development";

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${localizedPath}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${localizedPath}`);
            } else {
                return NextResponse.redirect(`${origin}${localizedPath}`);
            }
        }
    }

    // 如果有错误或没有 code，重定向到登录页并显示错误
    const locale = await getLocaleFromCookie();
    return NextResponse.redirect(`${origin}/${locale}/sign-in?error=auth_callback_error`);
}
