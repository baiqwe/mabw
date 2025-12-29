import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ImageEditor from '@/components/feature/image-editor';
import { locales } from '@/i18n';

const supportedFormats = ['jpg', 'png', 'webp', 'heic'] as const;
type SupportedFormat = typeof supportedFormats[number];

export async function generateStaticParams() {
    const params = [];
    for (const locale of locales) {
        for (const format of supportedFormats) {
            params.push({ locale, format });
        }
    }
    return params;
}

export async function generateMetadata(props: { params: Promise<{ locale: string; format: string }> }) {
    const params = await props.params;
    const { locale, format } = params;

    if (!supportedFormats.includes(format as SupportedFormat)) {
        return {};
    }

    const t = await getTranslations({ locale, namespace: 'metadata' });
    const formatUpper = format.toUpperCase();

    return {
        title: t('format_title', { format: formatUpper }),
        description: t('format_desc', { format: formatUpper }),
        alternates: {
            canonical: `/${locale}/${format}-to-black-and-white`,
            languages: {
                'en': `/en/${format}-to-black-and-white`,
                'zh': `/zh/${format}-to-black-and-white`,
            },
        },
    };
}

export default async function FormatToBWPage(props: { params: Promise<{ locale: string; format: string }> }) {
    const params = await props.params;
    const { locale, format } = params;

    if (!supportedFormats.includes(format as SupportedFormat)) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'metadata' });
    const formatUpper = format.toUpperCase();

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            Convert {formatUpper} to Black and White
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {t('format_desc', { format: formatUpper })}
                        </p>
                    </div>
                </div>
            </section>

            {/* Editor */}
            <section className="py-12">
                <div className="container px-4 md:px-6">
                    <ImageEditor defaultMode="grayscale" />
                </div>
            </section>

            {/* Format-Specific Info */}
            <section className="py-16 bg-muted/20">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
                        <h2>About {formatUpper} Format</h2>
                        <FormatInfo format={format} locale={locale} />
                    </div>
                </div>
            </section>
        </div>
    );
}

async function FormatInfo({ format, locale }: { format: string; locale: string }) {
    const t = await getTranslations({ locale, namespace: 'formats' });

    const formatKey = format as 'jpg' | 'png' | 'webp' | 'heic';

    return (
        <div>
            <p>{t(`${formatKey}_intro`)}</p>
            <ul>
                <li>{t(`${formatKey}_feature_1`)}</li>
                <li>{t(`${formatKey}_feature_2`)}</li>
                <li>{t(`${formatKey}_feature_3`)}</li>
            </ul>
        </div>
    );
}
