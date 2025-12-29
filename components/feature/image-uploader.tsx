"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
    onImageSelect: (imageSrc: string, file: File) => void;
    onHeicConvert?: (file: File) => Promise<string>;
}

export default function ImageUploader({ onImageSelect, onHeicConvert }: ImageUploaderProps) {
    const t = useTranslations('uploader');
    const [error, setError] = useState<string>('');

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setError('');

        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (file.size > maxSize) {
            setError(t('error_size'));
            return;
        }

        try {
            // Handle HEIC files
            if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
                if (onHeicConvert) {
                    const convertedSrc = await onHeicConvert(file);
                    onImageSelect(convertedSrc, file);
                } else {
                    setError('HEIC conversion not supported');
                }
                return;
            }

            // Handle regular image files
            if (!file.type.startsWith('image/')) {
                setError(t('error_invalid'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                onImageSelect(result, file);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError('Failed to load image');
            console.error(err);
        }
    }, [onImageSelect, onHeicConvert, t]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.heic']
        },
        multiple: false,
        maxSize: 10 * 1024 * 1024
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`
          relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
                    }
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center gap-4">
                    <div className={`
            p-4 rounded-full transition-colors
            ${isDragActive ? 'bg-primary/20' : 'bg-muted'}
          `}>
                        <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>

                    <div className="space-y-2">
                        <p className="text-lg font-medium">
                            {isDragActive ? t('drop_zone').split(',')[0] : t('drop_zone')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {t('supported_formats')}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        {t('browse')}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}
        </div>
    );
}
