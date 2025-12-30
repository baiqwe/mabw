import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { SoftwareApplicationSchema } from "@/components/json-ld-schema";
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
        
        // ✅ Open Graph
        openGraph: {
            title: messages.metadata.title,
            description: messages.metadata.description,
            type: "website",
            locale: locale === 'zh' ? 'zh_CN' : 'en_US',
            url: `https://makebw.com/${locale}`,
            siteName: 'MakeBW.com',
        },
        
        // ✅ Twitter Card
        twitter: {
            card: "summary_large_image",
            title: messages.metadata.title,
            description: messages.metadata.description,
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
        
        // ✅ Favicon 和图标配置
        icons: {
            icon: [
                { url: '/favicon.ico', sizes: 'any' },
                { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
                { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            ],
            apple: [
                { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
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
            <body className="bg-background text-foreground antialiased">
                <SoftwareApplicationSchema />
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
