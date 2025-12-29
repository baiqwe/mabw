"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ReactCompareImage from 'react-compare-image';

interface CompareSliderProps {
    beforeImage: string;
    afterImage: string;
    className?: string;
}

export default function CompareSlider({ beforeImage, afterImage, className = '' }: CompareSliderProps) {
    const t = useTranslations('editor');

    return (
        <div className={`relative ${className}`}>
            <div className="rounded-lg overflow-hidden border border-border shadow-lg">
                <ReactCompareImage
                    leftImage={beforeImage}
                    rightImage={afterImage}
                    leftImageLabel={t('preview_before')}
                    rightImageLabel={t('preview_after')}
                    sliderLineColor="#ffffff"
                    sliderLineWidth={2}
                    handleSize={40}
                    hover
                />
            </div>

            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium border border-border">
                {t('preview_before')}
            </div>
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium border border-border">
                {t('preview_after')}
            </div>
        </div>
    );
}
