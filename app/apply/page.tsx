import type { Metadata } from "next";
import { ApplyForm } from "@/components/apply-form";

export const metadata: Metadata = { title: "Apply" };

export default function ApplyPage() {
  return <><section className="container page-intro"><span className="eyebrow">Apply to join</span><h1>Let's find the revenue hiding in your workflow.</h1><p>Tell us a little about your practice. We'll follow up to understand your systems, priorities, and whether Relay is a fit.</p></section><section className="container section-tight"><div className="form-layout"><aside className="form-aside"><h2>A practical first conversation.</h2><p>We'll review your current call and follow-up workflows, then outline a realistic path to implementation.</p><p>Relay is currently focused on medical, dental, and med spa practices.</p></aside><ApplyForm /></div></section></>;
}