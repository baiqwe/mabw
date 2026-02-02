'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useImageProcessor, ProcessMode } from '@/hooks/useImageProcessor';
import { Sparkles, ArrowRight } from 'lucide-react';

// 画廊示例数据
const GALLERY_EXAMPLES = [
    {
        id: 'cat',
        label: 'Cute Cat',
        labelZh: '可爱猫咪',
        original: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=450&fit=crop',
    },
    {
        id: 'flower',
        label: 'Flowers',
        labelZh: '花卉',
        original: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=450&fit=crop',
    },
    {
        id: 'landscape',
        label: 'Landscape',
        labelZh: '风景',
        original: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=450&fit=crop',
    },
];

interface GalleryRowProps {
    example: typeof GALLERY_EXAMPLES[0];
    mode: ProcessMode;
    locale: string;
    index: number;
}

function GalleryRow({ example, mode, locale, index }: GalleryRowProps) {
    const { processImage } = useImageProcessor();
    const [basicResult, setBasicResult] = useState<string>('');
    const [isHovered, setIsHovered] = useState(false);
    const isZh = locale === 'zh';

    // 使用 canvas 处理生成基础版效果
    useEffect(() => {
        const process = async () => {
            try {
                const result = await processImage(example.original, {
                    mode,
                    threshold: mode === 'coloring' ? 100 : 128,
                    keepTransparency: false,
                });
                setBasicResult(result);
            } catch (error) {
                console.error('Gallery processing error:', error);
            }
        };
        process();
    }, [example.original, mode, processImage]);

    return (
        <div
            className="group relative bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm transition-all duration-500 ease-out hover:shadow-xl hover:border-[#7C9070]/30 hover:-translate-y-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                animationDelay: `${index * 150}ms`,
            }}
        >
            {/* 标题栏 */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#F9F9F9] to-white border-b border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#7C9070]/10 flex items-center justify-center text-sm font-medium text-[#7C9070]">
                        {index + 1}
                    </span>
                    <span className="text-lg font-semibold text-[#2D2D2D]">
                        {isZh ? example.labelZh : example.label}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#888] group-hover:text-[#7C9070] transition-colors duration-300">
                    <span>{isZh ? '查看对比效果' : 'View comparison'}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
            </div>

            {/* 三栏对比 - 横向展示 */}
            <div className="grid grid-cols-3 divide-x divide-[#E5E5E5]">
                {/* 原图 */}
                <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                        <img
                            src={example.original}
                            alt={`${example.label} - Original`}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            crossOrigin="anonymous"
                        />
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-white text-sm text-center py-2.5 font-medium transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                        {isZh ? '原图' : 'Original'}
                    </div>
                    {/* 静态标签 */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1.5 transition-all duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                        {isZh ? '原图' : 'Original'}
                    </div>
                </div>

                {/* 基础版 (Canvas) */}
                <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
                        {basicResult ? (
                            <img
                                src={basicResult}
                                alt={`${example.label} - Basic`}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                        ) : (
                            <div className="animate-pulse w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                        )}
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 bg-[#7C9070]/90 backdrop-blur-sm text-white text-sm text-center py-2.5 font-medium transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                        <div className="flex items-center justify-center gap-2">
                            <span>{isZh ? '基础版' : 'Basic'}</span>
                            <span className="text-xs opacity-80">{isZh ? '(Canvas 处理)' : '(Canvas)'}</span>
                        </div>
                    </div>
                    {/* 静态标签 */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-[#7C9070]/80 text-white text-xs text-center py-1.5 transition-all duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                        {isZh ? '基础版' : 'Basic'}
                    </div>
                </div>

                {/* AI 增强版 */}
                <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center overflow-hidden">
                        {basicResult ? (
                            <div className="relative w-full h-full overflow-hidden">
                                <img
                                    src={basicResult}
                                    alt={`${example.label} - AI Enhanced`}
                                    className="w-full h-full object-cover filter contrast-125 brightness-105 transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                {/* AI 光效叠加 */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-purple-900/50 via-purple-500/10 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />
                                {/* AI 闪光效果 */}
                                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`} />
                                {/* AI 标识 */}
                                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-purple-600/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full shadow-lg">
                                    <Sparkles className="w-3 h-3 animate-pulse" />
                                    <span>{isZh ? 'AI 增强' : 'AI Enhanced'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-pulse w-full h-full bg-gradient-to-br from-purple-100 to-purple-200" />
                        )}
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-500 backdrop-blur-sm text-white text-sm text-center py-2.5 font-medium transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span>{isZh ? 'AI 专业版' : 'AI Pro'}</span>
                        </div>
                    </div>
                    {/* 静态标签 */}
                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs text-center py-1.5 flex items-center justify-center gap-1 transition-all duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                        <Sparkles className="w-3 h-3" />
                        {isZh ? 'AI 专业版' : 'AI Pro'}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ComparisonGalleryProps {
    className?: string;
}

export default function ComparisonGallery({ className }: ComparisonGalleryProps) {
    const pathname = usePathname();
    const pathParts = pathname?.split('/') || [];
    const locale = (pathParts[1] === 'en' || pathParts[1] === 'zh') ? pathParts[1] : 'en';
    const isZh = locale === 'zh';

    return (
        <section className={`py-20 bg-gradient-to-b from-[#FAFAF8] to-white ${className || ''}`}>
            <div className="container px-4 md:px-6 max-w-5xl mx-auto">
                {/* 灰度转换画廊 */}
                <div className="mb-20">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-4">
                            {isZh ? '灰度转换效果展示' : 'Grayscale Conversion Gallery'}
                        </h2>
                        <p className="text-[#666] max-w-2xl mx-auto text-lg">
                            {isZh
                                ? '将彩色照片转换为经典黑白效果，对比原图、基础版和 AI 专业版的差异'
                                : 'Convert color photos to classic black and white, compare original, basic and AI Pro versions'}
                        </p>
                    </div>

                    {/* 独立行布局 - 每组一行 */}
                    <div className="space-y-6">
                        {GALLERY_EXAMPLES.map((example, index) => (
                            <GalleryRow
                                key={`grayscale-${example.id}`}
                                example={example}
                                mode="grayscale"
                                locale={locale}
                                index={index}
                            />
                        ))}
                    </div>
                </div>

                {/* 涂色卡画廊 */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-4">
                            {isZh ? '涂色卡效果展示' : 'Coloring Page Gallery'}
                        </h2>
                        <p className="text-[#666] max-w-2xl mx-auto text-lg">
                            {isZh
                                ? '从照片提取线稿，制作可打印的儿童填色画'
                                : 'Extract line art from photos to create printable coloring pages for kids'}
                        </p>
                    </div>

                    {/* 独立行布局 - 每组一行 */}
                    <div className="space-y-6">
                        {GALLERY_EXAMPLES.map((example, index) => (
                            <GalleryRow
                                key={`coloring-${example.id}`}
                                example={example}
                                mode="coloring"
                                locale={locale}
                                index={index}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <p className="text-[#888] text-base">
                        {isZh
                            ? '👆 上方编辑器支持上传自己的图片，免费体验基础版效果'
                            : '👆 Upload your own images in the editor above to try the basic version for free'}
                    </p>
                </div>
            </div>
        </section>
    );
}
