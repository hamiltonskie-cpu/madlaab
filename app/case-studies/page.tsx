import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Case studies" };
const examples = [
  { type: "Dental · modeled example", title: "Turning the after-hours ring into a booked visit.", description: "A two-provider practice routes missed calls to a follow-up workflow, then offers appointment slots from its scheduling rules.", before: "62 missed calls / month", outcome: "18 modeled bookings" },
  { type: "Med spa · modeled example", title: "Reopening conversations with lapsed patients.", description: "A consent-aware recall campaign segments inactive patients and routes interested replies to the front desk.", before: "410 inactive contacts", outcome: "36 modeled reactivations" },
  { type: "Medical · modeled example", title: "Making denied claims visible before they age out.", description: "A structured work queue prioritizes denied and overdue claims for staff review and payer follow-up.", before: "$74k in review queue", outcome: "$21k modeled recovery" },
];

export default function CaseStudiesPage() {
  return <><section className="container page-intro"><span className="eyebrow">Case studies</span><h1>Workflows worth measuring.</h1><p>These are illustrative scenarios to show how Relay's workflows could operate. They are not customer results or a guarantee of performance.</p></section><section className="container section-tight"><div className="case-grid">{examples.map((item) => <article className="case-card" key={item.title}><span className="case-tag">{item.type}</span><h3>{item.title}</h3><p>{item.description}</p><div className="case-metric"><span>{item.before}</span><strong>{item.outcome}</strong></div></article>)}</div><p className="notice" style={{ marginTop: 24 }}>Modeled examples, not verified case studies. Results vary by practice, integration, patient response, payer action, and attribution method. No patient data is used in these examples.</p></section><section className="container section-tight"><div className="cta-band"><h2>Your first case study starts with a baseline.</h2><Link className="button" href="/apply">Review your workflows <span>↗</span></Link></div></section></>;
}