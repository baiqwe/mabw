import { getTranslations } from 'next-intl/server';
import ImageEditor from '@/components/feature/image-editor';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'pages' });

    return {
        title: t('invert_title'),
        description: t('invert_desc'),
        alternates: {
            canonical: `/${locale}/invert-colors`,
            languages: {
                'en': '/en/invert-colors',
                'zh': '/zh/invert-colors',
            },
        },
    };
}

export default async function InvertColorsPage(props: { params: Promise<{ locale: string }> }) {
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
                            {t('invert_title')}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {t('invert_desc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Editor */}
            <section className="py-12">
                <div className="container px-4 md:px-6">
                    <ImageEditor defaultMode="invert" />
                </div>
            </section>
        </div>
    );
}
