import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Geist } from "next/font/google";
import "../../globals.css";

// ✅ 必须添加这一行，让前端页面兼容 Cloudflare Edge
export const runtime = 'edge';

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"],
});

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const messages = await getMessages({ locale }) as any;

    return {
        // ✅ SEO 核心: metadataBase 用于生成绝对 URL
        metadataBase: new URL('https://makebw.com'),
        
        title: {
            default: messages.metadata.title,
            template: '%s | MakeBW.com'
        },
        description: messages.metadata.description,
        keywords: messages.metadata.keywords,
        
        // ✅ 作者和站点信息
        authors: [{ name: 'Bai' }],
        creator: 'Bai',
        publisher: 'MakeBW.com',
        
        // ✅ Open Graph - 添加图片
        openGraph: {
            title: messages.metadata.title,
            description: messages.metadata.description,
            type: "website",
            locale: locale === 'zh' ? 'zh_CN' : 'en_US',
            url: `https://makebw.com/${locale}`,
            siteName: 'MakeBW.com',
            images: [
                {
                    url: 'https://makebw.com/web-app-manifest-512x512.png',
                    width: 512,
                    height: 512,
                    alt: 'MakeBW - Free Image to Black and White Converter',
                },
            ],
        },
        
        // ✅ Twitter Card - 添加图片
        twitter: {
            card: "summary_large_image",
            title: messages.metadata.title,
            description: messages.metadata.description,
            images: ['https://makebw.com/web-app-manifest-512x512.png'],
        },
        
        // ✅ Canonical & 多语言 alternates
        alternates: {
            canonical: `/${locale}`,
            languages: {
                'en': '/en',
                'zh': '/zh',
                'x-default': '/en',
            },
        },
        
        // ✅ Robots 配置 - 允许索引
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        
        // ✅ Favicon 和图标配置 - 匹配实际文件
        icons: {
            icon: [
                { url: '/favicon.ico', sizes: 'any' },
                { url: '/favicon.svg', type: 'image/svg+xml' },
                { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            ],
            apple: [
                { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
            ],
            other: [
                { rel: 'mask-icon', url: '/favicon.svg', color: '#000000' },
            ],
        },
        
        // ✅ Web App Manifest
        manifest: '/site.webmanifest',
        
        // ✅ 其他 SEO 相关
        category: 'technology',
        classification: 'Image Processing Tool',
    };
}

export default async function LocaleLayout(props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;
    const { locale } = params;
    const { children } = props;

    // Validate locale
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages({ locale });

    // MVP: 暂时不使用 Supabase，用户设为 null
    const user = null;

    return (
        <html lang={locale} className={geistSans.className} suppressHydrationWarning>
            <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="relative min-h-screen flex flex-col">
                            <Header user={user} />
                            <main className="flex-1">{children}</main>
                            <Footer />
                        </div>
                        <Toaster />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
