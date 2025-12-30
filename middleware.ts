import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 如果路径已经包含 locale (en/zh)，直接使用 intl middleware
  if (pathname.startsWith('/en/') || pathname.startsWith('/zh/') || pathname === '/en' || pathname === '/zh') {
    return intlMiddleware(request);
  }
  
  // 如果是根路径，重定向到默认 locale
  if (pathname === '/') {
    return intlMiddleware(request);
  }
  
  // 如果路径不包含 locale，但看起来像是一个页面路径（不是 api、_next、静态文件等）
  // 重定向到默认 locale + 原路径
  if (!pathname.startsWith('/api/') && 
      !pathname.startsWith('/_next/') && 
      !pathname.startsWith('/_vercel/') &&
      !pathname.includes('.') &&
      pathname !== '/favicon.ico' &&
      pathname !== '/robots.txt' &&
      pathname !== '/sitemap.xml') {
    const defaultLocale = routing.defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }
  
  return intlMiddleware(request);
}

export const config = {
  // 匹配所有路径，除了静态文件和 API
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
