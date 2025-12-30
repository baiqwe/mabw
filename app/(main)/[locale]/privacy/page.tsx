import { getTranslations } from 'next-intl/server';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Lock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

// ✅ Cloudflare Edge Runtime
export const runtime = 'edge';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const isZh = locale === 'zh';

    return {
        title: isZh ? '隐私政策 - MakeBW.com' : 'Privacy Policy - MakeBW.com',
        description: isZh 
            ? 'MakeBW 的隐私政策。所有图片处理都在您的浏览器本地完成，从不上传到服务器。了解我们如何保护您的隐私。'
            : 'MakeBW Privacy Policy. All image processing happens locally in your browser, never uploaded to servers. Learn how we protect your privacy.',
        alternates: {
            canonical: `/${locale}/privacy`,
            languages: {
                'en': '/en/privacy',
                'zh': '/zh/privacy',
            },
        },
    };
}

export default async function PrivacyPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;
    const isZh = locale === 'zh';
    const localePrefix = `/${locale}`;

    const breadcrumbs = [
        { name: isZh ? '首页' : 'Home', url: `https://makebw.com/${locale}` },
        { name: isZh ? '隐私政策' : 'Privacy Policy', url: `https://makebw.com/${locale}/privacy` },
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
                            <h1 className="text-xl font-bold">{isZh ? '隐私政策' : 'Privacy Policy'}</h1>
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
                    {/* Hero - Key Privacy Feature */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center rounded-full px-4 py-2 text-sm bg-green-500/10 text-green-600 dark:text-green-400">
                            <Shield className="mr-2 h-5 w-5" />
                            {isZh ? '隐私优先设计' : 'Privacy-First Design'}
            </div>
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {isZh ? '您的图片从不离开您的设备' : 'Your Images Never Leave Your Device'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            {isZh 
                                ? 'MakeBW 与其他在线图片工具根本不同。我们的所有图片处理都在您的浏览器中本地完成，您的图片永远不会上传到我们的服务器。'
                                : 'MakeBW is fundamentally different from other online image tools. All our image processing happens locally in your browser—your images are never uploaded to our servers.'}
                        </p>
                    </div>

                    {/* Comparison */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-2 border-red-200 dark:border-red-900">
              <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <XCircle className="h-5 w-5" />
                                    {isZh ? '其他工具' : 'Other Tools'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 mt-0.5 text-red-500" />
                                    <span>{isZh ? '上传图片到远程服务器' : 'Upload images to remote servers'}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 mt-0.5 text-red-500" />
                                    <span>{isZh ? '图片可能被存储或分析' : 'Images may be stored or analyzed'}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 mt-0.5 text-red-500" />
                                    <span>{isZh ? '存在数据泄露风险' : 'Risk of data breaches'}</span>
                </div>
                                <div className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 mt-0.5 text-red-500" />
                                    <span>{isZh ? '隐私条款复杂难懂' : 'Complex privacy terms'}</span>
                </div>
              </CardContent>
            </Card>

                        <Card className="border-2 border-green-200 dark:border-green-900">
              <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-5 w-5" />
                                    MakeBW
                                </CardTitle>
              </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                                    <span>{isZh ? '100% 浏览器本地处理' : '100% local browser processing'}</span>
                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                                    <span>{isZh ? '图片从不上传到服务器' : 'Images never uploaded to servers'}</span>
                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                                    <span>{isZh ? '零数据泄露风险' : 'Zero data breach risk'}</span>
              </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                                    <span>{isZh ? '隐私政策简单明了' : 'Simple, clear privacy policy'}</span>
            </div>
                            </CardContent>
                        </Card>
                </div>
                
                    {/* How It Works Technically */}
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Lock className="h-6 w-6 text-primary" />
                            {isZh ? '技术原理' : 'How It Works Technically'}
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                                {isZh 
                                    ? 'MakeBW 使用 HTML5 Canvas API 在您的浏览器中直接处理图片。当您选择一张图片时：'
                                    : 'MakeBW uses the HTML5 Canvas API to process images directly in your browser. When you select an image:'}
                            </p>
                            <ol className="space-y-2 list-decimal list-inside">
                                <li>{isZh ? '图片加载到浏览器的内存中（不是我们的服务器）' : 'The image loads into your browser\'s memory (not our servers)'}</li>
                                <li>{isZh ? '我们的 JavaScript 代码在您的设备上运行转换算法' : 'Our JavaScript code runs the conversion algorithm on your device'}</li>
                                <li>{isZh ? '处理后的图片直接从您的浏览器下载' : 'The processed image downloads directly from your browser'}</li>
                                <li>{isZh ? '关闭页面后，所有数据自动清除' : 'All data is automatically cleared when you close the page'}</li>
                            </ol>
                            <p className="font-medium text-foreground">
                                {isZh 
                                    ? '整个过程中，您的图片从未离开您的设备。我们甚至无法看到您处理的图片。'
                                    : 'Throughout this entire process, your images never leave your device. We can\'t even see what images you\'re processing.'}
                            </p>
              </div>
            </div>

                    {/* What We Do Collect */}
            <div className="bg-muted/30 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Eye className="h-6 w-6 text-primary" />
                            {isZh ? '我们收集的信息' : 'What We Do Collect'}
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="h-5 w-5 text-amber-500 mt-1" />
                <div>
                                    <h4 className="font-semibold mb-1">{isZh ? '基本分析数据' : 'Basic Analytics'}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '我们使用匿名分析来了解网站使用情况（如访问量、常用功能）。这些数据不包含任何个人识别信息，也不包含您处理的任何图片数据。'
                                            : 'We use anonymous analytics to understand site usage (like visit counts, popular features). This data contains no personally identifiable information and no data about images you process.'}
                                    </p>
                </div>
              </div>
                            <div className="flex items-start gap-4">
                                <AlertCircle className="h-5 w-5 text-amber-500 mt-1" />
                                <div>
                                    <h4 className="font-semibold mb-1">{isZh ? '必要的 Cookie' : 'Essential Cookies'}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {isZh 
                                            ? '我们使用必要的 Cookie 来记住您的语言偏好和主题设置。这些 Cookie 仅存储在您的浏览器中。'
                                            : 'We use essential cookies to remember your language preference and theme settings. These cookies are stored only in your browser.'}
                                    </p>
                  </div>
                </div>
              </div>
            </div>

                    {/* No Account Required */}
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl p-8 border border-green-200 dark:border-green-900">
                        <h3 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-400">
                            {isZh ? '无需注册账号' : 'No Account Required'}
                        </h3>
                        <p className="text-muted-foreground">
                            {isZh 
                                ? 'MakeBW 的核心功能完全免费使用，无需创建账号。这意味着我们不会收集您的邮箱、姓名或任何其他个人信息。您可以匿名使用我们的服务。'
                                : 'MakeBW\'s core features are completely free to use without creating an account. This means we don\'t collect your email, name, or any other personal information. You can use our service anonymously.'}
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold mb-4">
                            {isZh ? '有疑问？' : 'Questions?'}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {isZh 
                                ? '如果您对我们的隐私政策有任何疑问，欢迎联系我们。'
                                : 'If you have any questions about our privacy policy, feel free to contact us.'}
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
