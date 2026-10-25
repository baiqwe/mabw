import Link from 'next/link';
import { CheckCircle2, FileText, ScanLine, Stamp } from 'lucide-react';
import HomeInteractive from '@/components/home/HomeInteractive';
import { BreadcrumbSchema, FAQSchema, HowToSchema } from '@/components/breadcrumb-schema';

export const runtime = 'edge';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const isZh = locale === 'zh';
    const title = isZh ? '图片阈值处理器：在线转纯黑白 | MakeBW' : 'Threshold Image Filter – Convert to Pure Black & White | MakeBW';
    const description = isZh
        ? '免费在线图片阈值处理器。将 JPG、PNG、WebP 或 HEIC 图片转为纯黑白，调整阈值并立即下载。所有处理都在浏览器本地完成。'
        : 'Convert an image to pure black and white with a free online threshold filter. Adjust the cutoff, preview instantly, and download privately in your browser.';

    return {
        title,
        description,
        alternates: {
            canonical: `/${locale}/threshold-image`,
            languages: {
                en: '/en/threshold-image',
                zh: '/zh/threshold-image',
                'x-default': '/en/threshold-image',
            },
        },
        openGraph: { title, description, type: 'website', url: `https://makebw.com/${locale}/threshold-image` },
    };
}

export default async function ThresholdImagePage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const isZh = locale === 'zh';
    const prefix = `/${locale}`;
    const howToSteps = isZh ? [
        { name: '上传图片', text: '拖放图片或点击上传。支持 JPG、PNG、WebP 和 HEIC。' },
        { name: '调整阈值', text: '拖动阈值滑块，决定哪些像素显示为纯黑或纯白。' },
        { name: '下载图片', text: '预览满意后，下载 PNG、JPG 或 WebP 图片。' },
    ] : [
        { name: 'Upload an image', text: 'Drop an image or click to browse. JPG, PNG, WebP, and HEIC are supported.' },
        { name: 'Adjust the threshold', text: 'Move the slider to decide which pixels become pure black or pure white.' },
        { name: 'Download', text: 'Preview your result and download it as PNG, JPG, or WebP.' },
    ];
    const faqs = isZh ? [
        { question: '阈值处理和普通黑白有什么区别？', answer: '普通灰度会保留黑白之间的灰阶；阈值处理只有纯黑和纯白两种像素，适合线稿、扫描件、Logo 和模板。' },
        { question: '阈值应该设为多少？', answer: '从 128 开始调整。提高阈值会留下更多黑色区域，降低阈值会让更多区域变白。以预览中线条清晰、背景干净为准。' },
        { question: '图片会上传到服务器吗？', answer: '不会。图片处理和下载都在当前浏览器中完成。' },
    ] : [
        { question: 'What is the difference between threshold and black and white?', answer: 'Grayscale keeps shades between black and white. Thresholding uses only pure black and pure white pixels, which is useful for scans, logos, stencils, and line art.' },
        { question: 'What threshold value should I use?', answer: 'Start at 128. A higher threshold keeps more dark areas; a lower threshold turns more of the image white. Use the live preview to find clean lines and a clear background.' },
        { question: 'Are my images uploaded?', answer: 'No. Processing and download happen in the current browser.' },
    ];

    return (
        <div className="min-h-screen bg-[#f7f6f2]">
            <BreadcrumbSchema items={[
                { name: isZh ? '首页' : 'Home', url: `https://makebw.com${prefix}` },
                { name: isZh ? '图片阈值处理器' : 'Threshold Image Filter', url: `https://makebw.com${prefix}/threshold-image` },
            ]} />
            <FAQSchema items={faqs} />
            <HowToSchema name={isZh ? '如何将图片转为纯黑白' : 'How to convert an image to pure black and white'} description={isZh ? '使用 MakeBW 的阈值滑块，在线生成纯黑白图片。' : 'Use MakeBW’s threshold slider to create a pure black and white image online.'} steps={howToSteps} />

            <HomeInteractive
                initialMode="threshold"
                modes={[
                    { value: 'threshold', en: 'Pure Black & White', zh: '纯黑白' },
                    { value: 'grayscale', en: 'Grayscale', zh: '灰度' },
                    { value: 'invert', en: 'Invert', zh: '反色' },
                ]}
                heading={{ en: 'Turn Any Image into', zh: '一键将图片转成' }}
                highlightedHeading={{ en: 'Pure Black & White', zh: '纯黑白' }}
                subtitle={{ en: 'Set the cutoff with a live threshold slider. Ideal for scans, logos, stencils, and clean line art.', zh: '通过阈值滑块实时控制纯黑白效果，适合扫描件、Logo、模板和清晰线稿。' }}
            />

            <section className="border-y border-[#ddd9ce] bg-[#efeee8] py-16">
                <div className="container mx-auto max-w-6xl px-4 md:px-6">
                    <div className="mb-10 max-w-2xl">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#706f69]">{isZh ? '纯黑白图像' : 'Binary image conversion'}</p>
                        <h2 className="text-3xl font-bold tracking-tight text-[#2d2d2d] md:text-4xl">{isZh ? '什么时候该用阈值处理？' : 'When should you use a threshold filter?'}</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            { icon: FileText, title: isZh ? '扫描件与文字' : 'Scans and documents', text: isZh ? '去掉灰色纸张背景，让文字和印章更清楚。' : 'Remove grey paper backgrounds so text and stamps read clearly.' },
                            { icon: Stamp, title: isZh ? 'Logo 与模板' : 'Logos and stencils', text: isZh ? '准备喷绘、刻字、丝网印刷或乙烯基切割素材。' : 'Prepare artwork for vinyl cutting, screen printing, or stencil work.' },
                            { icon: ScanLine, title: isZh ? '线稿与剪影' : 'Line art and silhouettes', text: isZh ? '将画面简化为干净的黑白形状，便于打印与描摹。' : 'Reduce a photo to clean black and white shapes for printing or tracing.' },
                        ].map(({ icon: Icon, title, text }) => (
                            <article key={title} className="rounded-xl border border-[#d9d7d0] bg-[#fcfbf8] p-6 shadow-[0_4px_12px_rgba(24,24,23,0.04)]">
                                <Icon className="mb-5 h-6 w-6 text-[#5d35d8]" />
                                <h3 className="mb-2 text-lg font-bold text-[#2d2d2d]">{title}</h3>
                                <p className="leading-7 text-[#666]">{text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#fcfbf8] py-16 md:py-20">
                <div className="container mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[0.9fr_1.1fr] md:px-6">
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#706f69]">{isZh ? '是什么' : 'What it is'}</p>
                        <h2 className="text-3xl font-bold tracking-tight text-[#2d2d2d]">{isZh ? '什么是图片阈值处理？' : 'What is image thresholding?'}</h2>
                    </div>
                    <div className="space-y-5 leading-8 text-[#666]">
                        <p>{isZh ? '阈值处理会查看每个像素的亮度，并用一个分界值把它变成纯黑或纯白。与保留多层灰阶的灰度转换不同，阈值处理不会留下任何灰色。' : 'Thresholding reads the brightness of each pixel and uses one cutoff to turn it pure black or pure white. Unlike grayscale conversion, which preserves many shades, thresholding leaves no grey values behind.'}</p>
                        <p>{isZh ? '这类二值图更容易用于清晰打印、描摹、刻字和机器切割。原图光线均匀、主体与背景对比明确时，通常能获得更干净的结果。' : 'That binary result is easier to print, trace, engrave, or send to a cutting workflow. It works best when the source has even lighting and clear subject-to-background contrast.'}</p>
                    </div>
                </div>
            </section>

            <section className="border-y border-[#ddd9ce] bg-[#efeee8] py-16 md:py-20">
                <div className="container mx-auto max-w-6xl px-4 md:px-6">
                    <div className="mb-9 max-w-2xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#706f69]">{isZh ? '为什么使用 MakeBW' : 'Why use MakeBW'}</p><h2 className="text-3xl font-bold tracking-tight text-[#2d2d2d]">{isZh ? '一个可控、可预览的本地处理步骤' : 'A controllable, local processing step'}</h2></div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            { title: isZh ? '实时预览' : 'Live preview', text: isZh ? '滑动阈值时立即查看黑白区域的变化，再决定是否下载。' : 'See black and white regions change as you move the cutoff before downloading.' },
                            { title: isZh ? '浏览器本地处理' : 'Processed in-browser', text: isZh ? '图片在当前浏览器解码、处理和下载；处理过程中不会发送到 MakeBW 服务器。' : 'Images are decoded, processed, and downloaded in the current browser session; they are not sent to MakeBW for processing.' },
                            { title: isZh ? '格式选择' : 'Export choices', text: isZh ? '使用 PNG 保持干净的硬边；也可按需要下载 JPG 或 WebP。' : 'Use PNG for clean hard edges, or choose JPG or WebP when a downstream workflow needs it.' },
                        ].map((item) => <article key={item.title} className="rounded-xl border border-[#d9d7d0] bg-[#fcfbf8] p-6 shadow-[0_4px_12px_rgba(24,24,23,0.04)]"><CheckCircle2 className="mb-4 h-5 w-5 text-[#5d35d8]" /><h3 className="font-bold text-[#2d2d2d]">{item.title}</h3><p className="mt-2 leading-7 text-[#666]">{item.text}</p></article>)}
                    </div>
                </div>
            </section>

            <section className="bg-[#f7f6f2] py-16">
                <div className="container mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[0.8fr_1.2fr] md:px-6">
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#706f69]">{isZh ? '使用方法' : 'How it works'}</p>
                        <h2 className="text-3xl font-bold tracking-tight text-[#2d2d2d]">{isZh ? '三步完成纯黑白转换' : 'Three steps to a binary image'}</h2>
                    </div>
                    <ol className="space-y-4">
                        {howToSteps.map((step, index) => (
                            <li key={step.name} className="flex gap-4 rounded-xl border border-[#d9d7d0] bg-[#fcfbf8] p-5">
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#b6e62e] text-sm font-bold text-[#181817]">{index + 1}</span>
                                <div><h3 className="font-bold text-[#2d2d2d]">{step.name}</h3><p className="mt-1 leading-7 text-[#666]">{step.text}</p></div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="border-t border-[#ddd9ce] bg-[#f7f6f2] py-16">
                <div className="container mx-auto max-w-4xl px-4 md:px-6">
                    <div className="rounded-xl border border-[#d9d7d0] bg-[#fcfbf8] p-7 md:p-8"><h2 className="text-2xl font-bold text-[#2d2d2d]">{isZh ? '处理方法与使用提示' : 'Method and practical limits'}</h2><div className="mt-4 space-y-4 leading-7 text-[#666]"><p>{isZh ? '此工具先按亮度计算每个像素，再与所选阈值比较：亮于阈值的像素显示为白色，暗于阈值的像素显示为黑色。预览和下载使用同一种处理规则。' : 'This tool first calculates pixel brightness, then compares it to the selected cutoff: pixels brighter than the threshold become white and darker pixels become black. Preview and download use the same processing rule.'}</p><p>{isZh ? '单一阈值无法完全校正严重阴影、失焦或过度压缩的照片。若扫描件一侧较暗，建议重新拍摄并使用更均匀的光线；如需要文字识别、透视校正或多页 PDF，请使用专门的扫描工具。' : 'A single cutoff cannot fully correct heavy shadows, blur, or severe compression. If one side of a scan is dark, retake it in more even light. For OCR, perspective correction, or multi-page PDFs, use a dedicated scanning tool.'}</p></div></div>
                </div>
            </section>

            <section className="border-t border-[#ddd9ce] bg-[#fcfbf8] py-16">
                <div className="container mx-auto max-w-4xl px-4 md:px-6">
                    <h2 className="mb-8 text-3xl font-bold tracking-tight text-[#2d2d2d]">{isZh ? '常见问题' : 'Frequently asked questions'}</h2>
                    <div className="space-y-3">{faqs.map((faq) => <article key={faq.question} className="rounded-xl border border-[#d9d7d0] p-6"><h3 className="font-bold text-[#2d2d2d]">{faq.question}</h3><p className="mt-2 leading-7 text-[#666]">{faq.answer}</p></article>)}</div>
                    <div className="mt-10 flex flex-wrap gap-3">
                        <Link href={`${prefix}/color-to-black-and-white`} className="rounded-full border border-[#d9d7d0] px-5 py-2.5 text-sm font-semibold text-[#2d2d2d] transition hover:border-[#181817]">{isZh ? '灰度转换器' : 'Grayscale converter'}</Link>
                        <Link href={`${prefix}/photo-to-coloring-page`} className="rounded-full border border-[#d9d7d0] px-5 py-2.5 text-sm font-semibold text-[#2d2d2d] transition hover:border-[#181817]">{isZh ? '填色画制作器' : 'Coloring page maker'}</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
