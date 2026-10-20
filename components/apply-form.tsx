"use client";

import { useState } from "react";

export function ApplyForm() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setMessage("");
    try {
      const form = new FormData(formElement);
      const payload = { ...Object.fromEntries(form), marketingConsent: form.get("marketingConsent") === "on" };
      const response = await fetch("/api/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      setMessage(response.ok ? result.message : result.error ?? "Something went wrong. Please try again.");
      if (response.ok) formElement.reset();
    } catch {
      setMessage("We couldn't send your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return <form className="form-card" onSubmit={submit}><div className="form-grid">
    <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" type="text" autoComplete="name" required maxLength={100} /></div>
    <div className="field"><label htmlFor="email">Work email</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={200} /></div>
    <div className="field"><label htmlFor="practice">Practice name</label><input id="practice" name="practice" type="text" required maxLength={160} /></div>
    <div className="field"><label htmlFor="type">Practice type</label><select id="type" name="practiceType" required defaultValue=""><option value="" disabled>Select one</option><option>Medical</option><option>Dental</option><option>Med spa</option><option>Other</option></select></div>
    <div className="field"><label htmlFor="locations">Number of locations</label><select id="locations" name="locations" defaultValue="1"><option>1</option><option>2–5</option><option>6–10</option><option>11+</option></select></div>
    <div className="field"><label htmlFor="phone">Phone (optional)</label><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} /></div>
    <div className="field span-two"><label htmlFor="challenge">What would you like to improve?</label><textarea id="challenge" name="challenge" maxLength={1200} placeholder="Missed calls, claims, patient recall..." /></div>
  </div><p className="notice form-notice">Please do not include patient, health, insurance, or claim details in this form.</p><label className="marketing-consent"><input name="marketingConsent" type="checkbox" /><span>Email me occasional product and practice-operations updates. This is optional; I can unsubscribe at any time.</span></label><button className="button" type="submit" disabled={submitting}>{submitting ? "Sending..." : "Request a practice review"} <span aria-hidden="true">↗</span></button>{message && <p className="form-message" role="status">{message}</p>}</form>;
}