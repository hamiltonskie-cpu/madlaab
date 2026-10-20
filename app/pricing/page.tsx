import type { Metadata } from "next";
import Link from "next/link";
import { PricingCheckout } from "./pricing-checkout";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">Pricing</span>
        <h1>One premium. A team of agents.</h1>
        <p>Revenue recovery and cybersecurity support in one practice partnership.</p>
      </section>

      <section className="container section-tight">
        <div className="pricing-panel">
          <div>
            <span className="eyebrow">Relay practice premium</span>
            <div className="pricing-price">
              $10,000
              <small>per practice · per month · enterprise-grade operations included</small>
            </div>
            <p className="pricing-description">
              A high-touch deployment built to modern healthcare operational standards, scoped to
              your practice, workflows, patient access model, and security posture. Final fit and
              scope are confirmed during the practice review.
            </p>
            <ul className="check-list">
              <li>After-hours call response and SMS follow-up with human-supervised rules</li>
              <li>Appointment confirmation and eligibility workflows designed for patient access</li>
              <li>Denial and unpaid claim follow-up queues to reduce missed revenue</li>
              <li>Patient recall campaigns and attribution dashboard for measurable recovery</li>
              <li>Cybersecurity agents for threat triage, escalation, and response support</li>
              <li>Advanced firewall policy monitoring and reviewed change recommendations</li>
              <li>Practice-specific setup, monitoring, and optimization with operational oversight</li>
            </ul>
          </div>

          <div className="pricing-side">
            <h3>Start with a practice review.</h3>
            <p>
              We&apos;ll confirm your systems, security requirements, operating rules, and
              implementation scope before any commitment.
            </p>
            <Link className="button button-light" href="/apply">
              Apply to join Relay <span>↗</span>
            </Link>

            <div className="pricing-checkout">
              <h3>Already approved?</h3>
              <p>Complete your monthly subscription securely through PayPal.</p>
              <PricingCheckout />
            </div>
          </div>
        </div>

        <p className="notice" style={{ marginTop: 18 }}>
          The premium includes enterprise-grade operational coverage and cybersecurity support.
          Firewall deployment depends on your network and hosting environment, and all rule
          changes require approval. No security service can guarantee prevention of every
          incident. Subscription checkout is available only after PayPal credentials and an
          approved plan are configured.
        </p>
      </section>

      <section className="container section-tight">
        <div className="two-col">
          <div>
            <span className="eyebrow">What&apos;s included</span>
            <h2>Everything your practice needs to recover more revenue without adding overhead.</h2>
          </div>

          <ul className="check-list">
            <li>AI phone coverage for missed calls and after-hours patients</li>
            <li>Patient outreach and recall flows driven by practice rules and scheduling windows</li>
            <li>Eligibility verification, resubmission, and claim follow-up support</li>
            <li>Secure reporting, attribution, and revenue insight reviews</li>
            <li>Security triage, incident guidance, and policy review support</li>
          </ul>
        </div>
      </section>
    </>
  );
}
