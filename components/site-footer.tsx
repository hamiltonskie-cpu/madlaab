import Link from "next/link";

export function SiteFooter() {
  return <footer className="footer"><div className="container">
    <div className="footer-top"><div><Link className="brand" href="/"><span className="brand-mark">R</span> relay practice</Link><p className="footer-copy">AI agents that keep your front office moving and your revenue from slipping through the cracks.</p></div>
      <nav className="footer-links" aria-label="Footer navigation"><Link href="/how-it-works">How it works</Link><Link href="/roi-calculator">ROI calculator</Link><Link href="/case-studies">Case studies</Link><Link href="/pricing">Pricing</Link><Link href="/blog">Blog</Link><Link href="/dashboard">Dashboard</Link><Link href="/apply">Apply</Link></nav></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Relay Practice</span><span>Built for better patient access.</span></div>
  </div></footer>;
}