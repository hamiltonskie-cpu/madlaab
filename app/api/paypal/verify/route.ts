import { NextResponse } from "next/server";
import { getPayPalAccessToken, paypalBase } from "@/lib/paypal";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const rateLimit = await checkRateLimit(request, "paypal-verify", 15, 60);
  if (rateLimit === "unavailable") return NextResponse.json({ error: "Payment verification is temporarily unavailable." }, { status: 503 });
  if (rateLimit === "limited") return NextResponse.json({ error: "Too many verification attempts." }, { status: 429, headers: { "Retry-After": "60" } });
  let subscriptionId: string;
  try { subscriptionId = String((await request.json()).subscriptionId ?? ""); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!/^[A-Z0-9-]{8,64}$/i.test(subscriptionId)) return NextResponse.json({ error: "Invalid subscription reference." }, { status: 400 });
  if (!process.env.PAYPAL_PLAN_ID) return NextResponse.json({ error: "Subscription plan is not configured." }, { status: 503 });
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Subscription recording is not configured." }, { status: 503 });
  try {
    const token = await getPayPalAccessToken();
    const response = await fetch(`${paypalBase}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!response.ok) return NextResponse.json({ error: "Could not verify subscription with PayPal." }, { status: 502 });
    const subscription = await response.json() as { id: string; status: string; plan_id: string };
    if (subscription.id !== subscriptionId || subscription.plan_id !== process.env.PAYPAL_PLAN_ID || subscription.status !== "ACTIVE") return NextResponse.json({ error: "PayPal has not marked this subscription active on the approved plan." }, { status: 400 });
    const { error } = await supabase.from("subscriptions").upsert({ paypal_subscription_id: subscription.id, status: subscription.status.toLowerCase(), plan_id: subscription.plan_id }, { onConflict: "paypal_subscription_id" });
    if (error) return NextResponse.json({ error: "Subscription verified but could not be recorded. Contact support." }, { status: 500 });
    return NextResponse.json({ status: subscription.status });
  } catch { return NextResponse.json({ error: "Subscription verification is temporarily unavailable." }, { status: 503 }); }
}