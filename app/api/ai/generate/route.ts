import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { CREDITS_PER_GENERATION } from "@/config/credit-packs";

// Required for Cloudflare Pages deployment
export const runtime = 'edge';
export const maxDuration = 60; // 1 minute timeout

// OpenRouter Nano Banana Model
const NANO_BANANA_MODEL = "google/gemini-2.5-flash-image";

// Style-specific prompts for line art generation
interface StyleConfig {
    prompt: string;
}

const STYLES: Record<string, StyleConfig> = {
    'coloring-page': {
        prompt: "将这张图片转换成儿童涂色书风格的线稿。要求：纯黑白、粗线条、简洁干净、无阴影填充、纯白背景、适合打印涂色。"
    },
    'sketch': {
        prompt: "将这张图片转换成铅笔素描风格的线稿。要求：保留细节、艺术感的线条、有层次感。"
    },
    'line-art': {
        prompt: "将这张图片转换成专业的线稿插画。要求：干净的墨线、矢量风格、白色背景、清晰的轮廓。"
    }
};

const DEFAULT_STYLE: StyleConfig = {
    prompt: "将这张图片转换成纯黑白的线稿手绘画，粗线条，涂色书风格，无阴影，纯白背景。"
};

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    try {
        const { image, prompt, style } = await request.json();

        // 1. Authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "请先登录", code: "UNAUTHORIZED" }, { status: 401 });
        }

        // 2. Input Validation
        if (!image) {
            return NextResponse.json({ error: "请上传图片", code: "MISSING_IMAGE" }, { status: 400 });
        }

        if (!process.env.OPENROUTER_API_KEY) {
            console.error("OPENROUTER_API_KEY is not set");
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

        // 4. Call OpenRouter Nano Banana API
        try {
            // Get style configuration or default
            const config = STYLES[style] || DEFAULT_STYLE;
            let finalPrompt = config.prompt;

            // Append user prompt if provided
            if (prompt?.trim()) {
                finalPrompt += ` 额外要求: ${prompt.trim()}`;
            }

            console.log("=== Calling OpenRouter Nano Banana ===");
            console.log("Model:", NANO_BANANA_MODEL);
            console.log("Style:", style || "default");
            console.log("Prompt:", finalPrompt);

            // Prepare image data - ensure it's in the correct format
            let imageData = image;
            let mimeType = "image/png";

            // Handle base64 data URL format
            if (image.startsWith('data:')) {
                const matches = image.match(/^data:([^;]+);base64,(.+)$/);
                if (matches) {
                    mimeType = matches[1];
                    imageData = image; // Keep full data URL for OpenRouter
                }
            } else {
                // If it's raw base64, add the data URL prefix
                imageData = `data:image/png;base64,${image}`;
            }

            // Call OpenRouter API
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                    "X-Title": "Line Art Generator"
                },
                body: JSON.stringify({
                    model: NANO_BANANA_MODEL,
                    response_modalities: ["image", "text"],
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: finalPrompt
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: imageData
                                    }
                                }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("OpenRouter API Error:", response.status, errorText);
                throw new Error(`OpenRouter API failed: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log("OpenRouter Response structure:", JSON.stringify({
                hasChoices: !!result.choices,
                messageKeys: result.choices?.[0]?.message ? Object.keys(result.choices[0].message) : [],
                contentType: typeof result.choices?.[0]?.message?.content,
                hasImages: !!result.choices?.[0]?.message?.images
            }, null, 2));

            // Extract the generated image from the response
            let resultImageUrl: string | null = null;

            const message = result.choices?.[0]?.message;
            if (message) {
                // Check for images array (OpenRouter Nano Banana format)
                if (message.images && Array.isArray(message.images) && message.images.length > 0) {
                    const img = message.images[0];
                    if (img.type === "image_url" && img.image_url?.url) {
                        resultImageUrl = img.image_url.url;
                    }
                }

                // Fallback: check content if it's an array
                if (!resultImageUrl && Array.isArray(message.content)) {
                    for (const part of message.content) {
                        if (part.type === "image_url" && part.image_url?.url) {
                            resultImageUrl = part.image_url.url;
                            break;
                        }
                        if (part.type === "image" && part.data) {
                            resultImageUrl = `data:image/png;base64,${part.data}`;
                            break;
                        }
                    }
                }
            }

            if (!resultImageUrl) {
                console.error("Failed to extract image from response:", JSON.stringify(result, null, 2));
                throw new Error("Nano Banana returned no image");
            }

            console.log("Generated image URL/data length:", resultImageUrl.substring(0, 100) + "...");

            // 5. Log Generation
            await supabase.from("generations").insert({
                user_id: user.id,
                prompt: finalPrompt,
                model_id: "nano-banana",
                image_url: resultImageUrl.startsWith("data:") ? "base64_image" : resultImageUrl,
                input_image_url: "user_upload",
                status: "succeeded",
                credits_cost: CREDITS_PER_GENERATION,
                metadata: { style, model: NANO_BANANA_MODEL }
            });

            return NextResponse.json({ url: resultImageUrl, success: true });

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
