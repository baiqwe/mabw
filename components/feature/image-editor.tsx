"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useImageProcessor, ProcessMode } from '@/hooks/useImageProcessor';
import ImageUploader from './image-uploader';
import CompareSlider from './compare-slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Download, RefreshCw } from 'lucide-react';

interface ImageEditorProps {
    defaultMode?: ProcessMode;
    onImageUploaded?: (uploaded: boolean, imageSrc?: string) => void; // 通知父组件图片已上传，并传递图片数据
    compact?: boolean; // 紧凑模式（用于左右布局）
    initialImage?: string; // 初始图片（用于状态恢复）
}

export default function ImageEditor({
    defaultMode = 'grayscale',
    onImageUploaded,
    compact = false,
    initialImage
}: ImageEditorProps) {
    const t = useTranslations('editor');
    const { processImage, downloadImage, convertHeic, isProcessing } = useImageProcessor();

    const [originalImage, setOriginalImage] = useState<string>(initialImage || '');
    const [processedImage, setProcessedImage] = useState<string>('');
    const [fileName, setFileName] = useState<string>('image');
    const [mode, setMode] = useState<ProcessMode>(defaultMode);
    const [threshold, setThreshold] = useState<number>(128);
    const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg' | 'webp'>('png');
    const [hasProcessed, setHasProcessed] = useState(false); // 是否已处理完成

    // 如果从外部传入初始图片，恢复状态
    useEffect(() => {
        if (initialImage && initialImage !== originalImage) {
            setOriginalImage(initialImage);
        }
    }, [initialImage]);

    // Process image whenever mode or threshold changes
    useEffect(() => {
        if (!originalImage) return;

        const process = async () => {
            try {
                setHasProcessed(false);
                const result = await processImage(originalImage, {
                    mode,
                    threshold,
                    keepTransparency: downloadFormat !== 'jpg',
                });
                setProcessedImage(result);
                setHasProcessed(true);
            } catch (error) {
                console.error('Processing error:', error);
                setHasProcessed(true);
            }
        };

        process();
    }, [originalImage, mode, threshold, downloadFormat, processImage]);

    // 通知父组件图片上传状态
    useEffect(() => {
        if (onImageUploaded) {
            onImageUploaded(!!originalImage, originalImage || undefined);
        }
    }, [originalImage, onImageUploaded]);

    const handleImageSelect = (imageSrc: string, file: File) => {
        setOriginalImage(imageSrc);
        setFileName(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
        setHasProcessed(false);
        // 立即通知父组件，传递图片数据
        if (onImageUploaded) {
            onImageUploaded(true, imageSrc);
        }
    };

    const handleDownload = () => {
        if (!processedImage) return;
        downloadImage(processedImage, `${fileName}_${mode}`, downloadFormat, 0.95);
    };

    const handleReset = () => {
        setOriginalImage('');
        setProcessedImage('');
        setFileName('image');
        setHasProcessed(false);
        if (onImageUploaded) {
            onImageUploaded(false, undefined);
        }
    };

    // 上传前：只显示上传区域
    if (!originalImage) {
        return (
            <div className={compact ? "w-full" : "max-w-2xl mx-auto"}>
                <ImageUploader
                    onImageSelect={handleImageSelect}
                    onHeicConvert={convertHeic}
                />
            </div>
        );
    }

    // 上传后：左右布局（紧凑模式）或垂直布局（默认）
    if (compact) {
        return (
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 h-full">
                {/* 左侧：控制面板 */}
                <div className="space-y-6 p-6 bg-card border border-border rounded-lg h-fit lg:sticky lg:top-4">
                    {/* Mode Selection */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">{t('mode_label')}</Label>
                        <RadioGroup value={mode} onValueChange={(v) => setMode(v as ProcessMode)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="grayscale" id="grayscale" />
                                <Label htmlFor="grayscale" className="cursor-pointer">
                                    {t('mode_grayscale')}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="coloring" id="coloring" />
                                <Label htmlFor="coloring" className="cursor-pointer">
                                    {t('mode_coloring')}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="invert" id="invert" />
                                <Label htmlFor="invert" className="cursor-pointer">
                                    {t('mode_invert')}
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Threshold Control (only for line art) */}
                    {mode === 'coloring' && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-base font-semibold">{t('threshold_label')}</Label>
                                <span className="text-sm text-muted-foreground">{threshold}</span>
                            </div>
                            <Slider
                                value={[threshold]}
                                onValueChange={(v) => setThreshold(v[0])}
                                min={0}
                                max={255}
                                step={1}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{t('threshold_thin')}</span>
                                <span>{t('threshold_thick')}</span>
                            </div>
                        </div>
                    )}

                    {/* Download Format */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">{t('download_label')}</Label>
                        <RadioGroup value={downloadFormat} onValueChange={(v) => setDownloadFormat(v as 'png' | 'jpg' | 'webp')}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="png" id="png" />
                                <Label htmlFor="png" className="cursor-pointer">
                                    {t('download_png')}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="jpg" id="jpg" />
                                <Label htmlFor="jpg" className="cursor-pointer">
                                    {t('download_jpg')}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="webp" id="webp" />
                                <Label htmlFor="webp" className="cursor-pointer">WebP</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleDownload}
                            disabled={isProcessing || !processedImage}
                            className="flex-1"
                            size="lg"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {t('button_download')}
                        </Button>
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            size="lg"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {t('button_reset')}
                        </Button>
                    </div>
                </div>

                {/* 右侧：图片预览 */}
                <div className="flex items-center justify-center min-h-[400px]">
                    <CompareSlider
                        beforeImage={originalImage}
                        afterImage={processedImage || originalImage}
                        isLoading={isProcessing}
                        autoSlide={hasProcessed && !isProcessing && processedImage !== originalImage}
                        autoSlideDelay={300}
                        className="w-full"
                    />
                </div>
            </div>
        );
    }

    // 默认垂直布局（向后兼容）
    return (
        <div className="space-y-8">
            {/* Preview */}
            <CompareSlider
                beforeImage={originalImage}
                afterImage={processedImage || originalImage}
                isLoading={isProcessing}
                autoSlide={hasProcessed && !isProcessing && processedImage !== originalImage}
                autoSlideDelay={300}
                className="max-w-4xl mx-auto"
            />

            {/* Controls */}
            <div className="max-w-2xl mx-auto space-y-6 p-6 bg-card border border-border rounded-lg">
                {/* Mode Selection */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">{t('mode_label')}</Label>
                    <RadioGroup value={mode} onValueChange={(v) => setMode(v as ProcessMode)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="grayscale" id="grayscale" />
                            <Label htmlFor="grayscale" className="cursor-pointer">
                                {t('mode_grayscale')}
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="coloring" id="coloring" />
                            <Label htmlFor="coloring" className="cursor-pointer">
                                {t('mode_coloring')}
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="invert" id="invert" />
                            <Label htmlFor="invert" className="cursor-pointer">
                                {t('mode_invert')}
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Threshold Control (only for line art) */}
                {mode === 'coloring' && (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-base font-semibold">{t('threshold_label')}</Label>
                            <span className="text-sm text-muted-foreground">{threshold}</span>
                        </div>
                        <Slider
                            value={[threshold]}
                            onValueChange={(v) => setThreshold(v[0])}
                            min={0}
                            max={255}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{t('threshold_thin')}</span>
                            <span>{t('threshold_thick')}</span>
                        </div>
                    </div>
                )}

                {/* Download Format */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">{t('download_label')}</Label>
                    <RadioGroup value={downloadFormat} onValueChange={(v) => setDownloadFormat(v as 'png' | 'jpg' | 'webp')}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="png" id="png" />
                            <Label htmlFor="png" className="cursor-pointer">
                                {t('download_png')}
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="jpg" id="jpg" />
                            <Label htmlFor="jpg" className="cursor-pointer">
                                {t('download_jpg')}
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="webp" id="webp" />
                            <Label htmlFor="webp" className="cursor-pointer">WebP</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        onClick={handleDownload}
                        disabled={isProcessing || !processedImage}
                        className="flex-1"
                        size="lg"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {t('button_download')}
                    </Button>
                    <Button
                        onClick={handleReset}
                        variant="outline"
                        size="lg"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t('button_reset')}
                    </Button>
                </div>
            </div>

        </div>
    );
}
