/**
 * Replicate API Test Script for Coloring Page Model Optimization
 * 
 * This script tests different Replicate models and parameters to find
 * the optimal configuration for photo-to-coloring-page conversion.
 * 
 * Usage: npx tsx scripts/test-replicate.ts
 */

import Replicate from "replicate";
import * as fs from "fs";
import * as path from "path";

// Test configurations to try
const TEST_CONFIGS = [
    // Test 1: ControlNet Canny baseline (low threshold)
    {
        name: "canny_low_threshold",
        model: "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
        input: {
            prompt: "coloring book page, outline only, black and white line art, unfilled shapes, pure white background",
            a_prompt: "best quality, clean lines, high contrast",
            n_prompt: "solid black, filled, shading, gradient, grey background",
            num_samples: "1",
            image_resolution: "512",
            low_threshold: 30,
            high_threshold: 80,
            ddim_steps: 20,
            scale: 9,
            eta: 0.0
        }
    },
    // Test 2: ControlNet Canny with higher scale
    {
        name: "canny_high_scale",
        model: "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
        input: {
            prompt: "simple coloring book page for kids, thick black outlines only, empty white shapes, no shading, no details",
            a_prompt: "best quality, clean bold lines, pure white background",
            n_prompt: "solid black, filled areas, shading, shadows, gradient, photo, realistic, grey",
            num_samples: "1",
            image_resolution: "512",
            low_threshold: 40,
            high_threshold: 100,
            ddim_steps: 20,
            scale: 15,
            eta: 0.0
        }
    },
    // Test 3: ControlNet Scribble (different approach)
    {
        name: "scribble_basic",
        model: "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
        input: {
            prompt: "coloring book page, black and white line art, clean outlines, white background",
            a_prompt: "best quality, clean lines",
            n_prompt: "solid black, shading, grey background",
            num_samples: "1",
            image_resolution: "512",
            ddim_steps: 20,
            scale: 9,
            eta: 0.0
        }
    },
    // Test 4: ControlNet Canny with very specific prompt
    {
        name: "canny_specific_prompt",
        model: "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
        input: {
            prompt: "a cute cat, coloring book illustration, outline drawing, empty shapes ready to color, kids coloring page, black ink lines on white paper",
            a_prompt: "best quality, professional coloring book, thick outlines, hollow shapes",
            n_prompt: "filled shapes, solid black areas, photo, realistic, shading, shadows, texture, gradient, grey, dark",
            num_samples: "1",
            image_resolution: "512",
            low_threshold: 50,
            high_threshold: 150,
            ddim_steps: 25,
            scale: 12,
            eta: 0.0
        }
    },
    // Test 5: Very high guidance scale
    {
        name: "canny_extreme_guidance",
        model: "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
        input: {
            prompt: "black and white coloring page, cartoon outline, simple lines, white background, no shading",
            a_prompt: "best quality, minimal, clean, simple",
            n_prompt: "realistic, photo, complex, shading, grey, black areas, texture",
            num_samples: "1",
            image_resolution: "512",
            low_threshold: 60,
            high_threshold: 180,
            ddim_steps: 30,
            scale: 20,
            eta: 0.0
        }
    }
];

async function runTest(config: typeof TEST_CONFIGS[0], imageBase64: string, testNum: number) {
    console.log(`\n=== Test ${testNum}: ${config.name} ===`);
    console.log(`Model: ${config.model.split(":")[0]}`);
    console.log(`Params: low=${config.input.low_threshold || "N/A"}, high=${config.input.high_threshold || "N/A"}, scale=${config.input.scale}`);

    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    try {
        const startTime = Date.now();
        const output = await replicate.run(config.model as `${string}/${string}:${string}`, {
            input: {
                ...config.input,
                image: imageBase64,
            }
        });
        const duration = Date.now() - startTime;

        // Extract URL from output
        let resultUrl: string | null = null;
        if (Array.isArray(output) && output.length > 0) {
            const firstItem = output.length > 1 ? output[1] : output[0];
            if (typeof firstItem === "string") {
                resultUrl = firstItem;
            } else if (firstItem && typeof firstItem === "object") {
                resultUrl = (firstItem as any).url?.() || (firstItem as any).url || (firstItem as any).href || String(firstItem);
            }
        }

        console.log(`✓ Success in ${duration}ms`);
        console.log(`Result URL: ${resultUrl}`);

        return {
            success: true,
            name: config.name,
            duration,
            resultUrl,
            config: config.input
        };
    } catch (error: any) {
        console.log(`✗ Failed: ${error.message}`);
        return {
            success: false,
            name: config.name,
            error: error.message,
            config: config.input
        };
    }
}

async function main() {
    console.log("=== Replicate Model Optimization Test ===\n");

    // Read test image
    const imagePath = path.join(__dirname, "../.gemini/antigravity/brain/8d1ff054-6adf-4ff9-b555-514a6858d0fd/uploaded_image_1768015076981.jpg");

    if (!fs.existsSync(imagePath)) {
        // Try alternate path
        const altPath = "/Users/fanqienigehamigua/.gemini/antigravity/brain/8d1ff054-6adf-4ff9-b555-514a6858d0fd/uploaded_image_1768015076981.jpg";
        if (!fs.existsSync(altPath)) {
            console.error("Test image not found!");
            process.exit(1);
        }
    }

    const imageBuffer = fs.readFileSync(imagePath.includes("..") ? imagePath : "/Users/fanqienigehamigua/.gemini/antigravity/brain/8d1ff054-6adf-4ff9-b555-514a6858d0fd/uploaded_image_1768015076981.jpg");
    const imageBase64 = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    console.log(`Image loaded: ${imageBuffer.length} bytes`);

    const results: any[] = [];

    // Run tests (limit to 5 for safety)
    for (let i = 0; i < Math.min(TEST_CONFIGS.length, 5); i++) {
        const result = await runTest(TEST_CONFIGS[i], imageBase64, i + 1);
        results.push(result);

        // Wait between tests to avoid rate limiting
        if (i < TEST_CONFIGS.length - 1) {
            console.log("Waiting 2 seconds...");
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    // Summary
    console.log("\n\n=== RESULTS SUMMARY ===");
    console.log("========================\n");

    const successful = results.filter(r => r.success);
    console.log(`Successful: ${successful.length}/${results.length}`);

    for (const result of results) {
        if (result.success) {
            console.log(`\n✓ ${result.name}:`);
            console.log(`  Duration: ${result.duration}ms`);
            console.log(`  URL: ${result.resultUrl}`);
        } else {
            console.log(`\n✗ ${result.name}: ${result.error}`);
        }
    }

    // Save results to file
    const outputPath = path.join(__dirname, "test-results.json");
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nResults saved to: ${outputPath}`);
}

main().catch(console.error);
