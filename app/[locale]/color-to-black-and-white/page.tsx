import { getTranslations } from 'next-intl/server';
import ImageEditor from '@/components/feature/image-editor';
import { Printer, FileDown, DollarSign } from 'lucide-react';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'pages' });

    return {
        title: t('color_to_bw_title'),
        description: t('color_to_bw_desc'),
        alternates: {
            canonical: `/${locale}/color-to-black-and-white`,
            languages: {
                'en': '/en/color-to-black-and-white',
                'zh': '/zh/color-to-black-and-white',
            },
        },
    };
}

export default async function ColorToBWPage(props: { params: Promise<{ locale: string }> }) {
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
                            {t('color_to_bw_title')}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {t('color_to_bw_desc')}
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

            {/* Use Cases */}
            <section className="py-16 bg-muted/20">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Perfect For:</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Printer className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Printing Documents</h3>
                                <p className="text-sm text-muted-foreground">
                                    Save ink costs by converting color images to grayscale before printing.
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <FileDown className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Smaller File Sizes</h3>
                                <p className="text-sm text-muted-foreground">
                                    Reduce file size for faster uploads and downloads.
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <DollarSign className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Cost Savings</h3>
                                <p className="text-sm text-muted-foreground">
                                    Reduce printer ink and toner costs significantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
