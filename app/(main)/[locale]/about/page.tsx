import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Shield, Zap, CheckCircle, Code2, Eye, Scale } from "lucide-react";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

// ✅ Cloudflare Edge Runtime
export const runtime = 'edge';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;

    const isZh = locale === 'zh';
    const ogImage = 'https://makebw.com/web-app-manifest-512x512.png';
    const title = isZh ? '关于我们 - MakeBW.com' : 'About Us - MakeBW.com';
    const description = isZh
        ? 'MakeBW 是由开发者 Bai 创建的免费图片黑白转换工具。我们致力于提供最快、最安全的浏览器端图片处理方案。'
        : 'MakeBW is a free image-to-black-and-white converter created by developer Bai. We are committed to providing the fastest and most secure browser-based image processing.';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://makebw.com/${locale}/about`,
            images: [
                {
                    url: ogImage,
                    width: 512,
                    height: 512,
                    alt: isZh ? 'MakeBW 关于我们' : 'MakeBW About Us',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: `/${locale}/about`,
            languages: {
                'en': '/en/about',
                'zh': '/zh/about',
                'x-default': '/en/about',
            },
        },
    };
}

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;

    const isZh = locale === 'zh';
    const localePrefix = `/${locale}`;

    // 面包屑
    const breadcrumbs = [
        { name: isZh ? '首页' : 'Home', url: `https://makebw.com/${locale}` },
        { name: isZh ? '关于我们' : 'About Us', url: `https://makebw.com/${locale}/about` },
    ];

    return (
        <div className="min-h-screen bg-[#f7f6f2]">
            <BreadcrumbSchema items={breadcrumbs} />

            {/* Header */}
            <div className="border-b border-[#ddd9ce] bg-[#fcfbf8]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fcfbf8]/60">
                <div className="container px-4 md:px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="sm" className="gap-2">
                            <Link href={localePrefix}>
                                <ArrowLeft className="h-4 w-4" />
                                {isZh ? '返回首页' : 'Back to Home'}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 py-16 md:px-6 md:py-24">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#706f69]">MakeBW</p>
                        <h1 className="text-4xl font-bold tracking-tight text-[#2d2d2d] sm:text-5xl">
                            {isZh ? '关于 MakeBW' : 'About MakeBW'}
                        </h1>
                        <p className="mx-auto max-w-3xl text-xl leading-8 text-[#666]">
                            {isZh
                                ? '由开发者为设计师、家长和教育工作者打造的免费在线图片处理工具。'
                                : 'A free online image processing tool built by developers for designers, parents, and educators.'}
                        </p>
                    </div>

                    {/* Our Story */}
                    <div className="rounded-2xl border border-[#d9d7d0] bg-[#fcfbf8] p-8 shadow-[0_10px_28px_rgba(24,24,23,0.06)] md:p-12">
                        <h2 className="mb-6 text-2xl font-bold text-[#2d2d2d]">
                            {isZh ? '我们的故事' : 'Our Story'}
                        </h2>
                        <div className="space-y-4 leading-8 text-[#666]">
                            <p>
                                {isZh
                                    ? 'MakeBW 诞生于一个简单的需求：我需要一个快速、免费且不会上传我照片的黑白转换工具。市面上的工具要么需要上传图片到服务器（隐私风险），要么需要付费订阅，要么功能过于复杂。'
                                    : 'MakeBW was born from a simple need: I wanted a fast, free tool that could convert images to black and white without uploading my photos anywhere. Existing tools either required uploading to servers (privacy risk), paid subscriptions, or were overly complex.'}
                            </p>
                            <p>
                                {isZh
                                    ? '作为一名开发者，我决定自己动手。利用现代浏览器的 Canvas API，我创建了这个完全在浏览器端运行的工具。您的图片从头到尾都不会离开您的设备。'
                                    : 'As a developer, I decided to build it myself. Using modern browser Canvas API, I created this tool that runs entirely in your browser. Your images never leave your device from start to finish.'}
                            </p>
                            <p>
                                {isZh
                                    ? '我深知家长想为孩子制作自定义填色画的心情，也了解老师需要快速创建教学材料的需求，更明白打印时节省墨水对很多人来说很重要。MakeBW 正是为这些真实需求而生。'
                                    : 'I understand parents wanting to create custom coloring pages for their kids, teachers needing to quickly create teaching materials, and how important saving printer ink is for many people. MakeBW is built for these real needs.'}
                            </p>
                        </div>
                    </div>

                    {/* Author and accountability */}
                    <section className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                        <div className="rounded-xl bg-[#181817] p-7 text-white">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b6e62e]">{isZh ? '创作者' : 'Creator'}</p>
                            <h2 className="mt-3 text-2xl font-bold">{isZh ? '由 Bai 独立维护' : 'Independently maintained by Bai'}</h2>
                        </div>
                        <div className="rounded-xl border border-[#d9d7d0] bg-[#efeee8] p-7">
                            <p className="leading-8 text-[#555]">{isZh ? 'MakeBW 由开发者 Bai 维护。产品范围、处理方式和隐私说明会随着工具更新而同步维护；我们不把浏览器端处理描述为人工修图或生成式 AI。' : 'MakeBW is maintained by developer Bai. Product scope, processing behavior, and privacy notes are kept alongside tool updates. Browser-side image processing is never presented as manual retouching or generative AI.'}</p>
                        </div>
                    </section>

                    {/* Values */}
                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="border border-[#d9d7d0] bg-[#fcfbf8] shadow-[0_4px_12px_rgba(24,24,23,0.04)] transition-shadow hover:shadow-md">
                            <CardHeader>
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#e7f6b2]">
                                    <Shield className="h-5 w-5 text-[#2d2d2d]" />
                                </div>
                                <CardTitle>{isZh ? '隐私优先' : 'Privacy First'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-7 text-[#666]">
                                    {isZh
                                        ? '所有图片处理都在您的浏览器本地完成。我们没有服务器存储您的图片，因为我们根本不会收到它们。'
                                        : 'All image processing happens locally in your browser. We have no servers storing your images because we never receive them.'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border border-[#d9d7d0] bg-[#fcfbf8] shadow-[0_4px_12px_rgba(24,24,23,0.04)] transition-shadow hover:shadow-md">
                            <CardHeader>
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#eee8ff]">
                                    <Zap className="h-5 w-5 text-[#5d35d8]" />
                                </div>
                                <CardTitle>{isZh ? '简单快速' : 'Simple & Fast'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-7 text-[#666]">
                                    {isZh
                                        ? '没有复杂的注册流程，没有需要学习的软件。上传、转换、下载——就是这么简单。'
                                        : 'No complicated sign-up process, no software to learn. Upload, convert, download—it\'s that simple.'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border border-[#d9d7d0] bg-[#fcfbf8] shadow-[0_4px_12px_rgba(24,24,23,0.04)] transition-shadow hover:shadow-md">
                            <CardHeader>
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#fbe9c6]">
                                    <Heart className="h-5 w-5 text-[#9a6115]" />
                                </div>
                                <CardTitle>{isZh ? '永久免费' : 'Forever Free'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-7 text-[#666]">
                                    {isZh
                                        ? '基础功能永远免费。我相信每个人都应该能够轻松获取这些工具。'
                                        : 'Core features are free forever. I believe everyone should have easy access to these tools.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Method and limitations */}
                    <section className="grid gap-4 md:grid-cols-2">
                        <article className="rounded-xl border border-[#d9d7d0] bg-[#fcfbf8] p-7 shadow-[0_4px_12px_rgba(24,24,23,0.04)]">
                            <Code2 className="mb-5 h-6 w-6 text-[#5d35d8]" />
                            <h2 className="text-xl font-bold text-[#2d2d2d]">{isZh ? '处理方法' : 'How the tools work'}</h2>
                            <p className="mt-3 leading-7 text-[#666]">{isZh ? 'MakeBW 使用浏览器 Canvas API 读取并处理像素。灰度转换使用亮度加权公式；阈值工具将像素划分为纯黑或纯白；线稿工具通过边缘检测突出轮廓。处理结果由当前设备生成。' : 'MakeBW uses the browser Canvas API to read and process pixels. Grayscale uses luminance weighting; the threshold tool classifies pixels as black or white; line art uses edge detection to emphasise contours. Results are generated on the current device.'}</p>
                        </article>
                        <article className="rounded-xl border border-[#d9d7d0] bg-[#fcfbf8] p-7 shadow-[0_4px_12px_rgba(24,24,23,0.04)]">
                            <Eye className="mb-5 h-6 w-6 text-[#5d35d8]" />
                            <h2 className="text-xl font-bold text-[#2d2d2d]">{isZh ? '适用范围与限制' : 'Scope and limitations'}</h2>
                            <p className="mt-3 leading-7 text-[#666]">{isZh ? '工具适用于静态图片的本地处理。效果会受原图分辨率、光线、压缩和浏览器性能影响；它不会修复模糊照片、识别文件内容，也不替代专业修图、OCR 或法律/医疗图像处理。' : 'The tools are for local processing of still images. Results depend on source resolution, lighting, compression, and browser performance. They do not repair blur, interpret document contents, or replace professional retouching, OCR, or legal or medical image workflows.'}</p>
                        </article>
                    </section>

                    {/* What We Offer */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-center">
                            {isZh ? '我们提供什么' : 'What We Offer'}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '灰度转换' : 'Grayscale Conversion'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh
                                            ? '将彩色照片转为黑白，节省打印墨水，创造经典效果。'
                                            : 'Convert color photos to black and white, save printer ink, create classic effects.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '填色画生成' : 'Coloring Page Generator'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh
                                            ? '从任何照片提取线稿，制作可打印的儿童填色画。'
                                            : 'Extract line art from any photo, create printable coloring pages for kids.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '反色效果' : 'Color Inversion'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh
                                            ? '创建负片效果，用于特殊设计和艺术创作。'
                                            : 'Create negative effects for special designs and artistic creation.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">{isZh ? '多格式支持' : 'Multi-Format Support'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh
                                            ? '支持 JPG、PNG、WebP、HEIC（iPhone）等主流格式。'
                                            : 'Support for JPG, PNG, WebP, HEIC (iPhone) and other popular formats.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="rounded-xl border border-[#d9d7d0] bg-[#efeee8] p-7 md:p-8">
                        <div className="flex gap-4">
                            <Scale className="mt-1 h-6 w-6 shrink-0 text-[#5d35d8]" />
                            <div>
                                <h2 className="text-xl font-bold text-[#2d2d2d]">{isZh ? '透明承诺' : 'Transparency commitments'}</h2>
                                <p className="mt-3 leading-7 text-[#666]">{isZh ? '我们会清楚说明工具实际完成的操作、支持的文件格式和本地处理方式。有关数据处理与使用范围，请查看隐私政策和服务条款。' : 'We describe what each tool actually does, the file formats it supports, and how local processing works. For data handling and permitted use, read the Privacy Policy and Terms of Service.'}</p>
                                <div className="mt-5 flex flex-wrap gap-3">
                                    <Link href={`${localePrefix}/privacy`} className="rounded-full border border-[#d9d7d0] bg-[#fcfbf8] px-4 py-2 text-sm font-semibold text-[#2d2d2d] transition hover:border-[#181817]">{isZh ? '隐私政策' : 'Privacy Policy'}</Link>
                                    <Link href={`${localePrefix}/terms`} className="rounded-full border border-[#d9d7d0] bg-[#fcfbf8] px-4 py-2 text-sm font-semibold text-[#2d2d2d] transition hover:border-[#181817]">{isZh ? '服务条款' : 'Terms of Service'}</Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="rounded-2xl bg-[#181817] p-8 text-center text-white shadow-[0_16px_40px_rgba(24,24,23,0.15)] md:p-12">
                        <h3 className="text-2xl font-bold mb-4">
                            {isZh ? '开始使用' : 'Get Started'}
                        </h3>
                        <p className="mx-auto mb-6 max-w-2xl text-[#d8d7d1]">
                            {isZh
                                ? '无需注册，无需安装。立即开始转换您的图片。'
                                : 'No registration required. No installation needed. Start converting your images now.'}
                        </p>
                        <Button asChild size="lg" className="bg-[#b6e62e] font-bold text-[#181817] hover:bg-[#c6f34a]">
                            <Link href={localePrefix}>
                                {isZh ? '免费开始' : 'Start Free'}
                            </Link>
                        </Button>
                    </div>

                    {/* Contact */}
                    <div className="text-center text-sm text-muted-foreground">
                        <p>
                            {isZh ? '有问题或建议？' : 'Questions or suggestions?'}
                        </p>
                        <p className="mt-2">
                            Built with ❤️ by <span className="font-medium">Bai</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
