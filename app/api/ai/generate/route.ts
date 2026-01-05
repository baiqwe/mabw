import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import Replicate from "replicate";
import { deductCredits } from "@/utils/credits";

// Required for Cloudflare Pages deployment
export const runtime = 'edge';

export const maxDuration = 60; // 1 minute timeout

export async function POST(request: NextRequest) {
    try {
        const { image, prompt, style } = await request.json();
        const supabase = await createClient();

        // 1. Auth Check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Input Validation
        if (!image || !prompt) {
            return NextResponse.json({ error: "Missing image or prompt" }, { status: 400 });
        }

        if (!process.env.REPLICATE_API_TOKEN) {
            console.error("REPLICATE_API_TOKEN is not set");
            return NextResponse.json({ error: "Service configuration error" }, { status: 500 });
        }

        // 3. Deduct Credits
        try {
            await deductCredits(user.id, 10, `AI Generation (${style || 'custom'})`);
        } catch (error: any) {
            if (error.code === 'INSUFFICIENT_CREDITS') {
                return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
            }
            throw error;
        }

        // 4. Call Replicate API
        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });

        // ControlNet Scribble Configuration
        // Using a popular version of jagilley/controlnet-scribble
        const model = "jagilley/controlnet-scribble:435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117";

        // Adjust negative prompt and prompt based on style
        let finalPrompt = prompt;
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

        // Replicate returns an array of image URLs (or single string depending on model, scribble returns array)
        const resultUrl = Array.isArray(output) ? output[1] || output[0] : output;

        // 5. Store Generation Record
        await supabase.from("generations").insert({
            user_id: user.id,
            prompt: finalPrompt,
            model_id: "controlnet-scribble",
            image_url: resultUrl as string,
            input_image_url: "user_upload", // In a real app we'd upload inputs to storage too
            status: "succeeded",
            credits_cost: 10,
            metadata: { style }
        });

        return NextResponse.json({ url: resultUrl });

    } catch (error: any) {
        console.error("Generation error:", error);
        // TODO: Refund credits if Replicate fails?
        // For MVP, we log it. Manual refund or robust queue system needed for prod.
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
