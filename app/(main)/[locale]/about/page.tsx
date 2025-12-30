import { getTranslations } from 'next-intl/server';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Shield, Zap, Globe, CheckCircle } from "lucide-react";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;

    const isZh = locale === 'zh';

    return {
        title: isZh ? '关于我们 - MakeBW.com' : 'About Us - MakeBW.com',
        description: isZh 
            ? 'MakeBW 是由开发者 Bai 创建的免费图片黑白转换工具。我们致力于提供最快、最安全的浏览器端图片处理方案。'
            : 'MakeBW is a free image-to-black-and-white converter created by developer Bai. We are committed to providing the fastest and most secure browser-based image processing.',
        alternates: {
            canonical: `/${locale}/about`,
            languages: {
                'en': '/en/about',
                'zh': '/zh/about',
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
        <div className="min-h-screen bg-background">
            <BreadcrumbSchema items={breadcrumbs} />

            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <div className="container px-4 md:px-6 py-16">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {isZh ? '关于 MakeBW' : 'About MakeBW'}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            {isZh 
                                ? '由开发者为设计师、家长和教育工作者打造的免费在线图片处理工具。'
                                : 'A free online image processing tool built by developers for designers, parents, and educators.'}
                        </p>
                    </div>

                    {/* Our Story */}
                    <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
                        <h2 className="text-2xl font-bold mb-6">
                            {isZh ? '我们的故事' : 'Our Story'}
                        </h2>
                        <div className="space-y-4 text-muted-foreground">
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

                    {/* Values */}
                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="border-2 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>{isZh ? '隐私优先' : 'Privacy First'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {isZh 
                                        ? '所有图片处理都在您的浏览器本地完成。我们没有服务器存储您的图片，因为我们根本不会收到它们。'
                                        : 'All image processing happens locally in your browser. We have no servers storing your images because we never receive them.'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>{isZh ? '简单快速' : 'Simple & Fast'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {isZh 
                                        ? '没有复杂的注册流程，没有需要学习的软件。上传、转换、下载——就是这么简单。'
                                        : 'No complicated sign-up process, no software to learn. Upload, convert, download—it\'s that simple.'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>{isZh ? '永久免费' : 'Forever Free'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {isZh 
                                        ? '基础功能永远免费。我相信每个人都应该能够轻松获取这些工具。'
                                        : 'Core features are free forever. I believe everyone should have easy access to these tools.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

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

                    {/* CTA */}
                    <div className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
                        <h3 className="text-2xl font-bold mb-4">
                            {isZh ? '开始使用' : 'Get Started'}
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            {isZh 
                                ? '无需注册，无需安装。立即开始转换您的图片。'
                                : 'No registration required. No installation needed. Start converting your images now.'}
                        </p>
                        <Button asChild size="lg" className="font-medium">
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
