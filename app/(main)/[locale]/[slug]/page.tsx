import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import ImageEditor from '@/components/feature/image-editor';
import { CheckCircle, FileImage, Zap, Shield } from 'lucide-react';
import { BreadcrumbSchema, FAQSchema, HowToSchema } from '@/components/breadcrumb-schema';

// ✅ Cloudflare Edge Runtime
export const runtime = 'edge';

const supportedFormats = ['jpg', 'png', 'webp', 'heic'] as const;
type SupportedFormat = typeof supportedFormats[number];

// 辅助函数：从 slug 解析 format
function getFormatFromSlug(slug: string): SupportedFormat | null {
    const match = slug.match(/^([a-z0-9]+)-to-black-and-white$/);
    if (!match) return null;
    
    const format = match[1];
    if (supportedFormats.includes(format as SupportedFormat)) {
        return format as SupportedFormat;
    }
    return null;
}

// 格式详细信息
const formatDetails: Record<SupportedFormat, {
    fullName: string;
    fullNameZh: string;
    description: string;
    descriptionZh: string;
    features: string[];
    featuresZh: string[];
    tips: string[];
    tipsZh: string[];
}> = {
    jpg: {
        fullName: 'JPEG (Joint Photographic Experts Group)',
        fullNameZh: 'JPEG（联合图像专家组）',
        description: 'JPG is the most widely used image format, ideal for photographs and complex images with millions of colors.',
        descriptionZh: 'JPG 是最广泛使用的图像格式，非常适合照片和具有数百万种颜色的复杂图像。',
        features: [
            'Universal compatibility across all devices and platforms',
            'Excellent compression for smaller file sizes',
            'Best choice for photographs and realistic images',
            'Supported by all web browsers and image editors',
        ],
        featuresZh: [
            '在所有设备和平台上都具有通用兼容性',
            '出色的压缩效果，文件体积更小',
            '照片和真实图像的最佳选择',
            '所有网页浏览器和图像编辑器都支持',
        ],
        tips: [
            'JPG to grayscale conversion typically reduces file size by 30-50%',
            'Use high quality settings when saving for print',
            'JPG doesn\'t support transparency - transparent areas become white',
        ],
        tipsZh: [
            'JPG 转灰度通常可以减少 30-50% 的文件大小',
            '保存打印用图时请使用高质量设置',
            'JPG 不支持透明度 - 透明区域会变成白色',
        ],
    },
    png: {
        fullName: 'PNG (Portable Network Graphics)',
        fullNameZh: 'PNG（便携式网络图形）',
        description: 'PNG is a lossless image format that supports transparency, making it ideal for graphics, logos, and images requiring precise details.',
        descriptionZh: 'PNG 是一种无损图像格式，支持透明度，非常适合需要精确细节的图形、标志和图像。',
        features: [
            'Lossless compression - no quality degradation',
            'Full alpha channel transparency support',
            'Perfect for logos, icons, and graphics',
            'Sharp edges and text remain crisp',
        ],
        featuresZh: [
            '无损压缩 - 不会降低质量',
            '完整的 Alpha 通道透明度支持',
            '非常适合标志、图标和图形',
            '锐利的边缘和文字保持清晰',
        ],
        tips: [
            'PNG grayscale maintains transparency in the output',
            'Best format for images with text or sharp edges',
            'File sizes are larger than JPG but quality is perfect',
        ],
        tipsZh: [
            'PNG 灰度转换会保留输出中的透明度',
            '带有文字或锐利边缘的图像的最佳格式',
            '文件大小比 JPG 大，但质量完美',
        ],
    },
    webp: {
        fullName: 'WebP',
        fullNameZh: 'WebP',
        description: 'WebP is a modern image format developed by Google, offering superior compression with both lossy and lossless options.',
        descriptionZh: 'WebP 是谷歌开发的现代图像格式，提供有损和无损两种选项的出色压缩。',
        features: [
            '25-35% smaller file sizes compared to JPEG',
            'Supports both lossy and lossless compression',
            'Transparency support like PNG',
            'Supported by all major modern browsers',
        ],
        featuresZh: [
            '与 JPEG 相比文件体积小 25-35%',
            '支持有损和无损压缩',
            '像 PNG 一样支持透明度',
            '所有主流现代浏览器都支持',
        ],
        tips: [
            'WebP is ideal for web use due to smaller file sizes',
            'Most modern browsers support WebP natively',
            'Can be converted to JPG/PNG for older software compatibility',
        ],
        tipsZh: [
            'WebP 因文件体积小而非常适合网页使用',
            '大多数现代浏览器原生支持 WebP',
            '可以转换为 JPG/PNG 以兼容旧软件',
        ],
    },
    heic: {
        fullName: 'HEIC (High Efficiency Image Container)',
        fullNameZh: 'HEIC（高效图像容器）',
        description: 'HEIC is Apple\'s default image format for iPhone and iPad, offering excellent compression while maintaining high quality.',
        descriptionZh: 'HEIC 是苹果 iPhone 和 iPad 的默认图像格式，在保持高质量的同时提供出色的压缩。',
        features: [
            'Up to 50% smaller than JPEG at same quality',
            'Default format on iOS devices since iPhone 7',
            'Supports 16-bit color depth',
            'Can store multiple images in one file',
        ],
        featuresZh: [
            '在相同质量下比 JPEG 小 50%',
            'iPhone 7 以来 iOS 设备的默认格式',
            '支持 16 位色深',
            '可以在一个文件中存储多张图片',
        ],
        tips: [
            'Our tool automatically converts HEIC for processing',
            'Output can be saved as JPG or PNG for better compatibility',
            'Perfect for processing iPhone photos directly',
        ],
        tipsZh: [
            '我们的工具会自动转换 HEIC 进行处理',
            '输出可以保存为 JPG 或 PNG 以获得更好的兼容性',
            '非常适合直接处理 iPhone 照片',
        ],
    },
};

export async function generateMetadata(props: { params: Promise<{ locale: string; slug: string }> }) {
    const params = await props.params;
    const { locale, slug } = params;

    // 从 slug 解析 format
    const format = getFormatFromSlug(slug);
    if (!format) {
        return {};
    }

    const t = await getTranslations({ locale, namespace: 'metadata' });
    const formatUpper = format.toUpperCase();
    const isZh = locale === 'zh';
    const ogImage = 'https://makebw.com/web-app-manifest-512x512.png';

    return {
        title: t('format_title', { format: formatUpper }),
        description: t('format_desc', { format: formatUpper }),
        openGraph: {
            title: t('format_title', { format: formatUpper }),
            description: t('format_desc', { format: formatUpper }),
            type: 'website',
            url: `https://makebw.com/${locale}/${slug}`,
            images: [
                {
                    url: ogImage,
                    width: 512,
                    height: 512,
                    alt: isZh ? `MakeBW ${formatUpper} 转黑白工具` : `MakeBW ${formatUpper} to B&W Converter`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('format_title', { format: formatUpper }),
            description: t('format_desc', { format: formatUpper }),
            images: [ogImage],
        },
        alternates: {
            canonical: `/${locale}/${slug}`,
            languages: {
                'en': `/en/${slug}`,
                'zh': `/zh/${slug}`,
            },
        },
    };
}

export default async function FormatToBWPage(props: { params: Promise<{ locale: string; slug: string }> }) {
    const params = await props.params;
    const { locale, slug } = params;

    // 1. 解析 format，如果 slug 不符合格式（例如不是 xxx-to-black-and-white），则返回 404
    const format = getFormatFromSlug(slug);
    if (!format) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'formats' });
    const formatUpper = format.toUpperCase();
    const details = formatDetails[format];
    const isZh = locale === 'zh';

    // 面包屑 - 使用 slug
    const breadcrumbs = [
        { name: isZh ? '首页' : 'Home', url: `https://makebw.com/${locale}` },
        { name: `${formatUpper} to B&W`, url: `https://makebw.com/${locale}/${slug}` },
    ];

    // FAQ
    const faqItems = isZh ? [
        { question: `如何将 ${formatUpper} 图片转换为黑白？`, answer: `只需将您的 ${formatUpper} 图片拖放到上传区域，或点击选择文件。图片会自动转换为灰度模式，您可以立即预览并下载。` },
        { question: '转换后的质量会变差吗？', answer: '不会。我们的转换保持原始分辨率，只是移除颜色信息。您可以选择 PNG 格式下载以获得最高质量。' },
        { question: '我的图片安全吗？', answer: '绝对安全。所有处理都在您的浏览器本地完成，图片从不上传到我们的服务器。' },
        { question: '可以批量转换吗？', answer: '目前每次只能处理一张图片，但每次转换都是即时完成的，您可以快速连续处理多张图片。' },
    ] : [
        { question: `How do I convert ${formatUpper} images to black and white?`, answer: `Simply drag and drop your ${formatUpper} image to the upload area, or click to select a file. The image will automatically convert to grayscale, and you can preview and download immediately.` },
        { question: 'Will the quality decrease after conversion?', answer: 'No. Our conversion maintains the original resolution, only removing color information. You can choose PNG format for the highest quality.' },
        { question: 'Are my images safe?', answer: 'Absolutely. All processing happens locally in your browser. Images are never uploaded to our servers.' },
        { question: 'Can I batch convert?', answer: 'Currently, you can only process one image at a time, but each conversion is instant, allowing you to quickly process multiple images in succession.' },
    ];

    // HowTo
    const howToSteps = isZh ? [
        { name: '上传图片', text: `点击上传区域或拖放您的 ${formatUpper} 图片。` },
        { name: '预览效果', text: '图片自动转换为灰度，实时预览结果。' },
        { name: '选择格式', text: '选择下载格式（PNG 无损或 JPG 压缩）。' },
        { name: '下载使用', text: '点击下载按钮保存处理后的图片。' },
    ] : [
        { name: 'Upload Image', text: `Click the upload area or drag and drop your ${formatUpper} image.` },
        { name: 'Preview Result', text: 'Image automatically converts to grayscale with real-time preview.' },
        { name: 'Choose Format', text: 'Select download format (PNG lossless or JPG compressed).' },
        { name: 'Download', text: 'Click the download button to save the processed image.' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Structured Data */}
            <BreadcrumbSchema items={breadcrumbs} />
            <FAQSchema items={faqItems} />
            <HowToSchema 
                name={isZh ? `如何将 ${formatUpper} 转换为黑白` : `How to Convert ${formatUpper} to Black and White`}
                description={isZh ? `使用 MakeBW 免费在线工具，即时将 ${formatUpper} 图片转换为黑白。` : `Use MakeBW free online tool to instantly convert ${formatUpper} images to black and white.`}
                steps={howToSteps}
            />

            {/* Hero */}
            <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                            <FileImage className="mr-2 h-4 w-4" />
                            {isZh ? details.fullNameZh : details.fullName}
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {isZh ? `将 ${formatUpper} 转换为黑白` : `Convert ${formatUpper} to Black and White`}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {isZh ? details.descriptionZh : details.description}
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

            {/* How It Works */}
            <section className="py-16 bg-muted/20">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            {isZh ? '如何使用？' : 'How It Works'}
                        </h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            {howToSteps.map((step, index) => (
                                <div key={index} className="text-center space-y-3">
                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                        {index + 1}
                                    </div>
                                    <h3 className="font-semibold">{step.name}</h3>
                                    <p className="text-sm text-muted-foreground">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Format Features */}
            <section className="py-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            {isZh ? `${formatUpper} 格式特点` : `${formatUpper} Format Features`}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {(isZh ? details.featuresZh : details.features).map((feature, index) => (
                                <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/30">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-muted-foreground">{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="py-16 bg-muted/20">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            {isZh ? '使用技巧' : 'Pro Tips'}
                        </h2>
                        <div className="space-y-4">
                            {(isZh ? details.tipsZh : details.tips).map((tip, index) => (
                                <div key={index} className="flex gap-3 p-4 rounded-lg bg-background">
                                    <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <p className="text-muted-foreground">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why MakeBW */}
            <section className="py-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            {isZh ? '为什么选择 MakeBW？' : 'Why Choose MakeBW?'}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '100% 隐私' : '100% Private'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '所有处理在浏览器本地完成，图片从不上传。'
                                        : 'All processing happens locally, images never leave your device.'}
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '即时转换' : 'Instant'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '无需等待上传下载，转换在毫秒内完成。'
                                        : 'No waiting for uploads, conversion happens in milliseconds.'}
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <FileImage className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '高质量' : 'High Quality'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '保持原始分辨率，支持无损 PNG 输出。'
                                        : 'Maintains resolution, supports lossless PNG output.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-muted/20">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            {isZh ? '常见问题' : 'Frequently Asked Questions'}
                        </h2>
                        <div className="space-y-6">
                            {faqItems.map((item, index) => (
                                <div key={index} className="border-b pb-6">
                                    <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                                    <p className="text-muted-foreground">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Formats */}
            <section className="py-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-6">
                            {isZh ? '支持的其他格式' : 'Other Supported Formats'}
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {supportedFormats.filter(f => f !== format).map((f) => (
                                <a 
                                    key={f}
                                    href={`/${locale}/${f}-to-black-and-white`}
                                    className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
                                >
                                    {f.toUpperCase()} to B&W
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
