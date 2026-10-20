import { PayPalCheckout } from "@/components/paypal-checkout";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function PricingCheckout() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const planId = process.env.PAYPAL_PLAN_ID;
  const supabase = getSupabaseAdmin();
  if (!clientId || !planId || !supabase) return <div className="paypal-box">Online checkout is unavailable until PayPal and subscription recording are configured. Apply above to discuss onboarding.</div>;
  const isLive = process.env.PAYPAL_ENVIRONMENT === "live";
  return <>
    {!isLive && <p className="payment-mode-note">Sandbox test mode. No real payment will be collected.</p>}
    <PayPalCheckout clientId={clientId} planId={planId} />
  </>;
}