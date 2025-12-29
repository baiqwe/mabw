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
}

export default function ImageEditor({ defaultMode = 'grayscale' }: ImageEditorProps) {
    const t = useTranslations('editor');
    const { processImage, downloadImage, convertHeic, isProcessing } = useImageProcessor();

    const [originalImage, setOriginalImage] = useState<string>('');
    const [processedImage, setProcessedImage] = useState<string>('');
    const [fileName, setFileName] = useState<string>('image');
    const [mode, setMode] = useState<ProcessMode>(defaultMode);
    const [threshold, setThreshold] = useState<number>(128);
    const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');

    // Process image whenever mode or threshold changes
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

    const handleImageSelect = (imageSrc: string, file: File) => {
        setOriginalImage(imageSrc);
        setFileName(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
    };

    const handleDownload = () => {
        if (!processedImage) return;
        downloadImage(processedImage, `${fileName}_${mode}`, downloadFormat, 0.95);
    };

    const handleReset = () => {
        setOriginalImage('');
        setProcessedImage('');
        setFileName('image');
    };

    if (!originalImage) {
        return (
            <div className="max-w-2xl mx-auto">
                <ImageUploader
                    onImageSelect={handleImageSelect}
                    onHeicConvert={convertHeic}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Preview */}
            <CompareSlider
                beforeImage={originalImage}
                afterImage={processedImage || originalImage}
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
                    <RadioGroup value={downloadFormat} onValueChange={(v) => setDownloadFormat(v as 'png' | 'jpg')}>
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
