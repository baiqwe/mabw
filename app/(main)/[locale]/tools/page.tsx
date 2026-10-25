import Link from 'next/link';
import { ArrowUpRight, Clock3 } from 'lucide-react';

export const runtime = 'edge';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const isZh = locale === 'zh';
    return {
        title: isZh ? '免费在线图片工具 | MakeBW' : 'Free Online Image Tools | MakeBW',
        description: isZh ? '浏览 MakeBW 的免费、本地处理图片工具。' : 'Browse MakeBW’s free, private browser-based image tools.',
        alternates: { canonical: `/${locale}/tools`, languages: { en: '/en/tools', zh: '/zh/tools', 'x-default': '/en/tools' } },
    };
}

export default async function ToolsPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const isZh = locale === 'zh';
    const prefix = `/${locale}`;
    const available = isZh ? [
        ['黑白转换器', '将彩色照片转换为经典灰度黑白图。', '/color-to-black-and-white'],
        ['图片阈值处理器', '将图片转为纯黑白，适合扫描件、Logo 和模板。', '/threshold-image'],
        ['填色画制作器', '从照片提取可打印的线稿。', '/photo-to-coloring-page'],
        ['反色工具', '在线制作负片和颜色反转效果。', '/invert-colors'],
    ] : [
        ['Black & White Converter', 'Turn colour photos into classic grayscale images.', '/color-to-black-and-white'],
        ['Threshold Image', 'Create pure black and white images for scans, logos, and stencils.', '/threshold-image'],
        ['Coloring Page Maker', 'Extract printable line art from a photo.', '/photo-to-coloring-page'],
        ['Invert Colors', 'Create negative-style color inversion effects online.', '/invert-colors'],
    ];
    const planned = isZh ? ['高对比黑白滤镜', 'Noir 黑白滤镜', '照片转模板', '批量黑白转换', '文档扫描器'] : ['High Contrast B&W', 'Noir Filter', 'Photo to Stencil', 'Batch B&W Converter', 'Document Scanner'];

    return <div className="min-h-screen bg-[#f7f6f2] py-16 md:py-24">
        <main className="container mx-auto max-w-6xl px-4 md:px-6">
            <header className="mb-12 max-w-3xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#706f69]">MakeBW tools</p><h1 className="text-4xl font-bold tracking-tight text-[#2d2d2d] md:text-5xl">{isZh ? '免费、私密的图片工具' : 'Free, private image tools'}</h1><p className="mt-5 text-lg leading-8 text-[#666]">{isZh ? '所有工具均在浏览器本地完成处理：上传、预览、下载，无需账户。' : 'Every tool processes images locally in your browser: upload, preview, and download without an account.'}</p></header>
            <section><h2 className="mb-5 text-xl font-bold text-[#2d2d2d]">{isZh ? '可用工具' : 'Available now'}</h2><div className="grid gap-4 md:grid-cols-2">{available.map(([title, description, href]) => <Link key={href} href={`${prefix}${href}`} className="group rounded-xl border border-[#d9d7d0] bg-[#fcfbf8] p-6 shadow-[0_4px_12px_rgba(24,24,23,0.04)] transition hover:-translate-y-0.5 hover:border-[#b6e62e] hover:shadow-md"><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-bold text-[#2d2d2d]">{title}</h3><p className="mt-2 leading-7 text-[#666]">{description}</p></div><ArrowUpRight className="h-5 w-5 shrink-0 text-[#5d35d8]" /></div></Link>)}</div></section>
            <section className="mt-14 border-t border-[#d9d7d0] pt-10"><div className="mb-5 flex items-center gap-2"><Clock3 className="h-5 w-5 text-[#706f69]" /><h2 className="text-xl font-bold text-[#2d2d2d]">{isZh ? '正在规划' : 'Planned next'}</h2></div><div className="flex flex-wrap gap-3">{planned.map((tool) => <span key={tool} className="rounded-full border border-[#d9d7d0] bg-[#efeee8] px-4 py-2 text-sm font-semibold text-[#706f69]">{tool}</span>)}</div></section>
        </main>
    </div>;
}
