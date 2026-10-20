"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";

export function PayPalCheckout({ clientId, planId }: { clientId: string; planId: string }) {
  const [message, setMessage] = useState("");
  return <PayPalScriptProvider options={{ clientId, vault: true, intent: "subscription", components: "buttons" }}><div className="paypal-box"><PayPalButtons style={{ layout: "vertical", label: "subscribe" }} createSubscription={(_data, actions) => actions.subscription.create({ plan_id: planId })} onApprove={async (data) => {
    if (!data.subscriptionID) return;
    const response = await fetch("/api/paypal/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscriptionId: data.subscriptionID }) });
    const result = await response.json();
    setMessage(response.ok ? "Subscription confirmed. Our team will be in touch to begin onboarding." : result.error ?? "We could not verify this subscription.");
  }} onError={() => setMessage("PayPal could not complete checkout. Please try again or apply for a practice review.")} /></div>{message && <p className="form-message">{message}</p>}</PayPalScriptProvider>;
}
