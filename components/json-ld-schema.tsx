/**
 * JSON-LD Structured Data for SoftwareApplication
 * Helps search engines understand MakeBW as a web application
 * 
 * Note: This is a server component to avoid hydration issues
 */
import { getTranslations } from 'next-intl/server';

export async function SoftwareApplicationSchema({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'metadata' });

    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "MakeBW - Image to Black and White Converter",
        "description": t('description'),
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Grayscale conversion",
            "Line art generation for coloring pages",
            "Color inversion",
            "HEIC file support",
            "Privacy-first browser processing",
            "No upload required"
        ],
        "screenshot": "https://www.makebw.com/og-image.png",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
