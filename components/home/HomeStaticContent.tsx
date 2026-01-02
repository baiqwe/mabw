import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Sparkles, Lock, Zap, Palette, Smartphone, Printer, Users, GraduationCap, Camera, Heart, ArrowRight } from 'lucide-react';

interface HomeStaticContentProps {
    locale: string;
}

export default async function HomeStaticContent({ locale }: HomeStaticContentProps) {
    const isZh = locale === 'zh';
    const t = await getTranslations({ locale, namespace: 'features' });

    return (
        <>
            {/* What Section */}
            <WhatSection isZh={isZh} />

            {/* How Section */}
            <HowSection isZh={isZh} locale={locale} />

            {/* Why Section */}
            <WhySection isZh={isZh} />

            {/* Features Section */}
            <FeaturesSection t={t} />

            {/* Use Cases Section */}
            <UseCasesSection isZh={isZh} locale={locale} />

            {/* Supported Formats Section */}
            <SupportedFormatsSection locale={locale} />

            {/* FAQ Section - Added for GSC 'How to' optimization */}
            <FAQSection isZh={isZh} />

            {/* CTA Section */}
            <CTASection isZh={isZh} locale={locale} />
        </>
    );
}

function WhatSection({ isZh }: { isZh: boolean }) {
    return (
        <section className="py-20 bg-muted/20">
            <div className="container px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {isZh ? '什么是 MakeBW？' : 'What is MakeBW?'}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {isZh
                                ? '正在寻找免费的图片转黑白工具？MakeBW 是最好的在线黑白制作器，可在浏览器中即时处理图像。无论您是想将照片变成填色画，还是想了解如何将图像转换为黑白以进行打印，我们的工具都能安全地处理。'
                                : 'Looking for a free color to black and white converter? MakeBW is the best online black and white maker that processes images instantly in your browser. Whether you want to turn a photo into a coloring page or learn how to convert image to black and white for printing, our tool handles it all securely.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-background rounded-lg p-6 border border-border">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <Palette className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {isZh ? '灰度转换' : 'Grayscale Conversion'}
                            </h3>
                            <p className="text-muted-foreground">
                                {isZh
                                    ? '将彩色照片转换为经典黑白效果，节省打印成本，创造艺术效果。'
                                    : 'Convert color photos to classic black and white, save printing costs, create artistic effects.'}
                            </p>
                        </div>

                        <div className="bg-background rounded-lg p-6 border border-border">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {isZh ? '填色画生成' : 'Coloring Page Maker'}
                            </h3>
                            <p className="text-muted-foreground">
                                {isZh
                                    ? '从任何照片提取线稿，制作可打印的儿童填色画。'
                                    : 'Extract line art from any photo to create printable coloring pages for kids.'}
                            </p>
                        </div>

                        <div className="bg-background rounded-lg p-6 border border-border">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {isZh ? '颜色反转' : 'Color Inversion'}
                            </h3>
                            <p className="text-muted-foreground">
                                {isZh
                                    ? '创建负片效果，用于特殊设计和艺术创作。'
                                    : 'Create negative effects for special designs and artistic creation.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function HowSection({ isZh, locale }: { isZh: boolean; locale: string }) {
    const steps = isZh ? [
        { number: 1, title: '上传图片', desc: '拖放或点击选择您的图片。支持 JPG、PNG、WebP、HEIC 格式。' },
        { number: 2, title: '选择模式', desc: '选择转换模式：灰度、填色画线稿，或颜色反转。' },
        { number: 3, title: '调整参数', desc: '根据需要调整线条粗细或其他参数，实时预览效果。' },
        { number: 4, title: '下载保存', desc: '选择 PNG 或 JPG 格式下载，即可使用或打印。' },
    ] : [
        { number: 1, title: 'Upload Image', desc: 'Drag and drop or click to select your image. Supports JPG, PNG, WebP, HEIC formats.' },
        { number: 2, title: 'Choose Mode', desc: 'Select conversion mode: grayscale, coloring page line art, or color inversion.' },
        { number: 3, title: 'Adjust Settings', desc: 'Adjust line thickness or other parameters as needed, preview in real-time.' },
        { number: 4, title: 'Download', desc: 'Choose PNG or JPG format and download for use or printing.' },
    ];

    return (
        <section className="py-20 bg-background">
            <div className="container px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {isZh ? '如何使用？' : 'How It Works?'}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {isZh
                                ? '只需 4 步，即可完成图片转换。无需注册，无需安装。'
                                : 'Just 4 steps to complete image conversion. No registration, no installation required.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step) => (
                            <div key={step.number} className="relative">
                                <div className="text-center space-y-4">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                                        {step.number}
                                    </div>
                                    <h3 className="text-lg font-bold">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                                </div>
                                {step.number < steps.length && (
                                    <div className="hidden md:flex absolute top-8 left-full w-8 -translate-y-1/2 items-center justify-center z-10">
                                        <ArrowRight className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function WhySection({ isZh }: { isZh: boolean }) {
    const reasons = isZh ? [
        { icon: Lock, title: '100% 隐私保护', desc: '所有图片处理都在您的浏览器本地完成，从不上传到服务器。您的隐私完全受保护。' },
        { icon: Zap, title: '即时转换', desc: '无需等待上传下载，转换在毫秒内完成。实时预览，立即看到效果。' },
        { icon: Heart, title: '完全免费', desc: '无需注册，无需付费，无任何限制。专业工具，永久免费使用。' },
        { icon: Smartphone, title: '随处可用', desc: '桌面、平板、手机都能用。支持所有现代浏览器，随时随地处理图片。' },
    ] : [
        { icon: Lock, title: '100% Privacy Protected', desc: 'All image processing happens locally in your browser, never uploaded to servers. Your privacy is completely protected.' },
        { icon: Zap, title: 'Instant Conversion', desc: 'No waiting for uploads or downloads, conversion happens in milliseconds. Real-time preview, see results immediately.' },
        { icon: Heart, title: 'Completely Free', desc: 'No registration, no payment, no limits. Professional tools, free forever.' },
        { icon: Smartphone, title: 'Works Everywhere', desc: 'Desktop, tablet, or mobile. Supports all modern browsers, process images anywhere.' },
    ];

    return (
        <section className="py-20 bg-muted/20">
            <div className="container px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {isZh ? '为什么选择 MakeBW？' : 'Why Choose MakeBW?'}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {isZh
                                ? '与其他在线工具不同，MakeBW 专注于您的隐私和体验。'
                                : 'Unlike other online tools, MakeBW focuses on your privacy and experience.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {reasons.map((reason, idx) => {
                            const Icon = reason.icon;
                            return (
                                <div key={idx} className="bg-background rounded-lg p-6 border border-border hover:shadow-md transition-shadow">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                                            <p className="text-muted-foreground">{reason.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturesSection({ t }: { t: any }) {
    const features = [
        { icon: Lock, title: t('feature_1_title'), desc: t('feature_1_desc') },
        { icon: Zap, title: t('feature_2_title'), desc: t('feature_2_desc') },
        { icon: Palette, title: t('feature_3_title'), desc: t('feature_3_desc') },
        { icon: Sparkles, title: t('feature_4_title'), desc: t('feature_4_desc') },
        { icon: Smartphone, title: t('feature_5_title'), desc: t('feature_5_desc') },
        { icon: Printer, title: t('feature_6_title'), desc: t('feature_6_desc') },
    ];

    return (
        <section className="py-20 bg-background">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-6xl space-y-12 text-center">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {t('title')}
                        </h2>
                        <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className="rounded-2xl bg-muted/30 p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
                                >
                                    <div className="space-y-4">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function UseCasesSection({ isZh, locale }: { isZh: boolean; locale: string }) {
    const localePrefix = `/${locale}`;

    const useCases = isZh ? [
        {
            icon: Users,
            title: '家长',
            desc: '为孩子制作自定义填色画',
            example: '将家庭照片转换为填色画，让孩子创作独特的艺术作品。',
            link: { text: '制作填色画 →', href: `${localePrefix}/photo-to-coloring-page` },
        },
        {
            icon: GraduationCap,
            title: '老师',
            desc: '创建教学材料',
            example: '为课堂活动生成教育性填色材料，让学习更有趣。',
            link: { text: '开始制作 →', href: `${localePrefix}/photo-to-coloring-page` },
        },
        {
            icon: Printer,
            title: '办公室',
            desc: '节省打印成本',
            example: '将彩色文档转为黑白，节省 40-60% 的墨水成本。',
            link: { text: '转换文档 →', href: `${localePrefix}/color-to-black-and-white` },
        },
        {
            icon: Camera,
            title: '摄影师',
            desc: '艺术创作',
            example: '将彩色照片转换为经典黑白效果，突出光影和构图。',
            link: { text: '转换照片 →', href: `${localePrefix}/color-to-black-and-white` },
        },
    ] : [
        {
            icon: Users,
            title: 'Parents',
            desc: 'Create custom coloring pages for kids',
            example: 'Convert family photos into coloring pages for kids to create unique artwork.',
            link: { text: 'Make Coloring Page →', href: `${localePrefix}/photo-to-coloring-page` },
        },
        {
            icon: GraduationCap,
            title: 'Teachers',
            desc: 'Create teaching materials',
            example: 'Generate educational coloring materials for classroom activities.',
            link: { text: 'Get Started →', href: `${localePrefix}/photo-to-coloring-page` },
        },
        {
            icon: Printer,
            title: 'Offices',
            desc: 'Save printing costs',
            example: 'Convert color documents to black and white, save 40-60% on ink costs.',
            link: { text: 'Convert Document →', href: `${localePrefix}/color-to-black-and-white` },
        },
        {
            icon: Camera,
            title: 'Photographers',
            desc: 'Artistic creation',
            example: 'Convert color photos to classic black and white, emphasizing light and composition.',
            link: { text: 'Convert Photo →', href: `${localePrefix}/color-to-black-and-white` },
        },
    ];

    return (
        <section className="py-20 bg-muted/20">
            <div className="container px-4 md:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {isZh ? '谁在使用 MakeBW？' : 'Who Uses MakeBW?'}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {isZh
                                ? '来自各行各业的用户都在使用 MakeBW 解决他们的图片处理需求。'
                                : 'Users from all walks of life use MakeBW to solve their image processing needs.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {useCases.map((useCase, idx) => {
                            const Icon = useCase.icon;
                            return (
                                <div key={idx} className="bg-background rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
                                    <div className="flex gap-4 mb-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{useCase.title}</h3>
                                            <p className="text-sm text-muted-foreground">{useCase.desc}</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-4">{useCase.example}</p>
                                    <Link
                                        href={useCase.link.href}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                                    >
                                        {useCase.link.text}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function SupportedFormatsSection({ locale }: { locale: string }) {
    const localePrefix = `/${locale}`;
    const isZh = locale === 'zh';

    const formats = [
        { name: 'JPG', href: `${localePrefix}/jpg-to-black-and-white`, desc: isZh ? '最常用的照片格式' : 'Most common photo format' },
        { name: 'PNG', href: `${localePrefix}/png-to-black-and-white`, desc: isZh ? '支持透明背景' : 'Supports transparency' },
        { name: 'WebP', href: `${localePrefix}/webp-to-black-and-white`, desc: isZh ? '现代高效格式' : 'Modern efficient format' },
        { name: 'HEIC', href: `${localePrefix}/heic-to-black-and-white`, desc: isZh ? 'iPhone 默认格式' : 'iPhone default format' },
    ];

    return (
        <section className="py-20 bg-background">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-6xl space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {isZh ? '支持的图片格式' : 'Supported Image Formats'}
                        </h2>
                        <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
                            {isZh
                                ? '支持所有主流图片格式，一键转换为黑白。点击下方格式查看详细说明。'
                                : 'Support for all major image formats. Convert to black and white with one click. Click any format below for details.'}
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {formats.map((format) => (
                            <Link
                                key={format.name}
                                href={format.href}
                                className="group rounded-2xl bg-muted/30 p-6 hover:bg-muted/50 transition-all hover:shadow-lg border border-border hover:border-primary/50"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                            {format.name}
                                        </h3>
                                        <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {format.desc}
                                    </p>
                                    <div className="pt-2">
                                        <span className="text-sm font-medium text-primary group-hover:underline">
                                            {isZh ? '转换为黑白 →' : 'Convert to B&W →'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Related Tools */}
                    <div className="pt-8 border-t">
                        <div className="text-center space-y-6">
                            <h3 className="text-2xl font-bold">
                                {isZh ? '更多工具' : 'More Tools'}
                            </h3>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href={`${localePrefix}/photo-to-coloring-page`}
                                    className="px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                                >
                                    {isZh ? '填色画生成器' : 'Coloring Page Maker'}
                                </Link>
                                <Link
                                    href={`${localePrefix}/color-to-black-and-white`}
                                    className="px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                                >
                                    {isZh ? '灰度转换器' : 'Grayscale Converter'}
                                </Link>
                                <Link
                                    href={`${localePrefix}/invert-colors`}
                                    className="px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                                >
                                    {isZh ? '反色工具' : 'Invert Colors'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FAQSection({ isZh }: { isZh: boolean }) {
    const faqs = isZh ? [
        {
            q: "如何将图片转换为黑白？",
            a: "1. 上传您的照片到 MakeBW。\n2. 选择'灰度'模式或调整阈值滑块。\n3. 点击下载。就是这么简单！所有处理都在浏览器中完成，无需上传服务器。"
        },
        {
            q: "MakeBW 是免费的吗？",
            a: "是的，MakeBW 是完全免费的黑白制作工具。没有隐藏费用，没有水印，也不需要注册。"
        },
        {
            q: "可以将照片变成填色画吗？",
            a: "当然可以！只需选择'填色画'模式，我们的智能算法会自动提取线条，生成清晰的黑白线稿，非常适合打印给孩子填色。"
        }
    ] : [
        {
            q: "How to convert image to black and white?",
            a: "1. Upload your photo to MakeBW.\n2. Choose 'Grayscale' mode or adjust the threshold slider.\n3. Click Download. It's that simple! All processing happens in your browser, ensuring 100% privacy."
        },
        {
            q: "Is MakeBW free?",
            a: "Yes, MakeBW is a free online color to black and white converter. No hidden fees, no watermarks, and no registration required."
        },
        {
            q: "Can I turn a photo into a coloring page?",
            a: "Absolutely! Just select 'Coloring Page' mode. Our smart algorithm automatically extracts line art to create clear black and white coloring pages perfect for printing."
        }
    ];

    return (
        <section className="py-20 bg-background border-t">
            <div className="container px-4 md:px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {isZh ? '常见问题' : 'Frequently Asked Questions'}
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            {isZh ? '了解更多关于图片黑白转换的信息' : 'Learn more about converting images to black and white'}
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-muted/30 rounded-lg p-6 space-y-3">
                                <h3 className="text-xl font-bold">{faq.q}</h3>
                                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {faq.a}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CTASection({ isZh, locale }: { isZh: boolean; locale: string }) {
    const localePrefix = `/${locale}`;

    return (
        <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-4xl text-center space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            {isZh ? '立即开始使用' : 'Start Converting Today'}
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
                            {isZh
                                ? '免费、快速、完全私密。无需注册，立即开始。'
                                : 'Free, fast, and completely private. No sign-up required.'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <Link
                                href={`${localePrefix}/color-to-black-and-white`}
                                className="px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-lg"
                            >
                                {isZh ? '开始转换' : 'Start Converting'}
                            </Link>
                            <Link
                                href={`${localePrefix}/photo-to-coloring-page`}
                                className="px-8 py-4 rounded-full bg-muted hover:bg-muted/80 transition-colors font-medium text-lg"
                            >
                                {isZh ? '制作填色画' : 'Make Coloring Page'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
