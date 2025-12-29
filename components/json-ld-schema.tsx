'use client';

/**
 * JSON-LD Structured Data for SoftwareApplication
 * Helps search engines understand MakeBW as a web application
 */
export function SoftwareApplicationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "MakeBW - Image to Black and White Converter",
        "description": "Free online tool to convert images to black and white. Supports grayscale conversion, line art generation for coloring pages, and color inversion.",
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
        "screenshot": "https://makebw.com/og-image.png",
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
