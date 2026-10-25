"use client";

import { Logo } from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const pathname = usePathname();
  const t = useTranslations('footer');
  const isDashboard = pathname?.startsWith("/dashboard");

  // 检测当前 locale
  const pathParts = pathname?.split('/') || [];
  const currentLocale = (pathParts[1] === 'en' || pathParts[1] === 'zh') ? pathParts[1] : 'en';
  const localePrefix = `/${currentLocale}`;

  // 工具链接 - 内链建设核心
  const toolLinks = [
    { label: "Grayscale Converter", labelZh: "灰度转换", href: `${localePrefix}/color-to-black-and-white` },
    { label: "Threshold Image", labelZh: "图片阈值", href: `${localePrefix}/threshold-image` },
    { label: "Coloring Page Maker", labelZh: "填色画制作", href: `${localePrefix}/photo-to-coloring-page` },
    { label: "Invert Colors", labelZh: "反色工具", href: `${localePrefix}/invert-colors` },
  ];

  // 格式链接 - 长尾词页面
  const formatLinks = [
    { label: "JPG to B&W", href: `${localePrefix}/jpg-to-black-and-white` },
    { label: "PNG to B&W", href: `${localePrefix}/png-to-black-and-white` },
    { label: "WebP to B&W", href: `${localePrefix}/webp-to-black-and-white` },
    { label: "HEIC to B&W", href: `${localePrefix}/heic-to-black-and-white` },
  ];

  const legalLinks = [
    { label: t('link_privacy'), href: `${localePrefix}/privacy` },
    { label: t('link_terms'), href: `${localePrefix}/terms` },
    { label: t('link_about'), href: `${localePrefix}/about` },
  ];

  if (isDashboard) {
    return (
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <span className="font-medium">Bai</span>
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-full lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              {t('tagline')}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {currentLocale === 'zh' 
                ? '🔒 所有图片处理均在浏览器本地完成，从不上传到服务器。' 
                : '🔒 All images are processed locally in your browser. Never uploaded to any server.'}
            </p>
          </div>

          {/* Tools - 工具内链 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">
              {currentLocale === 'zh' ? '转换工具' : 'Tools'}
            </h3>
            <nav className="flex flex-col gap-2">
              {toolLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {currentLocale === 'zh' ? link.labelZh : link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Formats - 格式长尾词 */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">
              {currentLocale === 'zh' ? '支持格式' : 'Formats'}
            </h3>
            <nav className="flex flex-col gap-2">
              {formatLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t('legal')}</h3>
            <nav className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} MakeBW.com. {t('rights')}
          </p>
          <div className="flex flex-col items-center gap-1 text-center text-sm text-muted-foreground md:items-end md:text-right">
            <p>
              Built by <span className="font-medium">Bai</span>
            </p>
            <Link
              href="https://animeify.co"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              animeify.co
            </Link>
            <Link
              href="https://gptimage2.online"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              gptimage2.online
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
