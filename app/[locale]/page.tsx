'use client';

import { useTranslations } from 'next-intl';
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
