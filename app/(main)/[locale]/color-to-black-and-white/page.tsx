import { getTranslations } from 'next-intl/server';
import ImageEditor from '@/components/feature/image-editor';
import { Printer, FileDown, DollarSign, CheckCircle, Camera, FileText } from 'lucide-react';
import { BreadcrumbSchema, FAQSchema, HowToSchema } from '@/components/breadcrumb-schema';

// ✅ Cloudflare Edge Runtime
export const runtime = 'edge';

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

    const isZh = locale === 'zh';

    // 面包屑
    const breadcrumbs = [
        { name: isZh ? '首页' : 'Home', url: `https://makebw.com/${locale}` },
        { name: isZh ? '彩色转黑白' : 'Color to Black & White', url: `https://makebw.com/${locale}/color-to-black-and-white` },
    ];

    // FAQ
    const faqItems = isZh ? [
        { question: '灰度和黑白有什么区别？', answer: '灰度图像包含从纯黑到纯白之间的所有灰色阶调（通常256级），而纯黑白图像只有两种颜色。我们的工具生成的是灰度图像，保留更多细节。' },
        { question: '转换后的图片质量会下降吗？', answer: '不会。我们的转换算法保持原始分辨率，只是移除颜色信息。您可以选择 PNG 格式下载以获得最高质量。' },
        { question: '可以用于商业用途吗？', answer: '当然可以！转换后的图片完全属于您，可以用于任何个人或商业用途。' },
        { question: '支持批量转换吗？', answer: '目前每次只能处理一张图片。如需批量处理，您可以多次使用我们的工具，每次转换都是即时完成的。' },
    ] : [
        { question: 'What\'s the difference between grayscale and black & white?', answer: 'Grayscale images contain all shades of gray from pure black to pure white (usually 256 levels), while pure black & white only has two colors. Our tool generates grayscale images, preserving more detail.' },
        { question: 'Will the image quality decrease after conversion?', answer: 'No. Our conversion algorithm maintains the original resolution, only removing color information. You can choose PNG format for the highest quality.' },
        { question: 'Can I use converted images commercially?', answer: 'Absolutely! The converted images belong entirely to you and can be used for any personal or commercial purpose.' },
        { question: 'Does it support batch conversion?', answer: 'Currently, you can only process one image at a time. For batch processing, you can use our tool multiple times—each conversion is instant.' },
    ];

    // HowTo 步骤
    const howToSteps = isZh ? [
        { name: '上传图片', text: '点击上传区域或拖拽彩色照片到页面上。支持 JPG、PNG、WebP、HEIC 格式。' },
        { name: '自动转换', text: '图片会自动转换为灰度模式，您可以立即预览效果。' },
        { name: '调整效果', text: '根据需要切换不同的转换模式（灰度、线稿、反色）。' },
        { name: '下载使用', text: '选择 PNG 或 JPG 格式下载，即可用于打印或其他用途。' },
    ] : [
        { name: 'Upload Image', text: 'Click the upload area or drag and drop your color photo. Supports JPG, PNG, WebP, and HEIC formats.' },
        { name: 'Auto Conversion', text: 'The image will automatically convert to grayscale mode. You can preview the result immediately.' },
        { name: 'Adjust Settings', text: 'Switch between different conversion modes (grayscale, line art, invert) as needed.' },
        { name: 'Download', text: 'Choose PNG or JPG format and download for printing or other uses.' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Structured Data */}
            <BreadcrumbSchema items={breadcrumbs} />
            <FAQSchema items={faqItems} />
            <HowToSchema 
                name={isZh ? '如何将彩色照片转换为黑白' : 'How to Convert Color Photos to Black and White'}
                description={isZh ? '使用 MakeBW 免费在线工具，4步将彩色照片转换为经典黑白效果。' : 'Use MakeBW free online tool to convert color photos to classic black and white in 4 steps.'}
                steps={howToSteps}
            />

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
                            {isZh ? '适用场景' : 'Perfect For'}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Printer className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '节省打印成本' : 'Save Printing Costs'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '黑白打印比彩色打印便宜 40-60%。预先转换可以节省大量墨水和碳粉费用。'
                                        : 'Black & white printing costs 40-60% less than color. Pre-converting saves significant ink and toner costs.'}
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <Camera className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '艺术摄影' : 'Art Photography'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '黑白照片能突出光影、纹理和构图，创造永恒经典的艺术效果。'
                                        : 'B&W photos emphasize light, shadow, texture, and composition, creating timeless artistic effects.'}
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">{isZh ? '文档处理' : 'Document Processing'}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isZh 
                                        ? '将彩色文档扫描件转为黑白，减小文件大小，便于存档和传输。'
                                        : 'Convert color document scans to B&W, reducing file size for easier archiving and sharing.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
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
                                    <h3 className="font-semibold mb-1">{isZh ? '完全隐私' : 'Complete Privacy'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '图片在浏览器本地处理，从不上传到服务器。'
                                            : 'Images are processed locally in your browser, never uploaded to servers.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-background">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '即时转换' : 'Instant Conversion'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '无需等待上传下载，转换在毫秒内完成。'
                                            : 'No waiting for upload/download, conversion happens in milliseconds.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-background">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '高质量输出' : 'High Quality Output'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '保持原始分辨率，支持 PNG 无损格式下载。'
                                            : 'Maintains original resolution, supports lossless PNG download.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-background">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '永久免费' : 'Forever Free'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '无需注册，无需付费，无任何限制。'
                                            : 'No registration, no payment, no limits whatsoever.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Info */}
            <section className="py-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            {isZh ? '技术说明' : 'Technical Details'}
                        </h2>
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-muted-foreground">
                                {isZh 
                                    ? '我们的灰度转换使用加权平均法，根据人眼对不同颜色的敏感度进行计算：R × 0.299 + G × 0.587 + B × 0.114。这种方法比简单平均更能保留图像的视觉层次感。'
                                    : 'Our grayscale conversion uses the weighted average method, calculated based on human eye sensitivity to different colors: R × 0.299 + G × 0.587 + B × 0.114. This method preserves visual hierarchy better than simple averaging.'}
                            </p>
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
