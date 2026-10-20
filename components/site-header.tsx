"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [["How it works", "/how-it-works"], ["ROI calculator", "/roi-calculator"], ["Case studies", "/case-studies"], ["Pricing", "/pricing"], ["Blog", "/blog"]] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="topbar"><div className="container nav-wrap">
    <Link className="brand" href="/" onClick={() => setOpen(false)} aria-label="Relay Practice home"><span className="brand-mark">R</span> relay practice</Link>
    <nav className={`nav-links${open ? " is-open" : ""}`} aria-label="Main navigation">
      {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
    </nav>
    <Link className="nav-cta" href="/apply">Apply to join <span aria-hidden="true">↗</span></Link>
    <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? "×" : "☰"}</button>
  </div></header>;
}