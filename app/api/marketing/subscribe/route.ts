import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const rateLimit = await checkRateLimit(request, "marketing-subscribe", 5, 3600);
  if (rateLimit === "unavailable") return NextResponse.json({ error: "Signup is temporarily unavailable." }, { status: 503 });
  if (rateLimit === "limited") return NextResponse.json({ error: "Too many signup attempts. Please try again later." }, { status: 429, headers: { "Retry-After": "3600" } });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const email = String(body.email ?? "").trim().toLowerCase();
  const country = String(body.country ?? "").trim();
  const practiceType = String(body.practiceType ?? "").trim();
  const consent = body.consent;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200 || !["US", "UK", "ZA"].includes(country) || !["Medical", "Dental", "Med spa", "Other"].includes(practiceType) || consent !== true) {
    return NextResponse.json({ error: "Enter a valid work email, select your market and practice type, and agree to receive updates." }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;
  const supabase = getSupabaseAdmin();
  if (!apiKey || !listId || !/^\d+$/.test(listId) || !supabase) return NextResponse.json({ error: "Email signup is not configured yet." }, { status: 503 });

  const consentAt = new Date().toISOString();
  const { error: saveError } = await supabase.from("marketing_subscribers").upsert({
    email,
    country,
    practice_type: practiceType,
    consent_source: "website_newsletter",
    consented_at: consentAt,
    brevo_sync_status: "pending",
  }, { onConflict: "email" });
  if (saveError) return NextResponse.json({ error: "We couldn't save your signup. Please try again later." }, { status: 503 });

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        email,
        attributes: { COUNTRY: country, PRACTICE_TYPE: practiceType },
        listIds: [Number(listId)],
        updateEnabled: true,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      await supabase.from("marketing_subscribers").update({ brevo_sync_status: "failed" }).eq("email", email);
      return NextResponse.json({ error: "Your signup was recorded, but we couldn't finish email-list setup. Please try again later." }, { status: 502 });
    }
    await supabase.from("marketing_subscribers").update({ brevo_sync_status: "synced", synced_at: new Date().toISOString() }).eq("email", email);
    return NextResponse.json({ message: "You're signed up for practice updates. You can unsubscribe from any email." }, { status: 201 });
  } catch {
    await supabase.from("marketing_subscribers").update({ brevo_sync_status: "failed" }).eq("email", email);
    return NextResponse.json({ error: "Your signup was recorded, but email-list setup is temporarily unavailable." }, { status: 502 });
  }
}