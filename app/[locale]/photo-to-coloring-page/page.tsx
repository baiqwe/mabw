import { getTranslations } from 'next-intl/server';
import ImageEditor from '@/components/feature/image-editor';
import { Palette, Users, GraduationCap } from 'lucide-react';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'pages' });

    return {
        title: t('coloring_title'),
        description: t('coloring_desc'),
        alternates: {
            canonical: `/${locale}/photo-to-coloring-page`,
            languages: {
                'en': '/en/photo-to-coloring-page',
                'zh': '/zh/photo-to-coloring-page',
            },
        },
    };
}

export default async function ColoringPagePage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'pages' });

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {t('coloring_title')}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {t('coloring_desc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Editor */}
            <section className="py-12">
                <div className="container px-4 md:px-6">
                    <ImageEditor defaultMode="coloring" />
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 bg-muted/20">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Perfect For:</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Parents</h3>
                                <p className="text-sm text-muted-foreground">
                                    Create custom coloring pages from family photos for kids.
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <GraduationCap className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Teachers</h3>
                                <p className="text-sm text-muted-foreground">
                                    Generate educational coloring materials for classroom activities.
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Palette className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Artists</h3>
                                <p className="text-sm text-muted-foreground">
                                    Extract line art from photos for tracing and illustration.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
