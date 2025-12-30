import { getTranslations } from 'next-intl/server';
import ImageEditor from '@/components/feature/image-editor';
import { Palette, Users, GraduationCap, CheckCircle } from 'lucide-react';
import { BreadcrumbSchema, FAQSchema, HowToSchema } from '@/components/breadcrumb-schema';

// ✅ Cloudflare Edge Runtime
export const runtime = 'edge';

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

    const isZh = locale === 'zh';

    // 面包屑数据
    const breadcrumbs = [
        { name: isZh ? '首页' : 'Home', url: `https://makebw.com/${locale}` },
        { name: isZh ? '填色画生成器' : 'Coloring Page Generator', url: `https://makebw.com/${locale}/photo-to-coloring-page` },
    ];

    // FAQ 数据
    const faqItems = isZh ? [
        { question: '支持 iPhone 拍的照片吗？', answer: '完全支持！我们的工具支持 HEIC 格式，这是 iPhone 的默认照片格式。上传后会自动转换处理。' },
        { question: '会上传我的照片到服务器吗？', answer: '绝对不会！所有图片处理都在您的浏览器本地完成，图片从不上传到任何服务器，完全保护您的隐私。' },
        { question: '生成的填色画可以打印吗？', answer: '当然可以！我们的线稿提取算法专门优化了打印效果，线条清晰，非常适合打印到 A4 纸上供孩子涂色。' },
        { question: '可以调整线条粗细吗？', answer: '可以！上传图片后，您可以通过滑块调整线条粗细，找到最适合的效果后再下载。' },
    ] : [
        { question: 'Does it support iPhone photos?', answer: 'Absolutely! Our tool supports HEIC format, which is the default photo format on iPhone. It will be automatically converted after upload.' },
        { question: 'Will my photos be uploaded to a server?', answer: 'Never! All image processing happens locally in your browser. Your photos are never uploaded to any server, ensuring complete privacy.' },
        { question: 'Can I print the coloring pages?', answer: 'Yes! Our line art extraction algorithm is optimized for printing. The lines are clear and perfect for printing on A4 paper for kids to color.' },
        { question: 'Can I adjust line thickness?', answer: 'Yes! After uploading your image, you can use the slider to adjust line thickness and find the perfect result before downloading.' },
    ];

    // HowTo 步骤
    const howToSteps = isZh ? [
        { name: '上传图片', text: '点击上传区域或拖拽照片到页面上。支持 JPG、PNG、WebP、HEIC 格式。' },
        { name: '选择线稿模式', text: '在转换模式中选择"线稿（填色画）"选项。' },
        { name: '调整参数', text: '使用滑块调整线条粗细，预览效果直到满意。' },
        { name: '下载保存', text: '选择 PNG 或 JPG 格式下载，即可打印使用。' },
    ] : [
        { name: 'Upload Your Image', text: 'Click the upload area or drag and drop your photo. Supports JPG, PNG, WebP, and HEIC formats.' },
        { name: 'Select Line Art Mode', text: 'Choose "Line Art (Coloring Page)" from the conversion mode options.' },
        { name: 'Adjust Settings', text: 'Use the slider to adjust line thickness until you\'re satisfied with the preview.' },
        { name: 'Download', text: 'Choose PNG or JPG format and download. Ready to print!' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Structured Data */}
            <BreadcrumbSchema items={breadcrumbs} />
            <FAQSchema items={faqItems} />
            <HowToSchema 
                name={isZh ? '如何把照片转换成填色画' : 'How to Convert Photos to Coloring Pages'}
                description={isZh ? '使用 MakeBW 免费在线工具，只需4步即可将任何照片转换成可打印的填色画。' : 'Use MakeBW free online tool to convert any photo into a printable coloring page in just 4 steps.'}
                steps={howToSteps}
            />

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
                            {isZh ? '适合谁使用？' : 'Perfect For'}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '家长' : 'Parents'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '将家人照片转换成填色画，让孩子创作独特的家庭艺术作品。'
                                        : 'Create custom coloring pages from family photos for kids to color.'}
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <GraduationCap className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '老师' : 'Teachers'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '为课堂活动生成教育性填色材料，让学习更有趣。'
                                        : 'Generate educational coloring materials for classroom activities.'}
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Palette className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '艺术家' : 'Artists'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '从照片中提取线稿，用于描摹和插画创作。'
                                        : 'Extract line art from photos for tracing and illustration.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-muted/20">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            {isZh ? '为什么选择 MakeBW？' : 'Why Choose MakeBW?'}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex gap-4 p-4 rounded-lg bg-background">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '100% 隐私保护' : '100% Privacy'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '图片完全在浏览器本地处理，从不上传到服务器。'
                                            : 'Images are processed locally in your browser. Never uploaded to any server.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-background">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '专业边缘检测' : 'Professional Edge Detection'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '使用 Sobel 边缘检测算法，生成清晰、专业的线稿效果。'
                                            : 'Using Sobel edge detection algorithm for clear, professional line art.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-background">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '打印优化' : 'Print Optimized'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '输出专门针对打印优化，线条清晰，适合 A4 纸打印。'
                                            : 'Output is optimized for printing with clear lines, perfect for A4 paper.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-background">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '永久免费' : 'Forever Free'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '无需注册，无需付费，无限制使用。'
                                            : 'No registration, no payment, unlimited use.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16">
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
