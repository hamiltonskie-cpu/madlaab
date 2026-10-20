import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter-signup";

export const metadata: Metadata = { title: "Blog" };
const articles = [
  { slug: "missed-calls-patient-access", category: "Patient access", date: "June 18, 2026", title: "The hidden cost of a missed call is a missed first impression.", excerpt: "A practical way to map what happens after the front desk closes, and where a simple follow-up workflow can help." },
  { slug: "claims-follow-up-workflow", category: "Revenue cycle", date: "June 04, 2026", title: "Build a denial follow-up queue your team can actually work.", excerpt: "Start with clear ownership, consistent status, and the next action. Automation works best when the handoff is obvious." },
  { slug: "patient-recall-with-care", category: "Patient relationships", date: "May 21, 2026", title: "A patient recall campaign should feel like an invitation.", excerpt: "Segment thoughtfully, respect communication preferences, and make it easy for a person to take the next step." },
];

export default function BlogPage() {
  return <><section className="container page-intro"><span className="eyebrow">The Relay journal</span><h1>Ideas for a practice that runs on follow-through.</h1><p>Notes on patient access, revenue operations, and practical automation for independent practices.</p></section><section className="container section-tight"><div className="blog-grid">{articles.map((article) => <article className="article-card" key={article.slug}><span className="article-meta">{article.category} · {article.date}</span><h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p><Link className="eyebrow" href={`/blog/${article.slug}`}>Read article <span>↗</span></Link></article>)}</div></section><section className="container section-tight"><div className="newsletter-panel"><div><span className="eyebrow">For practice owners</span><h2>Useful ideas. No patient data. Just practice operations.</h2><p>Get occasional notes on patient access, revenue follow-through, and Relay updates.</p></div><NewsletterSignup /></div></section></>;
}