import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import Replicate from "replicate";
import { CREDITS_PER_GENERATION } from "@/config/credit-packs";

// Required for Cloudflare Pages deployment
export const runtime = 'edge';
export const maxDuration = 60; // 1 minute timeout

// Models
const BLIP_MODEL = "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c8ee51a7a82c3bdf9ac";
const CONTROLNET_MODEL = "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613";

interface StyleConfig {
    finalPrompt: string;
    a_prompt: string;
    n_prompt: string;
    low_threshold: number;
    high_threshold: number;
}

const DEFAULT_STYLE: StyleConfig = {
    finalPrompt: "coloring book line art, thick bold black marker lines, vector style, pure white background, minimal details, no shading",
    a_prompt: "best quality, heavy thick borders, smooth curves, vector art, coloring page for kids",
    n_prompt: "broken lines, thin lines, sketch, scratching, noise, dust, dots, shading, shadows, grey, gradient, filled areas, texture, realistic, photo, color, text, watermark, ui, interface, words, typography",
    low_threshold: 80,
    high_threshold: 180
};

const STYLES: Record<string, StyleConfig> = {
    'coloring-page': {
        finalPrompt: "children's coloring book page, very thick bold black outlines, simple smooth vector lines, pure white background, isolated subject, ready to color",
        a_prompt: "best quality, 8k, thick bold lines, hollow shapes, kids coloring page, printable, high contrast",
        n_prompt: "grey, shading, shadows, filled, texture, realistic, photo, color, details, background noise, messy lines, scratchy, text, ui, words",
        low_threshold: 100, // High threshold to remove noise
        high_threshold: 200
    },
    'sketch': {
        finalPrompt: "pencil sketch drawing, artistic linework, detailed outlines, structural lines",
        a_prompt: "best quality, artistic lines, fine details, sketch style",
        n_prompt: "color, painting, filled areas, photo realistic",
        low_threshold: 40,
        high_threshold: 120
    },
    'line-art': {
        finalPrompt: "professional line art illustration, clean bold ink lines, vector style, white background",
        a_prompt: "best quality, fine ink lines, professional illustration, smooth",
        n_prompt: "color, shading, gradient, filled areas, grey, noise, messy",
        low_threshold: 60,
        high_threshold: 150
    }
};

/**
 * Extracts a valid URL from Replicate output, handling FileOutput objects and arrays.
 */
function extractReplicateUrl(output: any): string | null {
    const extract = (item: any): string | null => {
        if (!item) return null;
        if (typeof item === 'string') return item;

        // Handle Replicate SDK FileOutput object
        if (typeof item === 'object') {
            const str = String(item);
            if (str && str.startsWith('http')) return str;
            if (typeof item.url === 'string') return item.url;
            if (typeof item.href === 'string') return item.href;
        }
        return null;
    };

    if (!output) return null;

    if (Array.isArray(output) && output.length > 0) {
        // For ControlNet, output[0] is the detected edge map (what we want)
        // output[1] is the stylized generation
        return extract(output[0]);
    }

    return extract(output);
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    try {
        const { image, prompt, style, size } = await request.json();

        // 1. Authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "请先登录", code: "UNAUTHORIZED" }, { status: 401 });
        }

        // 2. Input Validation
        if (!image) {
            return NextResponse.json({ error: "请上传图片", code: "MISSING_IMAGE" }, { status: 400 });
        }

        if (!process.env.REPLICATE_API_TOKEN) {
            console.error("REPLICATE_API_TOKEN is not set");
            return NextResponse.json({ error: "服务配置错误", code: "CONFIG_ERROR" }, { status: 500 });
        }

        // 3. Deduct Credits
        const { data: deductSuccess, error: rpcError } = await supabase.rpc('decrease_credits', {
            p_user_id: user.id,
            p_amount: CREDITS_PER_GENERATION,
            p_description: `AI Generation (${style || 'default'})`
        });

        if (rpcError) {
            console.error("RPC Error:", rpcError);
            return NextResponse.json({ error: "系统繁忙，请重试", code: "SYSTEM_ERROR" }, { status: 500 });
        }

        if (!deductSuccess) {
            return NextResponse.json({
                error: "积分不足，请充值",
                code: "INSUFFICIENT_CREDITS",
                required: CREDITS_PER_GENERATION
            }, { status: 402 });
        }

        // 4. Call AI Services
        try {
            const replicate = new Replicate({
                auth: process.env.REPLICATE_API_TOKEN,
            });

            // Check image size (approximate)
            const imageSizeBytes = typeof image === 'string' ? Math.round(image.length * 0.75) : 0;
            if (imageSizeBytes > 10 * 1024 * 1024) {
                throw new Error("Image too large (max 10MB)");
            }

            // --- Step 1: Image Recognition (BLIP) ---
            console.log("=== STEP 1: Image Recognition ===");
            let imageDescription = "";
            try {
                const blipOutput = await replicate.run(BLIP_MODEL, {
                    input: { image, task: "image_captioning" }
                });
                imageDescription = String(blipOutput || "");
                console.log("Image description:", imageDescription);
            } catch (blipError) {
                console.warn("BLIP failed, utilizing generic prompt:", blipError);
            }

            // --- Step 2: Line Art Generation (ControlNet Canny) ---
            console.log("=== STEP 2: Line Art Generation ===");

            // Get style configuration or default
            const config = STYLES[style] || DEFAULT_STYLE;
            let { finalPrompt } = config;

            // Integrate BLIP description
            if (imageDescription?.trim()) {
                const desc = imageDescription.trim();
                // Replace specific keywords in the finalPrompt based on the style
                if (finalPrompt.includes("coloring book")) {
                    finalPrompt = finalPrompt.replace("coloring book", `coloring book of ${desc}`);
                } else if (finalPrompt.includes("pencil sketch")) {
                    finalPrompt = finalPrompt.replace("pencil sketch", `pencil sketch of ${desc}`);
                } else if (finalPrompt.includes("line art")) {
                    finalPrompt = finalPrompt.replace("line art", `line art of ${desc}`);
                } else {
                    // Fallback if no specific keyword found, prepend description
                    finalPrompt = `${desc}, ${finalPrompt}`;
                }
            }

            // Append user prompt
            if (prompt?.trim()) {
                finalPrompt += `, ${prompt.trim()}`;
            }

            console.log("Generating with params:", {
                model: CONTROLNET_MODEL,
                style,
                thresholds: { low: config.low_threshold, high: config.high_threshold },
                prompt: finalPrompt
            });

            const output = await replicate.run(CONTROLNET_MODEL, {
                input: {
                    image,
                    prompt: finalPrompt,
                    a_prompt: config.a_prompt,
                    n_prompt: config.n_prompt,
                    num_samples: "1",
                    image_resolution: "512",
                    low_threshold: config.low_threshold,
                    high_threshold: config.high_threshold,
                    ddim_steps: 20,
                    scale: 9,
                    eta: 0.0
                }
            });

            const resultUrl = extractReplicateUrl(output);
            console.log("Extracted URL:", resultUrl);

            if (!resultUrl || !resultUrl.startsWith('http')) {
                throw new Error("Replicate returned invalid result");
            }

            // 5. Log Generation
            await supabase.from("generations").insert({
                user_id: user.id,
                prompt: finalPrompt,
                model_id: "controlnet-canny",
                image_url: resultUrl,
                input_image_url: "user_upload",
                status: "succeeded",
                credits_cost: CREDITS_PER_GENERATION,
                metadata: { style }
            });

            return NextResponse.json({ url: resultUrl, success: true });

        } catch (aiError: any) {
            console.error("AI Service Error:", aiError);
            console.error("AI Error Details:", JSON.stringify({
                message: aiError?.message,
                status: aiError?.status,
                response: aiError?.response,
                name: aiError?.name
            }, null, 2));

            // Refund credits on failure
            await supabase.rpc('decrease_credits', {
                p_user_id: user.id,
                p_amount: -CREDITS_PER_GENERATION,
                p_description: 'Refund: AI Generation Failed'
            });

            return NextResponse.json({
                error: "生成失败，积分已退回",
                code: "AI_FAILED",
                refunded: true,
                details: aiError?.message || "Unknown error"
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Route Error:", error);
        return NextResponse.json(
            { error: error.message || "服务器错误", code: "UNKNOWN_ERROR" },
            { status: 500 }
        );
    }
}
