import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

export const runtime = 'edge';

export async function GET(
    request: Request,
    props: { params: Promise<{ locale: string }> }
) {
    const params = await props.params;
    const { locale } = params;
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") || `/${locale}`;
    const origin = requestUrl.origin;

    // 验证 locale
    const validLocale = routing.locales.includes(locale as any) ? locale : routing.defaultLocale;

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // 成功登录，重定向到目标页面
            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocalEnv = process.env.NODE_ENV === "development";

            // 确保 next 路径包含 locale
            let redirectPath = next;
            if (!next.startsWith(`/${validLocale}`)) {
                redirectPath = next === "/" ? `/${validLocale}` : `/${validLocale}${next}`;
            }

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${redirectPath}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
            } else {
                return NextResponse.redirect(`${origin}${redirectPath}`);
            }
        }
    }

    // 如果有错误或没有 code，重定向到登录页并显示错误
    return NextResponse.redirect(`${origin}/${validLocale}/sign-in?error=auth_callback_error`);
}
