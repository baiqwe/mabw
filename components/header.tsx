"use client";

import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface HeaderProps {
  user: any;
}

interface NavItem {
  label: string;
  href: string;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const isDashboard = pathname?.startsWith("/dashboard");

  // 更可靠地检测当前 locale
  const pathParts = pathname?.split('/') || [];
  const currentLocale = (pathParts[1] === 'en' || pathParts[1] === 'zh') ? pathParts[1] : 'en';
  const localePrefix = `/${currentLocale}`;

  // 获取不带 locale 前缀的路径（用于语言切换）
  const getPathWithoutLocale = () => {
    if (!pathname) return '/';
    // 如果路径以 /en 或 /zh 开头，移除它
    const withoutLocale = pathname.replace(/^\/(en|zh)/, '');
    return withoutLocale || '/';
  };

  const pathWithoutLocale = getPathWithoutLocale();
  // Main navigation items
  const mainNavItems: NavItem[] = [
    { label: t('home'), href: localePrefix },
    { label: currentLocale === 'zh' ? '填色画' : 'Coloring Pages', href: `${localePrefix}/photo-to-coloring-page` },
    { label: t('about'), href: `${localePrefix}/about` },
  ];
  const mobileNavItems: NavItem[] = [
    mainNavItems[0],
    { label: currentLocale === 'zh' ? '工具' : 'Tools', href: `${localePrefix}/tools` },
    ...mainNavItems.slice(1),
  ];
  const availableTools = [
    { label: currentLocale === 'zh' ? '黑白转换器' : 'Black & White Converter', href: `${localePrefix}/color-to-black-and-white` },
    { label: currentLocale === 'zh' ? '图片阈值处理器' : 'Threshold Image', href: `${localePrefix}/threshold-image` },
    { label: currentLocale === 'zh' ? '填色画制作器' : 'Coloring Page Maker', href: `${localePrefix}/photo-to-coloring-page` },
    { label: currentLocale === 'zh' ? '颜色反转' : 'Invert Colors', href: `${localePrefix}/invert-colors` },
  ];
  const plannedTools = currentLocale === 'zh'
    ? ['高对比黑白滤镜', 'Noir 黑白滤镜', '照片转模板', '批量黑白转换', '文档扫描器']
    : ['High Contrast B&W', 'Noir Filter', 'Photo to Stencil', 'Batch B&W Converter', 'Document Scanner'];

  // Dashboard items
  const dashboardItems: NavItem[] = [];
  const navItems = isDashboard ? dashboardItems : mainNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Centered Navigation */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          {navItems.slice(0, 1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          {!isDashboard && <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-lg font-semibold text-muted-foreground transition-colors hover:text-primary focus:outline-none">
              {currentLocale === 'zh' ? '工具' : 'Tools'} <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-72 rounded-xl border-[#d9d7d0] bg-[#fcfbf8] p-2 shadow-xl">
              <DropdownMenuLabel className="px-3 pt-2 text-xs uppercase tracking-[0.14em] text-[#706f69]">{currentLocale === 'zh' ? '可用工具' : 'Available now'}</DropdownMenuLabel>
              {availableTools.map((tool) => <DropdownMenuItem key={tool.href} asChild className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[#2d2d2d] focus:bg-[#efeee8]">
                <Link href={tool.href}>{tool.label}</Link>
              </DropdownMenuItem>)}
              <DropdownMenuSeparator className="bg-[#d9d7d0]" />
              <DropdownMenuLabel className="px-3 pt-2 text-xs uppercase tracking-[0.14em] text-[#706f69]">{currentLocale === 'zh' ? '即将推出' : 'Coming soon'}</DropdownMenuLabel>
              {plannedTools.map((tool) => <DropdownMenuItem key={tool} disabled className="rounded-lg px-3 py-2 text-sm text-[#8b8982]">{tool}</DropdownMenuItem>)}
              <DropdownMenuSeparator className="bg-[#d9d7d0]" />
              <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[#5d35d8] focus:bg-[#eee8ff]"><Link href={`${localePrefix}/tools`}>{currentLocale === 'zh' ? '查看全部工具 →' : 'View all tools →'}</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
          {navItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language Switcher - 修复后的版本 */}
          <div className="hidden md:flex items-center gap-1 mr-2">
            <Link
              href={`/en${pathWithoutLocale}`}
              className={`px-2 py-1 rounded text-sm transition-colors ${currentLocale === 'en'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              EN
            </Link>
            <Link
              href={`/zh${pathWithoutLocale}`}
              className={`px-2 py-1 rounded text-sm transition-colors ${currentLocale === 'zh'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              中文
            </Link>
          </div>

          <ThemeSwitcher />
          <MobileNav items={isDashboard ? navItems : mobileNavItems} user={user} isDashboard={isDashboard} currentLocale={currentLocale} showAuth={false} />
        </div>
      </div>
    </header>
  );
}
