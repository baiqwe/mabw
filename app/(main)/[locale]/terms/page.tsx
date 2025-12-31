import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale, CheckCircle, AlertCircle } from "lucide-react";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

// ✅ Cloudflare Edge Runtime
export const runtime = 'edge';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const isZh = locale === 'zh';
    const ogImage = 'https://makebw.com/web-app-manifest-512x512.png';
    const title = isZh ? '服务条款 - MakeBW.com' : 'Terms of Service - MakeBW.com';
    const description = isZh
        ? 'MakeBW.com 的服务条款。了解使用我们免费图片处理工具的条款和条件。'
        : 'Terms of Service for MakeBW.com. Learn about the terms and conditions for using our free image processing tool.';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://makebw.com/${locale}/terms`,
            images: [
                {
                    url: ogImage,
                    width: 512,
                    height: 512,
                    alt: isZh ? 'MakeBW 服务条款' : 'MakeBW Terms of Service',
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
            canonical: `/${locale}/terms`,
            languages: {
                'en': '/en/terms',
                'zh': '/zh/terms',
            },
        },
    };
}

export default async function TermsPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const isZh = locale === 'zh';
    const localePrefix = `/${locale}`;

    const breadcrumbs = [
        { name: isZh ? '首页' : 'Home', url: `https://makebw.com/${locale}` },
        { name: isZh ? '服务条款' : 'Terms of Service', url: `https://makebw.com/${locale}/terms` },
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
                        <div>
                            <h1 className="text-xl font-bold">{isZh ? '服务条款' : 'Terms of Service'}</h1>
                            <p className="text-sm text-muted-foreground">
                                {isZh ? '最后更新：2025年1月' : 'Last updated: January 2025'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 md:px-6 py-16">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Hero */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center rounded-full px-4 py-2 text-sm bg-primary/10 text-primary">
                            <Scale className="mr-2 h-5 w-5" />
                            {isZh ? '法律条款' : 'Legal Terms'}
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {isZh ? '服务条款' : 'Terms of Service'}
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            {isZh
                                ? '使用 MakeBW.com 即表示您同意以下条款。请仔细阅读。'
                                : 'By using MakeBW.com, you agree to these terms. Please read them carefully.'}
                        </p>
                    </div>

                    {/* Key Points */}
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl p-6 border border-green-200 dark:border-green-900">
                        <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">
                            {isZh ? '简要概述' : 'Quick Summary'}
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                <p className="text-muted-foreground">
                                    {isZh
                                        ? '免费使用 - 核心功能完全免费，无隐藏费用'
                                        : 'Free to use - Core features are completely free, no hidden charges'}
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                <p className="text-muted-foreground">
                                    {isZh
                                        ? '您的图片 - 转换后的图片完全属于您'
                                        : 'Your images - Converted images belong entirely to you'}
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                <p className="text-muted-foreground">
                                    {isZh
                                        ? '隐私保护 - 图片在本地处理，从不上传'
                                        : 'Privacy protected - Images are processed locally, never uploaded'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-8">
                        {/* Service Description */}
                        <div className="bg-muted/30 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold mb-4">
                                {isZh ? '1. 服务说明' : '1. Service Description'}
                            </h3>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    {isZh
                                        ? 'MakeBW.com 是一个免费的在线图片处理工具，提供以下功能：'
                                        : 'MakeBW.com is a free online image processing tool that provides:'}
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>{isZh ? '彩色图片转灰度/黑白' : 'Color image to grayscale/black and white conversion'}</li>
                                    <li>{isZh ? '照片转填色画线稿' : 'Photo to coloring page line art'}</li>
                                    <li>{isZh ? '图片颜色反转（负片效果）' : 'Image color inversion (negative effect)'}</li>
                                    <li>{isZh ? '支持 JPG、PNG、WebP、HEIC 格式' : 'Support for JPG, PNG, WebP, HEIC formats'}</li>
                                </ul>
                                <p>
                                    {isZh
                                        ? '所有图片处理都在您的浏览器本地完成，不需要上传到我们的服务器。'
                                        : 'All image processing happens locally in your browser, no upload to our servers required.'}
                                </p>
                            </div>
                        </div>

                        {/* Acceptable Use */}
                        <div className="bg-muted/30 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold mb-4">
                                {isZh ? '2. 可接受的使用' : '2. Acceptable Use'}
                            </h3>
                            <div className="space-y-4 text-muted-foreground">
                                <p>{isZh ? '您可以：' : 'You may:'}</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                        <span>{isZh ? '将处理后的图片用于个人项目' : 'Use processed images for personal projects'}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                        <span>{isZh ? '将处理后的图片用于商业项目' : 'Use processed images for commercial projects'}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                        <span>{isZh ? '分享处理后的图片' : 'Share processed images'}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                        <span>{isZh ? '无限次使用服务' : 'Use the service unlimited times'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Restrictions */}
                        <div className="bg-muted/30 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold mb-4">
                                {isZh ? '3. 使用限制' : '3. Restrictions'}
                            </h3>
                            <div className="space-y-4 text-muted-foreground">
                                <p>{isZh ? '您不得：' : 'You may not:'}</p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                                        <span>{isZh ? '尝试逆向工程或复制本网站' : 'Attempt to reverse engineer or copy this website'}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                                        <span>{isZh ? '使用自动化工具大规模访问服务' : 'Use automated tools to access the service at scale'}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                                        <span>{isZh ? '处理您无权使用的图片' : 'Process images you don\'t have rights to use'}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                                        <span>{isZh ? '用于任何非法目的' : 'Use for any illegal purposes'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Intellectual Property */}
                        <div className="bg-muted/30 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold mb-4">
                                {isZh ? '4. 知识产权' : '4. Intellectual Property'}
                            </h3>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    {isZh
                                        ? '您上传的原始图片的版权归您或原始版权所有者所有。处理后生成的图片同样归您所有。'
                                        : 'Copyright of your original uploaded images remains with you or the original copyright holder. Processed images generated also belong to you.'}
                                </p>
                                <p>
                                    {isZh
                                        ? 'MakeBW.com 的网站设计、代码和品牌是我们的知识产权，受版权保护。'
                                        : 'MakeBW.com website design, code, and branding are our intellectual property and are protected by copyright.'}
                                </p>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-muted/30 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold mb-4">
                                {isZh ? '5. 免责声明' : '5. Disclaimer'}
                            </h3>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    {isZh
                                        ? '本服务按"原样"提供，不作任何明示或暗示的保证。我们不保证：'
                                        : 'This service is provided "as is" without any express or implied warranties. We do not guarantee:'}
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>{isZh ? '服务将始终可用或不间断' : 'The service will always be available or uninterrupted'}</li>
                                    <li>{isZh ? '转换结果将满足您的特定需求' : 'Conversion results will meet your specific needs'}</li>
                                    <li>{isZh ? '服务没有任何错误或漏洞' : 'The service is free from errors or bugs'}</li>
                                </ul>
                            </div>
                        </div>

                        {/* Changes to Terms */}
                        <div className="bg-muted/30 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold mb-4">
                                {isZh ? '6. 条款变更' : '6. Changes to Terms'}
                            </h3>
                            <div className="text-muted-foreground">
                                <p>
                                    {isZh
                                        ? '我们保留随时修改这些条款的权利。重大变更将在本页面公布。继续使用本服务即表示您接受修改后的条款。'
                                        : 'We reserve the right to modify these terms at any time. Significant changes will be posted on this page. Continued use of the service means you accept the modified terms.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold mb-4">
                            {isZh ? '有疑问？' : 'Questions?'}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {isZh
                                ? '如果您对这些条款有任何疑问，请随时联系我们。'
                                : 'If you have any questions about these terms, feel free to contact us.'}
                        </p>
                        <Button asChild>
                            <Link href={localePrefix}>
                                {isZh ? '返回首页' : 'Back to Home'}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
