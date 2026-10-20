import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type RateLimitResult = "allowed" | "limited" | "unavailable";

const developmentWindows = new Map<string, { startedAt: number; count: number }>();

export async function checkRateLimit(request: Request, bucket: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  if (process.env.NODE_ENV === "development") {
    const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "127.0.0.1";
    const key = `${bucket}:${ip}`;
    const now = Date.now();
    const current = developmentWindows.get(key);
    if (!current || now - current.startedAt >= windowSeconds * 1000) {
      developmentWindows.set(key, { startedAt: now, count: 1 });
      for (const [entry, window] of developmentWindows) {
        if (now - window.startedAt > windowSeconds * 2000) developmentWindows.delete(entry);
      }
      return "allowed";
    }
    current.count += 1;
    return current.count <= limit ? "allowed" : "limited";
  }

  const secret = process.env.RATE_LIMIT_HASH_SECRET;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? forwarded;
  const supabase = getSupabaseAdmin();
  if (!secret || secret.length < 32 || !ip || !isIP(ip) || !supabase) return "unavailable";

  const keyHash = createHmac("sha256", secret).update(`${bucket}:${ip}`).digest("hex");
  const { data, error } = await supabase.rpc("consume_api_rate_limit", {
    p_key_hash: keyHash,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error || typeof data !== "boolean") return "unavailable";
  return data ? "allowed" : "limited";
}