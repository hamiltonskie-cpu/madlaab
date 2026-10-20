"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setMessage("");
    try {
      const form = new FormData(formElement);
      const response = await fetch("/api/marketing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          country: form.get("country"),
          practiceType: form.get("practiceType"),
          consent: form.get("consent") === "on",
        }),
      });
      const result = await response.json();
      setMessage(response.ok ? result.message : result.error ?? "We couldn't add you right now. Please try again.");
      if (response.ok) formElement.reset();
    } catch {
      setMessage("We couldn't reach the signup service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return <form className="newsletter-form" onSubmit={submit}>
    <div className="newsletter-fields">
      <div className="field"><label htmlFor="newsletter-email">Work email</label><input id="newsletter-email" name="email" type="email" autoComplete="email" required maxLength={200} /></div>
      <div className="field"><label htmlFor="newsletter-country">Market</label><select id="newsletter-country" name="country" defaultValue="US" required><option value="US">United States</option><option value="UK">United Kingdom</option><option value="ZA">South Africa</option></select></div>
      <div className="field"><label htmlFor="newsletter-practice">Practice type</label><select id="newsletter-practice" name="practiceType" defaultValue="Medical" required><option value="Medical">Medical</option><option value="Dental">Dental</option><option value="Med spa">Med spa</option><option value="Other">Other</option></select></div>
    </div>
    <label className="marketing-consent newsletter-consent"><input name="consent" type="checkbox" required /><span>I agree to receive occasional Relay emails about practice operations and the service. I can unsubscribe from any email.</span></label>
    <button className="button" type="submit" disabled={submitting}>{submitting ? "Adding you..." : "Get practice updates"} <span aria-hidden="true">↗</span></button>
    {message && <p className="form-message" role="status">{message}</p>}
  </form>;
}