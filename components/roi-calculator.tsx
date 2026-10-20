"use client";

import { useState } from "react";

const money = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export function RoiCalculator() {
  const [missedCalls, setMissedCalls] = useState(80);
  const [visitValue, setVisitValue] = useState(300);
  const [recoveryRate, setRecoveryRate] = useState(30);
  const recovered = Math.round(missedCalls * recoveryRate / 100 * visitValue * 12);
  const missedAnnual = missedCalls * visitValue * 12;
  return <div className="calculator"><div className="calc-controls">
    <div className="field"><label htmlFor="missed">Missed calls each month <output>{missedCalls}</output></label><input id="missed" type="range" min="10" max="300" step="5" value={missedCalls} onChange={(event) => setMissedCalls(Number(event.target.value))} /></div>
    <div className="field"><label htmlFor="visit-value">Average value of a visit <output>{money(visitValue)}</output></label><input id="visit-value" type="range" min="75" max="1500" step="25" value={visitValue} onChange={(event) => setVisitValue(Number(event.target.value))} /></div>
    <div className="field"><label htmlFor="recovery">Estimated recovery rate <output>{recoveryRate}%</output></label><input id="recovery" type="range" min="10" max="70" step="5" value={recoveryRate} onChange={(event) => setRecoveryRate(Number(event.target.value))} /></div>
    <p className="notice">Illustrative estimate only. Actual results depend on contactability, appointment capacity, payer decisions, and practice-specific workflows.</p>
  </div><div className="calc-result"><span className="result-label">Potential annual visit revenue recovered</span><strong className="result-number">{money(recovered)}</strong><div className="result-row"><span>Estimated annual value of missed calls</span><strong>{money(missedAnnual)}</strong></div><div className="result-row"><span>Assumed recovery rate</span><strong>{recoveryRate}%</strong></div><div className="result-row"><span>Estimated recovered visits / year</span><strong>{Math.round(missedCalls * 12 * recoveryRate / 100).toLocaleString()}</strong></div></div></div>;
}