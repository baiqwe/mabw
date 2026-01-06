import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import Replicate from "replicate";
import { CREDITS_PER_GENERATION } from "@/config/credit-packs";

// Required for Cloudflare Pages deployment
export const runtime = 'edge';

export const maxDuration = 60; // 1 minute timeout

export async function POST(request: NextRequest) {
    try {
        const { image, prompt, style } = await request.json();
        const supabase = await createClient();

        // 1. 鉴权
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "请先登录", code: "UNAUTHORIZED" }, { status: 401 });
        }

        // 2. 输入验证
        if (!image) {
            return NextResponse.json({ error: "请上传图片", code: "MISSING_IMAGE" }, { status: 400 });
        }

        if (!process.env.REPLICATE_API_TOKEN) {
            console.error("REPLICATE_API_TOKEN is not set");
            return NextResponse.json({ error: "服务配置错误", code: "CONFIG_ERROR" }, { status: 500 });
        }

        // 3. 【核心】调用数据库原子函数扣费
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

        // 4. 积分扣除成功，调用 AI 服务
        try {
            const replicate = new Replicate({
                auth: process.env.REPLICATE_API_TOKEN,
            });

            // ControlNet Scribble 配置
            const model = "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117";

            // 根据风格调整 Prompt
            let finalPrompt = prompt || "clean line art";
            let n_prompt = "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, color, shading, gradient, grey";

            if (style === 'coloring-page') {
                finalPrompt += ", black and white coloring page, clean lines, white background, high quality, no shading";
            } else if (style === 'sketch') {
                finalPrompt += ", artistic pencil sketch, texture, rough lines";
            } else if (style === 'line-art') {
                finalPrompt += ", professional line art, ink style, precise lines";
            }

            const output = await replicate.run(model, {
                input: {
                    image: image,
                    prompt: finalPrompt,
                    a_prompt: "best quality, extremely detailed",
                    n_prompt: n_prompt,
                    num_samples: "1",
                    image_resolution: "512",
                    ddim_steps: 20,
                    scale: 9,
                    eta: 0.0
                }
            });

            const resultUrl = Array.isArray(output) ? output[1] || output[0] : output;

            // 5. 记录生成日志
            await supabase.from("generations").insert({
                user_id: user.id,
                prompt: finalPrompt,
                model_id: "controlnet-scribble",
                image_url: resultUrl as string,
                input_image_url: "user_upload",
                status: "succeeded",
                credits_cost: CREDITS_PER_GENERATION,
                metadata: { style }
            });

            return NextResponse.json({ url: resultUrl, success: true });

        } catch (aiError: any) {
            console.error("AI Service Failed:", aiError);

            // 【重要】AI 生成失败，退款！
            await supabase.rpc('decrease_credits', {
                p_user_id: user.id,
                p_amount: -CREDITS_PER_GENERATION, // 负数 = 退款
                p_description: 'Refund: AI Generation Failed'
            });

            return NextResponse.json({
                error: "生成失败，积分已退回",
                code: "AI_FAILED",
                refunded: true
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Generation error:", error);
        return NextResponse.json(
            { error: error.message || "服务器错误", code: "UNKNOWN_ERROR" },
            { status: 500 }
        );
    }
}
