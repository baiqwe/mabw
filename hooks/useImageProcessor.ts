import { useState, useCallback } from 'react';

export type ProcessMode = 'grayscale' | 'coloring' | 'invert';

export interface ProcessOptions {
    mode: ProcessMode;
    threshold?: number; // 0-255 for line art
    keepTransparency?: boolean; // For PNG output
}

export const useImageProcessor = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    /**
     * Process an image using Canvas API
     */
    const processImage = useCallback(async (
        imageSrc: string,
        options: ProcessOptions
    ): Promise<string> => {
        setIsProcessing(true);

        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        setIsProcessing(false);
                        reject(new Error('Could not get canvas context'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0);
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imgData.data;

                    // Apply selected algorithm
                    switch (options.mode) {
                        case 'grayscale':
                            applyGrayscale(data, options.keepTransparency);
                            break;

                        case 'coloring':
                            applyLineArt(data, options.threshold || 128);
                            break;

                        case 'invert':
                            applyInvert(data);
                            break;
                    }

                    ctx.putImageData(imgData, 0, 0);
                    setIsProcessing(false);
                    resolve(canvas.toDataURL('image/png'));
                } catch (error) {
                    setIsProcessing(false);
                    reject(error);
                }
            };

            img.onerror = () => {
                setIsProcessing(false);
                reject(new Error('Failed to load image'));
            };

            img.src = imageSrc;
        });
    }, []);

    /**
     * Download processed image
     */
    const downloadImage = useCallback((
        dataUrl: string,
        filename: string,
        format: 'png' | 'jpg' = 'png',
        quality: number = 0.95
    ) => {
        const link = document.createElement('a');
        link.download = `${filename}.${format}`;

        if (format === 'jpg') {
            // Convert to JPG (no transparency)
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // White background for JPG
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                link.href = canvas.toDataURL('image/jpeg', quality);
                link.click();
            };
            img.src = dataUrl;
        } else {
            link.href = dataUrl;
            link.click();
        }
    }, []);

    /**
     * Convert HEIC to compatible format
     */
    const convertHeic = useCallback(async (file: File): Promise<string> => {
        // Dynamic import to reduce bundle size
        const heic2any = (await import('heic2any')).default;

        const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/png',
        });

        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        return URL.createObjectURL(blob);
    }, []);

    return { processImage, downloadImage, convertHeic, isProcessing };
};

/**
 * Apply grayscale conversion
 * Uses luminosity method: 0.299R + 0.587G + 0.114B
 */
function applyGrayscale(data: Uint8ClampedArray, keepTransparency?: boolean) {
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = gray;     // R
        data[i + 1] = gray; // G
        data[i + 2] = gray; // B

        // If not keeping transparency, set alpha to 255
        if (!keepTransparency && data[i + 3] < 255) {
            data[i + 3] = 255;
        }
    }
}

/**
 * Apply line art / edge detection
 * Uses simplified threshold-based approach
 * For better results, could implement Sobel operator
 */
function applyLineArt(data: Uint8ClampedArray, threshold: number) {
    // First convert to grayscale
    const grayData = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        grayData[i] = gray;
        grayData[i + 1] = gray;
        grayData[i + 2] = gray;
        grayData[i + 3] = data[i + 3];
    }

    // Apply threshold and invert (lines black, background white)
    for (let i = 0; i < data.length; i += 4) {
        const val = grayData[i] > threshold ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255; // Line art is typically opaque
    }
}

/**
 * Apply color inversion (negative effect)
 */
function applyInvert(data: Uint8ClampedArray) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];         // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
        // Alpha channel remains unchanged
    }
}
