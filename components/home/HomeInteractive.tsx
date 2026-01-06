'use client';

import { AiUpsellCard } from '@/components/feature/ai-upsell-card';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import ImageEditor from '@/components/feature/image-editor';

interface HomeInteractiveProps {
    onShowStaticContent: (show: boolean) => void;
    user?: any;
}

export default function HomeInteractive({ onShowStaticContent, user }: HomeInteractiveProps) {
    const [imageUploaded, setImageUploaded] = useState(false);
    const [uploadedImageSrc, setUploadedImageSrc] = useState<string>('');

    const handleImageUploaded = (uploaded: boolean, imageSrc?: string) => {
        setImageUploaded(uploaded);
        onShowStaticContent(!uploaded);
        if (imageSrc) {
            setUploadedImageSrc(imageSrc);
        }
    };

    return (
        <HeroWithUploadSection
            onImageUploaded={handleImageUploaded}
            imageUploaded={imageUploaded}
            uploadedImageSrc={uploadedImageSrc}
        />
    );
}

function HeroWithUploadSection({
    onImageUploaded,
    imageUploaded,
    uploadedImageSrc
}: {
    onImageUploaded: (uploaded: boolean, imageSrc?: string) => void;
    imageUploaded: boolean;
    uploadedImageSrc: string;
}) {
    const t = useTranslations('hero');
    const pathname = usePathname();
    const pathParts = pathname?.split('/') || [];
    const locale = (pathParts[1] === 'en' || pathParts[1] === 'zh') ? pathParts[1] : 'en';

    // 如果已上传，显示处理界面（左右布局）
    if (imageUploaded) {
        return (
            <section className="py-8 lg:py-12 bg-background">
                <div className="container px-4 md:px-6 max-w-6xl mx-auto space-y-6">
                    {/* 主编辑区域 - Areas 1 & 2 */}
                    <ImageEditor
                        defaultMode="grayscale"
                        onImageUploaded={onImageUploaded}
                        compact={true}
                        initialImage={uploadedImageSrc}
                    />

                    {/* AI 推广区域 - Area 3 (紧凑) */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        <AiUpsellCard />
                    </div>
                </div>
            </section>
        );
    }

    // 未上传时，显示标题+上传的左右布局
    return (
        <section className="relative py-12 lg:py-20 bg-gradient-to-b from-muted/20 to-background">
            <div className="container px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
                    {/* 左侧：标题和描述 */}
                    <div className="space-y-6 lg:space-y-8">
                        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                            <span className="mr-2">🖼️</span>
                            {t('badge')}
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                            {t('title')}
                            <br />
                            <span className="text-primary">{t('title_highlight')}</span>
                        </h1>

                        <p className="text-lg text-muted-foreground md:text-xl max-w-xl">
                            {t('subtitle')}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {t('feature_1')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                {t('feature_2')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                {t('feature_3')}
                            </div>
                        </div>
                    </div>

                    {/* 右侧：上传区域 */}
                    <div className="flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
                        <div className="w-full max-w-lg">
                            <ImageEditor
                                defaultMode="grayscale"
                                onImageUploaded={onImageUploaded}
                                compact={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Export visibility control hook for parent component
export function useHomeInteractive() {
    const [showStaticContent, setShowStaticContent] = useState(true);
    return { showStaticContent, setShowStaticContent };
}
