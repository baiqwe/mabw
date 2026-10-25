'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Download, RefreshCw, Upload } from 'lucide-react';
import { useImageProcessor, ProcessMode } from '@/hooks/useImageProcessor';
import ImageUploader from '@/components/feature/image-uploader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface HomeInteractiveProps {
    user?: any;
    initialMode?: ProcessMode;
    modes?: Array<{ value: ProcessMode; en: string; zh: string }>;
    heading?: { en: string; zh: string };
    highlightedHeading?: { en: string; zh: string };
    subtitle?: { en: string; zh: string };
}

const MODES: Array<{ value: ProcessMode; en: string; zh: string }> = [
    { value: 'grayscale', en: 'Grayscale', zh: '灰度' },
    { value: 'threshold', en: 'Pure Black & White', zh: '纯黑白' },
    { value: 'invert', en: 'Invert', zh: '反色' },
];

const QUICK_EXAMPLES = [
    { id: 'golden-retriever', label: 'Golden retriever', image: '/images/examples/golden-retriever-window.png' },
    { id: 'wildflowers', label: 'Wildflowers', image: '/images/examples/wildflowers-still-life.png' },
    { id: 'mountain-lake', label: 'Mountain lake', image: '/images/examples/mountain-lake.png' },
    { id: 'sunlit-cafe', label: 'Sunlit cafe', image: '/images/examples/sunlit-cafe.png' },
];

export default function HomeInteractive({
    initialMode = 'grayscale',
    modes = MODES,
    heading,
    highlightedHeading,
    subtitle,
}: HomeInteractiveProps) {
    const pathname = usePathname();
    const locale = pathname?.split('/')[1] === 'zh' ? 'zh' : 'en';
    const isZh = locale === 'zh';
    const [originalImage, setOriginalImage] = useState(QUICK_EXAMPLES[0].image);
    const [processedImage, setProcessedImage] = useState('');
    const [fileName, setFileName] = useState('image');
    const [mode, setMode] = useState<ProcessMode>(initialMode);
    const [threshold, setThreshold] = useState(128);
    const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg' | 'webp'>('png');
    const { processImage, downloadImage, convertHeic, isProcessing } = useImageProcessor();
    const headingText = heading?.[locale] ?? (isZh ? '一键把照片变成' : 'Make Any Photo');
    const highlightedText = highlightedHeading?.[locale] ?? (isZh ? '黑白图片' : 'Black & White');
    const subtitleText = subtitle?.[locale] ?? (isZh ? '上传彩色照片，立即生成清晰的黑白效果。' : 'Upload a color photo and instantly convert it into a clean black and white image.');

    useEffect(() => {
        if (!originalImage) {
            setProcessedImage('');
            return;
        }

        let active = true;
        processImage(originalImage, { mode, threshold, keepTransparency: downloadFormat !== 'jpg' })
            .then((result) => {
                if (active) setProcessedImage(result);
            })
            .catch((error) => console.error('Processing error:', error));

        return () => { active = false; };
    }, [downloadFormat, mode, originalImage, processImage, threshold]);

    const handleImageSelect = useCallback((imageSrc: string, file: File) => {
        setOriginalImage(imageSrc);
        setFileName(file.name.replace(/\.[^/.]+$/, '') || 'image');
    }, []);

    const handleExampleSelect = useCallback((example: typeof QUICK_EXAMPLES[number]) => {
        setOriginalImage(example.image);
        setFileName(example.id);
    }, []);

    const handleReset = useCallback(() => {
        setOriginalImage('');
        setProcessedImage('');
        setFileName('image');
    }, []);

    const handleDownload = useCallback(() => {
        if (processedImage) downloadImage(processedImage, `${fileName}_black-and-white`, downloadFormat, 0.95);
    }, [downloadFormat, downloadImage, fileName, processedImage]);

    return (
        <section className="min-h-[85vh] bg-[#f7f6f2] py-8 lg:py-12">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="mb-8 text-center lg:mb-12">
                    <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-[#2d2d2d] md:text-4xl lg:text-5xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {headingText}{' '}
                        <span className="relative inline-block text-[#2d2d2d]">
                            {highlightedText}
                            <span className="absolute -bottom-1 left-0 h-1 w-full bg-[#b6e62e]" />
                        </span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-[#666]">
                        {subtitleText}
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#d9d7d0] bg-[#fcfbf8] shadow-[0_12px_32px_rgba(24,24,23,0.08)]">
                    {!originalImage ? (
                        <div className="grid min-h-[430px] items-stretch lg:grid-cols-[0.9fr_1.1fr]">
                            <div className="border-b border-[#d9d7d0] bg-[#efeee8] p-6 lg:border-b-0 lg:border-r lg:p-10">
                                <ImageUploader onImageSelect={handleImageSelect} onHeicConvert={convertHeic} />
                                <div className="mt-5 border-t border-[#d9d7d0] pt-4">
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#706f69]">{isZh ? '或试试示例图片' : 'Or try an example'}</p>
                                    <div className="flex gap-2">
                                        {QUICK_EXAMPLES.map((example) => (
                                            <button key={example.id} type="button" onClick={() => handleExampleSelect(example)} className="h-12 w-12 overflow-hidden rounded-md border border-[#b9b7ae] transition hover:border-[#181817] hover:shadow-sm" aria-label={example.label}>
                                                <img src={example.image} alt={example.label} className="h-full w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-h-[280px] items-center justify-center bg-[linear-gradient(135deg,#fcfbf8_25%,#f2f1eb_25%,#f2f1eb_50%,#fcfbf8_50%,#fcfbf8_75%,#f2f1eb_75%)] bg-[length:22px_22px] p-8">
                                <div className="flex h-full w-full max-w-md items-center justify-center rounded-xl border border-dashed border-[#b9b7ae] bg-[#fcfbf8]/80 p-8">
                                    <div className="text-center">
                                        <Upload className="mx-auto mb-4 h-8 w-8 text-[#2d2d2d]" />
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#706f69]">{isZh ? '本地处理' : 'Local processing'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-px bg-[#d9d7d0] lg:grid-cols-2">
                                <ImagePanel label={isZh ? '原图' : 'Original'} image={originalImage} />
                                <ImagePanel label={isZh ? '黑白效果' : 'Black & White'} image={processedImage || originalImage} loading={isProcessing} />
                            </div>
                            <div className="grid gap-6 border-t border-[#d9d7d0] p-5 lg:grid-cols-[minmax(0,1fr)_200px_auto] lg:items-end lg:p-6">
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#706f69]">{isZh ? '切换示例图片' : 'Try another example'}</Label>
                                        <div className="flex gap-2">
                                            {QUICK_EXAMPLES.map((example) => (
                                                <button key={example.id} type="button" onClick={() => handleExampleSelect(example)} className={`h-12 w-12 overflow-hidden rounded-md border transition hover:border-[#181817] hover:shadow-sm ${originalImage === example.image ? 'border-[#181817] ring-2 ring-[#b6e62e]' : 'border-[#b9b7ae]'}`} aria-label={example.label} aria-pressed={originalImage === example.image}>
                                                    <img src={example.image} alt={example.label} className="h-full w-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#706f69]">{isZh ? '转换模式' : 'Conversion mode'}</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {modes.map((option) => (
                                                <button key={option.value} type="button" onClick={() => setMode(option.value)} className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${mode === option.value ? 'border-[#181817] bg-[#181817] text-white' : 'border-[#d9d7d0] bg-transparent text-[#2d2d2d] hover:border-[#181817]'}`}>
                                                    {isZh ? option.zh : option.en}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {(mode === 'threshold' || mode === 'coloring') && (
                                        <div className="max-w-md space-y-2">
                                            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-[#706f69]">
                                                <span>{mode === 'coloring' ? (isZh ? '线条细节' : 'Line detail') : (isZh ? '阈值' : 'Threshold')}</span><span>{threshold}</span>
                                            </div>
                                            <Slider value={[threshold]} onValueChange={([value]) => setThreshold(value)} min={0} max={255} step={1} />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#706f69]">{isZh ? '下载格式' : 'Download format'}</Label>
                                    <div className="inline-flex w-fit rounded-md bg-[#efeee8] p-1">
                                        {(['png', 'jpg', 'webp'] as const).map((format) => <button key={format} type="button" onClick={() => setDownloadFormat(format)} className={`rounded px-3 py-1.5 text-xs font-bold uppercase ${downloadFormat === format ? 'bg-white text-[#181817] shadow-sm' : 'text-[#706f69]'}`}>{format}</button>)}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="lg" onClick={handleReset} className="border-[#d9d7d0] bg-white text-[#2d2d2d] hover:bg-[#efeee8]"><RefreshCw className="mr-2 h-4 w-4" />{isZh ? '重新上传' : 'Upload another'}</Button>
                                    <Button type="button" size="lg" onClick={handleDownload} disabled={isProcessing || !processedImage} className="border border-[#181817] bg-[#b6e62e] text-[#181817] hover:bg-[#a8d52a]"><Download className="mr-2 h-4 w-4" />{isZh ? '下载图片' : 'Download image'}</Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

function ImagePanel({ image, label, loading = false }: { image: string; label: string; loading?: boolean }) {
    return (
        <div className="relative min-h-[300px] bg-[#efeee8] p-4 sm:p-5">
            <div className="absolute left-7 top-7 z-10 rounded bg-[#fcfbf8]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2d2d2d] backdrop-blur">{label}</div>
            {loading && <div className="absolute inset-0 z-10 grid place-items-center bg-[#fcfbf8]/65 text-xs font-semibold uppercase tracking-[0.14em] text-[#2d2d2d] backdrop-blur-sm">Processing</div>}
            <img src={image} alt={label} className="h-full min-h-[300px] w-full rounded-lg object-contain" />
        </div>
    );
}
