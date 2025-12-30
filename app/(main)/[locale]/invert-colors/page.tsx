import { getTranslations } from 'next-intl/server';
import ImageEditor from '@/components/feature/image-editor';
import { Sparkles, Eye, Palette, CheckCircle, Camera, Lightbulb } from 'lucide-react';
import { BreadcrumbSchema, FAQSchema, HowToSchema } from '@/components/breadcrumb-schema';

// ✅ Cloudflare Edge Runtime
export const runtime = 'edge';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const t = await getTranslations({ locale, namespace: 'pages' });

    const isZh = locale === 'zh';
    const ogImage = 'https://makebw.com/web-app-manifest-512x512.png';

    return {
        title: t('invert_title'),
        description: t('invert_desc'),
        openGraph: {
            title: t('invert_title'),
            description: t('invert_desc'),
            type: 'website',
            url: `https://makebw.com/${locale}/invert-colors`,
            images: [
                {
                    url: ogImage,
                    width: 512,
                    height: 512,
                    alt: isZh ? 'MakeBW 反色工具' : 'MakeBW Color Inverter',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('invert_title'),
            description: t('invert_desc'),
            images: [ogImage],
        },
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

    const isZh = locale === 'zh';

    // 面包屑
    const breadcrumbs = [
        { name: isZh ? '首页' : 'Home', url: `https://makebw.com/${locale}` },
        { name: isZh ? '反色工具' : 'Invert Colors', url: `https://makebw.com/${locale}/invert-colors` },
    ];

    // FAQ
    const faqItems = isZh ? [
        { question: '什么是颜色反转/负片效果？', answer: '颜色反转是将图像中每个像素的颜色替换为其互补色。例如，黑色变成白色，红色变成青色。这创造出类似传统胶片负片的效果。' },
        { question: '反色有什么实际用途？', answer: '反色广泛用于：医学影像分析（X光片）、设计中的视觉对比效果、暗色模式界面设计、艺术创作、以及帮助某些视觉障碍人士更好地阅读内容。' },
        { question: '反色两次会恢复原图吗？', answer: '是的！对一张图片进行两次反色操作后，会恢复到原始图像。这是因为互补色的互补色就是原色。' },
        { question: '支持透明背景吗？', answer: '支持。如果您上传的 PNG 图片有透明区域，反色时会保留透明度，只反转有颜色的区域。' },
    ] : [
        { question: 'What is color inversion/negative effect?', answer: 'Color inversion replaces each pixel\'s color with its complementary color. For example, black becomes white, red becomes cyan. This creates an effect similar to traditional film negatives.' },
        { question: 'What are the practical uses of color inversion?', answer: 'Color inversion is widely used for: medical imaging analysis (X-rays), visual contrast effects in design, dark mode interface design, artistic creation, and helping some visually impaired people read content better.' },
        { question: 'Will inverting twice restore the original?', answer: 'Yes! Inverting an image twice will restore it to the original. This is because the complement of a complement is the original color.' },
        { question: 'Does it support transparent backgrounds?', answer: 'Yes. If your PNG image has transparent areas, the inversion will preserve transparency and only invert the colored areas.' },
    ];

    // HowTo 步骤
    const howToSteps = isZh ? [
        { name: '上传图片', text: '点击上传区域或拖拽图片到页面上。支持 JPG、PNG、WebP、HEIC 格式。' },
        { name: '选择反色模式', text: '在转换模式中选择"反色"选项。' },
        { name: '预览效果', text: '立即查看反色后的效果，所有颜色都将变成互补色。' },
        { name: '下载保存', text: '选择 PNG（保留透明度）或 JPG 格式下载。' },
    ] : [
        { name: 'Upload Image', text: 'Click the upload area or drag and drop your image. Supports JPG, PNG, WebP, and HEIC formats.' },
        { name: 'Select Invert Mode', text: 'Choose "Invert Colors" from the conversion mode options.' },
        { name: 'Preview Effect', text: 'Immediately see the inverted result with all colors changed to their complements.' },
        { name: 'Download', text: 'Choose PNG (preserves transparency) or JPG format and download.' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Structured Data */}
            <BreadcrumbSchema items={breadcrumbs} />
            <FAQSchema items={faqItems} />
            <HowToSchema 
                name={isZh ? '如何反转图片颜色' : 'How to Invert Image Colors'}
                description={isZh ? '使用 MakeBW 免费在线工具，一键创建负片效果。' : 'Use MakeBW free online tool to create negative effects with one click.'}
                steps={howToSteps}
            />

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

            {/* Use Cases */}
            <section className="py-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            {isZh ? '适用场景' : 'Use Cases'}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Palette className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '艺术创作' : 'Art & Design'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '创造独特的视觉效果，用于海报、封面设计或数字艺术作品。'
                                        : 'Create unique visual effects for posters, cover designs, or digital artwork.'}
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Eye className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '视觉辅助' : 'Visual Accessibility'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '帮助某些视觉障碍人士更容易阅读和理解图像内容。'
                                        : 'Help some visually impaired people more easily read and understand image content.'}
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Lightbulb className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '暗色主题' : 'Dark Mode Design'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '快速创建暗色版本的图标或界面元素，适配暗色模式。'
                                        : 'Quickly create dark versions of icons or UI elements for dark mode compatibility.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Explanation */}
            <section className="py-16 bg-muted/20">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            {isZh ? '技术原理' : 'How It Works Technically'}
                        </h2>
                        <div className="bg-background rounded-lg p-6 space-y-4">
                            <p className="text-muted-foreground">
                                {isZh 
                                    ? '颜色反转的数学原理非常简单：对于 RGB 颜色空间中的每个通道，用 255 减去原始值。'
                                    : 'The mathematics of color inversion is simple: for each channel in the RGB color space, subtract the original value from 255.'}
                            </p>
                            <div className="bg-muted/50 rounded p-4 font-mono text-sm">
                                <p>New R = 255 - Original R</p>
                                <p>New G = 255 - Original G</p>
                                <p>New B = 255 - Original B</p>
                            </div>
                            <p className="text-muted-foreground">
                                {isZh 
                                    ? '例如：纯红色 (255, 0, 0) 反转后变成青色 (0, 255, 255)。白色 (255, 255, 255) 变成黑色 (0, 0, 0)。'
                                    : 'For example: pure red (255, 0, 0) becomes cyan (0, 255, 255) after inversion. White (255, 255, 255) becomes black (0, 0, 0).'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            {isZh ? '为什么选择 MakeBW？' : 'Why Choose MakeBW?'}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '隐私保护' : 'Privacy Protected'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '图片完全在浏览器本地处理，从不上传。'
                                            : 'Images are processed entirely in your browser, never uploaded.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '保留透明度' : 'Preserves Transparency'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? 'PNG 图片的透明区域会被保留，只反转有颜色的部分。'
                                            : 'Transparent areas in PNG images are preserved, only colored areas are inverted.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '即时预览' : 'Instant Preview'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '转换结果实时显示，无需等待。'
                                            : 'Conversion results are displayed in real-time, no waiting.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '完全免费' : 'Completely Free'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '无需注册，无需付费，无任何限制。'
                                            : 'No registration, no payment, no limits.'}
                                    </p>
                                </div>
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
        </div>
    );
}
