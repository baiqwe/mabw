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
                            applyLineArt(data, canvas.width, canvas.height, options.threshold || 100);
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
 * Apply line art / edge detection using Sobel operator
 * Detects edges (color boundaries) to create coloring page line art
 * @param data - Pixel data array
 * @param width - Image width
 * @param height - Image height
 * @param threshold - Edge detection sensitivity (50-150 recommended, lower = more lines)
 */
function applyLineArt(data: Uint8ClampedArray, width: number, height: number, threshold: number) {
    // 1. Convert to grayscale first
    const grayData = new Uint8ClampedArray(width * height);
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        grayData[i / 4] = gray;
    }

    // 2. Sobel convolution kernels
    // Gx: horizontal edge detection, Gy: vertical edge detection
    const kernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const kernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    const outputData = new Uint8ClampedArray(data.length);

    // 3. Apply Sobel operator (skip border pixels for simplicity)
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let pixelX = 0;
            let pixelY = 0;

            // Convolve 3x3 window
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx));
                    const val = grayData[idx];
                    const kernelIdx = (ky + 1) * 3 + (kx + 1);
                    pixelX += val * kernelX[kernelIdx];
                    pixelY += val * kernelY[kernelIdx];
                }
            }

            // 4. Calculate gradient magnitude
            const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);

            // 5. Threshold and invert: edges are black (0), background is white (255)
            const isEdge = magnitude > threshold;
            const finalColor = isEdge ? 0 : 255;

            const idx = (y * width + x) * 4;
            outputData[idx] = finalColor;     // R
            outputData[idx + 1] = finalColor; // G
            outputData[idx + 2] = finalColor; // B
            outputData[idx + 3] = 255;        // Alpha (opaque)
        }
    }

    // 6. Write processed data back to original array
    for (let i = 0; i < data.length; i++) {
        data[i] = outputData[i];
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
