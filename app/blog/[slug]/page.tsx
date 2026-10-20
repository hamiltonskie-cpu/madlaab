import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const posts = {
  "missed-calls-patient-access": { category: "Patient access", date: "June 18, 2026", title: "The hidden cost of a missed call is a missed first impression.", intro: "When a patient calls outside office hours, the experience still reflects your practice. A clear, compliant follow-up process can keep that first conversation from ending at voicemail.", headings: [["Start with the call path", "Map what callers hear, when messages are checked, and who owns the next response. Find the moments where a patient has to try again."], ["Make the next step easy", "Offer a clear way to request an appointment and route the reply to an approved scheduling workflow. Keep staff in the loop when a request falls outside those rules."], ["Measure the handoff", "Track calls answered, conversations continued, and appointments booked. A useful baseline helps a practice understand where follow-through is working and where it needs attention."]] },
  "claims-follow-up-workflow": { category: "Revenue cycle", date: "June 04, 2026", title: "Build a denial follow-up queue your team can actually work.", intro: "A denial is only actionable when someone can see its status, understand the next step, and know who owns it. Workflow clarity matters more than another pile of reminders.", headings: [["Give every item an owner", "A focused queue makes responsibility visible and limits duplicate work. Route items according to payer, denial category, and your practice's process."], ["Keep the next action specific", "Separate missing documentation from appeal preparation or payer outreach. Use system references rather than exposing patient details in general-purpose dashboards."], ["Close the loop", "Record the follow-up date, result, and disposition. Review aging claims regularly and use staff approval for communications that could affect a claim or patient account."]] },
  "patient-recall-with-care": { category: "Patient relationships", date: "May 21, 2026", title: "A patient recall campaign should feel like an invitation.", intro: "Recall works best when it helps a patient take a useful next step, rather than turning an old list into a blast. Thoughtful timing and clear preferences are part of the workflow.", headings: [["Start with clean segments", "Use practice-defined recall criteria and current communication preferences. Exclude people who should not receive outreach and make opt-out handling straightforward."], ["Keep messages human", "A short, clear invitation can tell someone why the practice is reaching out and how to schedule. Avoid unnecessary sensitive details in SMS."], ["Follow the reply", "Route questions and appointment requests to an approved path. Track responses and booked visits so the team can learn which outreach is helpful."]] },
};

type Slug = keyof typeof posts;
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = posts[slug as Slug]; return post ? { title: post.title } : {}; }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug as Slug];
  if (!post) notFound();
  return <article className="container section-tight article-body"><Link className="eyebrow" href="/blog">← All articles</Link><p className="article-meta article-date">{post.category} · {post.date}</p><h1>{post.title}</h1><p>{post.intro}</p>{post.headings.map(([heading,body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</article>;
}