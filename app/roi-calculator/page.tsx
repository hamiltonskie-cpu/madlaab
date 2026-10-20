import type { Metadata } from "next";
import { RoiCalculator } from "@/components/roi-calculator";

export const metadata: Metadata = { title: "ROI calculator" };

export default function RoiCalculatorPage() {
  return <><section className="container page-intro"><span className="eyebrow">ROI calculator</span><h1>Put a number on the calls you miss.</h1><p>Adjust a few practice-specific assumptions to see an illustrative annual estimate. Use it as a starting point for a real workflow review, not a promise of results.</p></section><section className="container section-tight"><RoiCalculator /></section></>;
}