
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Manually load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    envConfig.split("\n").forEach((line) => {
        const [key, ...value] = line.split("=");
        if (key && value) {
            process.env[key.trim()] = value.join("=").trim();
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing Supabase URL or Service Role Key in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function main() {
    console.log("Starting user fix script...");

    // 1. List all users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error("Error listing users:", listError);
        return;
    }

    console.log(`Found ${users.length} users.`);

    for (const user of users) {
        console.log(`Processing user: ${user.email} (${user.id})`);

        // 2. Check if customer exists
        const { data: customer, error: fetchError } = await supabase
            .from("customers")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error(`Error checking customer for ${user.email}:`, fetchError);
            continue;
        }

        if (!customer) {
            console.log(`  -> Customer record missing. Creating...`);
            const { error: insertError } = await supabase.from("customers").insert({
                user_id: user.id,
                email: user.email,
                credits: 1000,
                creem_customer_id: `manual_fix_${user.id}`,
                metadata: { source: "manual_script_fix" },
            });

            if (insertError) {
                console.error(`  -> Failed to insert customer:`, insertError);
            } else {
                console.log(`  -> Validated! Created with 1000 credits.`);
            }
        } else {
            console.log(`  -> Customer exists. Current credits: ${customer.credits}`);
            console.log(`  -> Adding 1000 credits...`);

            // Use RPC to safely add credits (negative decrease = increase)
            const { error: rpcError } = await supabase.rpc('decrease_credits', {
                p_user_id: user.id,
                p_amount: -1000,
                p_description: 'Manual script credit grant'
            });

            if (rpcError) {
                // Fallback to direct update if RPC fails
                console.warn(`  -> RPC failed (${rpcError.message}), trying direct update...`);
                const { error: updateError } = await supabase.from('customers')
                    .update({ credits: (customer.credits || 0) + 1000 })
                    .eq('user_id', user.id);

                if (updateError) console.error(`  -> Direct update failed:`, updateError);
                else console.log(`  -> Credits updated!`);
            } else {
                console.log(`  -> Credits added successfully via RPC.`);
            }
        }
    }

    console.log("Done.");
}

main();
