import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };
const metrics = [["Calls answered", "1,284", "+12% vs. prior period"], ["Appointments booked", "326", "+8% vs. prior period"], ["Claims recovered", "$42,680", "Across 37 claims"], ["Revenue attributed", "$128,450", "Illustrative attribution"]];
const activity = [["After-hours call → appointment", "$380 attributed", "8:42 PM"], ["Denied claim moved to review", "$1,240 in queue", "4:18 PM"], ["Recall reply → visit booked", "$520 attributed", "2:06 PM"], ["24-hour confirmation completed", "Appointment confirmed", "11:30 AM"], ["Unpaid claim follow-up logged", "$840 in queue", "10:14 AM"]];
const barHeights = [42, 58, 49, 70, 61, 84, 67, 92, 74, 80, 65, 97];

export default function DashboardPage() {
  return <section className="container dashboard-page"><div className="dashboard-head"><div><span className="eyebrow">Practice dashboard</span><h1>Good morning, Northstar.</h1><p>June 1–30, 2026 · Sample workspace</p></div><span className="demo-badge">Illustrative demo data</span></div><div className="notice dashboard-notice">This dashboard contains sample metrics for demonstration only. No live practice data is connected.</div>
    <div className="metrics-grid">{metrics.map(([label,value,detail]) => <article className="metric" key={label}><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><span className="metric-change">{detail}</span></article>)}</div>
    <div className="dashboard-lower"><section className="dash-panel"><h2>Revenue attributed</h2><div className="chart-bars" aria-label="Illustrative weekly revenue chart">{barHeights.map((height,index) => <div className="bar-wrap" key={index}><div className="bar" style={{ height: `${height}%`, animationDelay: `${index*35}ms` }} /></div>)}</div><div className="chart-labels"><span>Jun 1</span><span>Jun 8</span><span>Jun 15</span><span>Jun 22</span><span>Jun 30</span></div></section><section className="dash-panel"><h2>Latest activity</h2>{activity.map(([event,value,time]) => <div className="activity-row" key={event}><span><b>{event}</b><br /><span className="activity-value">{value}</span></span><span>{time}</span></div>)}</section></div>
  </section>;
}