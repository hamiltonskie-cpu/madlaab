import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const apiKey = process.env.INTERNAL_API_KEY;
  const suppliedKey = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const expected = Buffer.from(apiKey ?? "");
  const supplied = Buffer.from(suppliedKey);
  if (expected.length < 32 || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const rateLimit = await checkRateLimit(request, "sms", 60, 60);
  if (rateLimit === "unavailable") return NextResponse.json({ error: "SMS is temporarily unavailable." }, { status: 503 });
  if (rateLimit === "limited") return NextResponse.json({ error: "SMS request limit reached." }, { status: 429, headers: { "Retry-After": "60" } });
  let to: string;
  let message: string;
  try { const body = await request.json(); to = String(body.to ?? "").trim(); message = String(body.message ?? "").trim(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!/^\+[1-9]\d{7,14}$/.test(to) || !message || message.length > 1400) return NextResponse.json({ error: "Provide a valid E.164 phone number and a message under 1,400 characters." }, { status: 400 });
  const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: token, TWILIO_FROM_NUMBER: from } = process.env;
  if (!sid || !token || !from) return NextResponse.json({ error: "SMS is not configured." }, { status: 503 });
  const credentials = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({ To: to, From: from, Body: message });
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, { method: "POST", headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" }, body: params, cache: "no-store" });
  if (!response.ok) return NextResponse.json({ error: "Twilio could not send the message." }, { status: 502 });
  const result = await response.json() as { sid: string; status: string };
  return NextResponse.json({ id: result.sid, status: result.status }, { status: 202 });
}