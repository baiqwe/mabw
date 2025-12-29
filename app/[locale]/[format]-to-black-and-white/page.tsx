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
                        <FormatInfo format={format} />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FormatInfo({ format }: { format: string }) {
    switch (format) {
        case 'jpg':
            return (
                <div>
                    <p>
                        JPG (or JPEG) is one of the most widely used image formats. Our converter maintains
                        image quality while removing color information, perfect for photos and complex images.
                    </p>
                    <ul>
                        <li>Most compatible format across all devices</li>
                        <li>Best for photographs and detailed images</li>
                        <li>Smaller file sizes after conversion</li>
                    </ul>
                </div>
            );
        case 'png':
            return (
                <div>
                    <p>
                        PNG format supports transparency and lossless compression. When converting PNG to
                        black and white, you can choose to preserve or remove transparency.
                    </p>
                    <ul>
                        <li>Supports transparent backgrounds</li>
                        <li>Lossless quality - no compression artifacts</li>
                        <li>Perfect for logos and graphics with transparency</li>
                    </ul>
                </div>
            );
        case 'webp':
            return (
                <div>
                    <p>
                        WebP is a modern image format that provides superior compression. Converting WebP
                        to black and white reduces file size even further.
                    </p>
                    <ul>
                        <li>Modern format with excellent compression</li>
                        <li>Supported by all major browsers</li>
                        <li>Smaller file sizes than JPG or PNG</li>
                    </ul>
                </div>
            );
        case 'heic':
            return (
                <div>
                    <p>
                        HEIC is Apple's efficient image format used by default on iPhones. Our tool
                        automatically converts HEIC files for processing.
                    </p>
                    <ul>
                        <li>Default format on iPhone and iPad</li>
                        <li>Excellent compression efficiency</li>
                        <li>Automatically converted for web compatibility</li>
                    </ul>
                </div>
            );
        default:
            return null;
    }
}
