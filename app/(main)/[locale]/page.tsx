'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import ImageEditor from '@/components/feature/image-editor';
import { Sparkles, Lock, Zap, Palette, Smartphone, Printer } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <HeroSection />

            {/* Main Editor */}
            <section className="py-16 bg-background">
                <div className="container px-4 md:px-6">
                    <ImageEditor defaultMode="grayscale" />
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* Supported Formats Section - 内链建设 */}
            <SupportedFormatsSection />

            {/* CTA Section */}
            <CTASection />
        </div>
    );
}


function HeroSection() {
    const t = useTranslations('hero');

    return (
        <section className="relative py-20 lg:py-32 bg-gradient-to-b from-muted/20 to-background">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="container px-4 md:px-6 relative">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                            <span className="mr-2">🖼️</span>
                            {t('badge')}
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                            {t('title')}
                            <br />
                            <span className="text-primary">{t('title_highlight')}</span>
                        </h1>

                        <p className="mt-6 text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto">
                            {t('subtitle')}
                        </p>

                        <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {t('feature_1')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                {t('feature_2')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                {t('feature_3')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    const t = useTranslations('features');

    const features = [
        { icon: Lock, title: t('feature_1_title'), desc: t('feature_1_desc') },
        { icon: Zap, title: t('feature_2_title'), desc: t('feature_2_desc') },
        { icon: Palette, title: t('feature_3_title'), desc: t('feature_3_desc') },
        { icon: Sparkles, title: t('feature_4_title'), desc: t('feature_4_desc') },
        { icon: Smartphone, title: t('feature_5_title'), desc: t('feature_5_desc') },
        { icon: Printer, title: t('feature_6_title'), desc: t('feature_6_desc') },
    ];

    return (
        <section className="py-20 bg-muted/20">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-6xl space-y-12 text-center">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {t('title')}
                        </h2>
                        <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className="rounded-2xl bg-background p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
                                >
                                    <div className="space-y-4">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function SupportedFormatsSection() {
    const pathname = usePathname();
    const pathParts = pathname?.split('/') || [];
    const locale = (pathParts[1] === 'en' || pathParts[1] === 'zh') ? pathParts[1] : 'en';
    const localePrefix = `/${locale}`;

    const formats = [
        { name: 'JPG', href: `${localePrefix}/jpg-to-black-and-white`, desc: locale === 'zh' ? '最常用的照片格式' : 'Most common photo format' },
        { name: 'PNG', href: `${localePrefix}/png-to-black-and-white`, desc: locale === 'zh' ? '支持透明背景' : 'Supports transparency' },
        { name: 'WebP', href: `${localePrefix}/webp-to-black-and-white`, desc: locale === 'zh' ? '现代高效格式' : 'Modern efficient format' },
        { name: 'HEIC', href: `${localePrefix}/heic-to-black-and-white`, desc: locale === 'zh' ? 'iPhone 默认格式' : 'iPhone default format' },
    ];

    return (
        <section className="py-20 bg-background">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-6xl space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {locale === 'zh' ? '支持的图片格式' : 'Supported Image Formats'}
                        </h2>
                        <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
                            {locale === 'zh' 
                                ? '支持所有主流图片格式，一键转换为黑白。点击下方格式查看详细说明。'
                                : 'Support for all major image formats. Convert to black and white with one click. Click any format below for details.'}
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {formats.map((format) => (
                            <a
                                key={format.name}
                                href={format.href}
                                className="group rounded-2xl bg-muted/30 p-6 hover:bg-muted/50 transition-all hover:shadow-lg border border-border hover:border-primary/50"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                            {format.name}
                                        </h3>
                                        <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {format.desc}
                                    </p>
                                    <div className="pt-2">
                                        <span className="text-sm font-medium text-primary group-hover:underline">
                                            {locale === 'zh' ? '转换为黑白 →' : 'Convert to B&W →'}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Related Tools */}
                    <div className="pt-8 border-t">
                        <div className="text-center space-y-6">
                            <h3 className="text-2xl font-bold">
                                {locale === 'zh' ? '更多工具' : 'More Tools'}
                            </h3>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href={`${localePrefix}/photo-to-coloring-page`}
                                    className="px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                                >
                                    {locale === 'zh' ? '填色画生成器' : 'Coloring Page Maker'}
                                </a>
                                <a
                                    href={`${localePrefix}/color-to-black-and-white`}
                                    className="px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                                >
                                    {locale === 'zh' ? '灰度转换器' : 'Grayscale Converter'}
                                </a>
                                <a
                                    href={`${localePrefix}/invert-colors`}
                                    className="px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                                >
                                    {locale === 'zh' ? '反色工具' : 'Invert Colors'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    const t = useTranslations('hero');

    return (
        <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-4xl text-center space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            Start Converting Today
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
                            Free, fast, and completely private. No sign-up required.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
