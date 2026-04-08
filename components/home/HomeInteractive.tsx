'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useImageProcessor, ProcessMode } from '@/hooks/useImageProcessor';
import ImageUploader from '@/components/feature/image-uploader';
import CompareSlider from '@/components/feature/compare-slider';
import { AiUpsellCard } from '@/components/feature/ai-upsell-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Download, RefreshCw, Upload, ImageIcon, Sparkles, Camera } from 'lucide-react';
import Image from 'next/image';

// 快速示例数据
const QUICK_EXAMPLES = [
    {
        id: 'cat',
        label: 'Cute Cat',
        labelZh: '可爱猫咪',
        thumb: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=75&fit=crop',
        original: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=450&fit=crop',
    },
    {
        id: 'flower',
        label: 'Flowers',
        labelZh: '花卉',
        thumb: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=100&h=75&fit=crop',
        original: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=450&fit=crop',
    },
    {
        id: 'landscape',
        label: 'Landscape',
        labelZh: '风景',
        thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=75&fit=crop',
        original: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=450&fit=crop',
    },
    {
        id: 'portrait',
        label: 'Portrait',
        labelZh: '人像',
        thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=75&fit=crop',
        original: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop',
    },
    {
        id: 'fox',
        label: 'Fox',
        labelZh: '狐狸',
        thumb: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=100&h=75&fit=crop',
        original: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=600&h=450&fit=crop',
    },
];

interface HomeInteractiveProps {
    onShowStaticContent: (show: boolean) => void;
    user?: any;
}

export default function HomeInteractive({ onShowStaticContent, user }: HomeInteractiveProps) {
    const pathname = usePathname();
    const pathParts = pathname?.split('/') || [];
    const locale = (pathParts[1] === 'en' || pathParts[1] === 'zh') ? pathParts[1] : 'en';
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 图片状态 - 默认选中第一个示例
    const [originalImage, setOriginalImage] = useState<string>(QUICK_EXAMPLES[0].original);
    const [processedImage, setProcessedImage] = useState<string>('');
    const [fileName, setFileName] = useState<string>(QUICK_EXAMPLES[0].id);
    const [selectedExample, setSelectedExample] = useState<typeof QUICK_EXAMPLES[0] | null>(QUICK_EXAMPLES[0]);
    const [isUserImage, setIsUserImage] = useState<boolean>(false); // 标记是否为用户上传的图片

    // 处理选项
    const [viewerMode, setViewerMode] = useState<'basic' | 'ai'>('basic');
    const [mode, setMode] = useState<ProcessMode>('grayscale');
    const [threshold, setThreshold] = useState<number>(128);
    const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');

    // Hover 状态
    const [isPreviewHovered, setIsPreviewHovered] = useState(false);

    const { processImage, downloadImage, convertHeic, isProcessing } = useImageProcessor();

    // 派生状态
    const hasImage = !!originalImage;
    const hasProcessed = !!processedImage && !isProcessing;

    // 图片处理逻辑
    useEffect(() => {
        if (!originalImage) return;

        const process = async () => {
            try {
                const result = await processImage(originalImage, {
                    mode,
                    threshold,
                    keepTransparency: downloadFormat === 'png',
                });
                setProcessedImage(result);
            } catch (error) {
                console.error('Processing error:', error);
            }
        };

        process();
    }, [originalImage, mode, threshold, downloadFormat, processImage]);

    // 处理图片上传
    const handleImageSelect = useCallback((imageSrc: string, file: File) => {
        setOriginalImage(imageSrc);
        setFileName(file.name.replace(/\.[^/.]+$/, ''));
        setSelectedExample(null);
        setIsUserImage(true);
        setViewerMode('basic');

        // 滚动到顶部
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    // 处理示例点击
    const handleExampleClick = useCallback((example: typeof QUICK_EXAMPLES[0]) => {
        setOriginalImage(example.original);
        setFileName(example.id);
        setSelectedExample(example);
        setIsUserImage(false);
        setViewerMode('basic');
    }, []);

    // 处理重置 - 返回默认示例
    const handleReset = useCallback(() => {
        setOriginalImage(QUICK_EXAMPLES[0].original);
        setProcessedImage('');
        setFileName(QUICK_EXAMPLES[0].id);
        setSelectedExample(QUICK_EXAMPLES[0]);
        setIsUserImage(false);
        setViewerMode('basic');
    }, []);

    // 触发文件选择
    const triggerFileUpload = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    // 处理文件输入
    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            let imageSrc: string;

            // 检查是否为 HEIC 格式
            if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
                imageSrc = await convertHeic(file);
            } else {
                imageSrc = URL.createObjectURL(file);
            }

            handleImageSelect(imageSrc, file);
        } catch (error) {
            console.error('Error processing file:', error);
        }

        // 清空 input 以便可以再次选择同一文件
        e.target.value = '';
    }, [convertHeic, handleImageSelect]);

    // 处理下载
    const handleDownload = () => {
        if (!processedImage) return;
        downloadImage(processedImage, `${fileName}_${mode}`, downloadFormat, 0.95);
    };

    // 获取预览图片
    const getAfterImage = () => {
        if (viewerMode === 'ai') {
            // AI 模式 - 显示静态 AI 增强图（暂时用处理后的图片代替）
            return processedImage || originalImage;
        }
        return processedImage || originalImage;
    };

    return (
        <section className="py-8 lg:py-12 bg-gradient-to-b from-[#FAFAF8] to-white min-h-[85vh]" ref={containerRef}>
            {/* 隐藏的文件输入 */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.heic"
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="container px-4 md:px-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8 lg:mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2D2D2D] leading-tight tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Create Perfect{' '}
                        <span className="text-[#7C9070] relative inline-block">
                            Coloring Pages
                            <svg className="absolute w-full h-2 -bottom-1 left-0 text-[#7C9070]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                    </h1>
                    <p className="text-lg text-[#666] max-w-2xl mx-auto">
                        {locale === 'zh'
                            ? '上传任意照片，一键转换为专业涂色画'
                            : 'Upload any photo, convert to professional coloring pages instantly'}
                    </p>
                </div>

                {/* 双栏布局 */}
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* LEFT: 控制面板 */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="bg-[#F5F5F0] rounded-2xl border border-[#E5E5E0] p-6 space-y-6 sticky top-4">

                            {/* 上传区域 */}
                            <ImageUploader
                                onImageSelect={handleImageSelect}
                                onHeicConvert={convertHeic}
                            />

                            {/* 快速示例 - 移到上传区和模式选择之间 */}
                            <div className="py-3 border-y border-[#E5E5E0]">
                                <Label className="text-xs font-medium text-[#888] uppercase tracking-wider mb-3 block">
                                    {locale === 'zh' ? '⚡ 或选择示例图片' : '⚡ OR TRY EXAMPLES'}
                                </Label>
                                <div className="flex gap-2 flex-wrap">
                                    {QUICK_EXAMPLES.map((example) => (
                                        <button
                                            key={example.id}
                                            onClick={() => handleExampleClick(example)}
                                            className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${selectedExample?.id === example.id && !isUserImage
                                                ? 'border-[#7C9070] ring-2 ring-[#7C9070]/30'
                                                : 'border-[#E5E5E0] hover:border-[#7C9070]/50'
                                                }`}
                                        >
                                            <img
                                                src={example.thumb}
                                                alt={example.label}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Output Quality 切换 */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#2D2D2D]">Output Quality</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={viewerMode === 'basic' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewerMode('basic')}
                                        className={viewerMode === 'basic'
                                            ? 'bg-[#7C9070] hover:bg-[#6B7F60] text-white'
                                            : 'border-[#D5D5D0] text-[#666]'}
                                    >
                                        {locale === 'zh' ? '基础版' : 'Basic'}
                                    </Button>
                                    <Button
                                        variant={viewerMode === 'ai' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setViewerMode('ai')}
                                        className={viewerMode === 'ai'
                                            ? 'bg-gradient-to-r from-[#7C9070] to-purple-600 text-white'
                                            : 'border-[#D5D5D0] text-[#666]'}
                                    >
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        {locale === 'zh' ? 'AI 增强' : 'AI Pro'}
                                    </Button>
                                </div>
                            </div>

                            {/* 转换模式 */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-[#2D2D2D]">
                                    {locale === 'zh' ? '转换模式：' : 'Convert Mode:'}
                                </Label>
                                <RadioGroup value={mode} onValueChange={(v) => setMode(v as ProcessMode)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="grayscale" id="grayscale" />
                                        <Label htmlFor="grayscale" className="cursor-pointer text-[#444]">
                                            {locale === 'zh' ? '灰度' : 'Grayscale'}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="coloring" id="coloring" />
                                        <Label htmlFor="coloring" className="cursor-pointer text-[#444]">
                                            {locale === 'zh' ? '线稿（填色画）' : 'Line Art (Coloring)'}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="invert" id="invert" />
                                        <Label htmlFor="invert" className="cursor-pointer text-[#444]">
                                            {locale === 'zh' ? '反色' : 'Invert'}
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* 线条粗细滑块 (仅线稿模式) */}
                            {mode === 'coloring' && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-medium text-[#2D2D2D]">
                                            {locale === 'zh' ? '线条粗细：' : 'Line Thickness:'}
                                        </Label>
                                        <span className="text-sm text-[#888]">{threshold}</span>
                                    </div>
                                    <Slider
                                        value={[threshold]}
                                        onValueChange={(v) => setThreshold(v[0])}
                                        min={0}
                                        max={255}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                            )}

                            {/* 下载格式 */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-[#2D2D2D]">
                                    {locale === 'zh' ? '下载格式：' : 'Download Format:'}
                                </Label>
                                <RadioGroup value={downloadFormat} onValueChange={(v) => setDownloadFormat(v as 'png' | 'jpg')}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="png" id="png" />
                                        <Label htmlFor="png" className="cursor-pointer text-[#444]">
                                            PNG {locale === 'zh' ? '（保留透明度）' : '(Transparency)'}
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="jpg" id="jpg" />
                                        <Label htmlFor="jpg" className="cursor-pointer text-[#444]">
                                            JPG {locale === 'zh' ? '（文件更小）' : '(Smaller File)'}
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={handleDownload}
                                    disabled={isProcessing || !processedImage}
                                    className="flex-1 bg-[#7C9070] hover:bg-[#6B7F60] text-white"
                                    size="lg"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {locale === 'zh' ? '下载图片' : 'Download'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: 预览区域 */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-lg overflow-hidden sticky top-4">
                            {/* 预览容器 - 带 hover 上传按钮 */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsPreviewHovered(true)}
                                onMouseLeave={() => setIsPreviewHovered(false)}
                            >
                                <CompareSlider
                                    beforeImage={originalImage}
                                    afterImage={getAfterImage()}
                                    isLoading={isProcessing}
                                    autoSlide={hasProcessed}
                                    autoSlideDelay={300}
                                    className="w-full"
                                />

                                {/* Hover 上传按钮 */}
                                <div
                                    className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 ${isPreviewHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                        }`}
                                >
                                    <Button
                                        onClick={triggerFileUpload}
                                        size="lg"
                                        className="bg-white hover:bg-gray-50 text-[#2D2D2D] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        <Camera className="w-5 h-5 mr-2" />
                                        {locale === 'zh' ? '上传自己的图片' : 'Upload Your Image'}
                                    </Button>
                                </div>
                            </div>

                            {/* 状态栏 */}
                            <div className="px-4 py-3 bg-[#F9F9F9] border-t border-[#E5E5E5] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isProcessing ? (
                                        <>
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                                            <span className="text-sm text-[#666]">
                                                {locale === 'zh' ? '处理中...' : 'Processing...'}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                                            <span className="text-sm text-[#666]">
                                                {isUserImage
                                                    ? (locale === 'zh' ? '您的图片' : 'Your Image')
                                                    : selectedExample
                                                        ? `${locale === 'zh' ? '示例：' : 'Example: '}${locale === 'zh' ? selectedExample.labelZh : selectedExample.label}`
                                                        : locale === 'zh' ? '处理完成' : 'Ready'}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <span className="text-xs text-[#999]">
                                    {viewerMode === 'ai' ? '✨ AI Enhanced' : '📷 Basic'}
                                </span>
                            </div>
                            {/* AI Upsell - 仅基础模式显示 */}
                            {viewerMode === 'basic' && (
                                <div className="p-4 bg-[#FAFAFA] border-t border-[#E5E5E5]">
                                    <AiUpsellCard />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
