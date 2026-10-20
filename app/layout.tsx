import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Relay Practice | Revenue recovery, on autopilot", template: "%s | Relay Practice" }, description: "AI agents for medical, dental, and med spa practices. Recover missed calls, appointments, and revenue around the clock." };
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}