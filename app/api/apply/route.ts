import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const rateLimit = await checkRateLimit(request, "apply", 5, 3600);
  if (rateLimit === "unavailable") return NextResponse.json({ error: "Application intake is temporarily unavailable." }, { status: 503 });
  if (rateLimit === "limited") return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": "3600" } });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const practice = String(body.practice ?? "").trim();
  const practiceType = String(body.practiceType ?? "").trim();
  const locations = String(body.locations ?? "1").trim();
  const phone = String(body.phone ?? "").trim();
  const challenge = String(body.challenge ?? "").trim();
  const marketingConsent = body.marketingConsent;
  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200 || !practice || practice.length > 160 || !["Medical", "Dental", "Med spa", "Other"].includes(practiceType) || !["1", "2–5", "6–10", "11+"].includes(locations) || phone.length > 30 || challenge.length > 1200 || typeof marketingConsent !== "boolean") return NextResponse.json({ error: "Please check the required fields and try again." }, { status: 400 });
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Applications are not enabled yet. Configure Supabase to receive practice review requests." }, { status: 503 });
  const { error } = await supabase.from("applications").insert({ name, email, practice_name: practice, practice_type: practiceType, locations, phone: phone || null, challenge: challenge || null, marketing_consent: marketingConsent, marketing_consent_at: marketingConsent ? new Date().toISOString() : null });
  if (error) return NextResponse.json({ error: "We couldn't save your application. Please try again shortly." }, { status: 500 });
  return NextResponse.json({ message: "Thanks. Your practice review request has been received." }, { status: 201 });
}