import React, { useState } from 'react';
import { AlertOctagon, HelpCircle, Check, ArrowRight, Ban } from 'lucide-react';
import { computeObservedPostHocPower } from '../utils/stats';

export function Segment6PostHocFallacy() {
  const [observedP, setObservedP] = useState<number>(0.05);

  const observedPower = computeObservedPostHocPower(observedP);

  // SVG dimensions for the Post-Hoc Power curve
  const svgWidth = 540;
  const svgHeight = 220;
  const margin = { top: 20, right: 25, bottom: 40, left: 45 };
  const plotWidth = svgWidth - margin.left - margin.right;
  const plotHeight = svgHeight - margin.top - margin.bottom;

  const scaleP = (p: number) => margin.left + (p / 0.5) * plotWidth;
  const scalePower = (pow: number) => margin.top + plotHeight - pow * plotHeight;

  // Generate curve data points from p = 0.001 to p = 0.50
  const curvePoints: { x: number; y: number }[] = [];
  for (let p = 0.005; p <= 0.50; p += 0.005) {
    const pow = computeObservedPostHocPower(p);
    curvePoints.push({
      x: scaleP(p),
      y: scalePower(pow),
    });
  }

  const curvePathD = `M ${curvePoints.map(pt => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' L ')}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded">
            Section 8.4 Critical Fallacy
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            The Post-Hoc Power Fallacy & Ambiguous Results
          </h3>
        </div>
        <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
          <Ban className="w-5 h-5" />
        </div>
      </div>

      {/* Warning Box */}
      <div className="my-4 p-4 rounded-xl bg-rose-950/25 border border-rose-800/40 space-y-2">
        <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
          <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400" />
          <span>Why Observed (Post-Hoc) Power Adds Nothing</span>
        </div>
        <p className="text-xs text-rose-200/90 leading-relaxed">
          "The result was not significant, so we calculated the power from our observed effect, and it was low."
          <span className="block mt-1 font-semibold text-white">
            This is circular arithmetic: Post-hoc power is a strictly 1-to-1 function of the p-value.
          </span>
        </p>
      </div>

      {/* Interactive 1-to-1 Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Curve SVG */}
        <div className="lg:col-span-7 bg-slate-950/60 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300 font-semibold">Observed Power vs. p-Value</span>
            <span className="text-[11px] font-mono text-slate-400">Strict mathematical identity</span>
          </div>

          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
            {/* Grid & Axis */}
            <line
              x1={margin.left}
              y1={margin.top + plotHeight}
              x2={svgWidth - margin.right}
              y2={margin.top + plotHeight}
              stroke="#334155"
              strokeWidth="1.5"
            />
            <line
              x1={margin.left}
              y1={margin.top}
              x2={margin.left}
              y2={margin.top + plotHeight}
              stroke="#334155"
              strokeWidth="1.5"
            />

            {/* Benchmark Lines: p = 0.05 and p = 0.20 */}
            {/* p = 0.05 line -> Power = 0.50 */}
            <line
              x1={scaleP(0.05)}
              y1={margin.top}
              x2={scaleP(0.05)}
              y2={margin.top + plotHeight}
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <line
              x1={margin.left}
              y1={scalePower(0.50)}
              x2={scaleP(0.05)}
              y2={scalePower(0.50)}
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <circle cx={scaleP(0.05)} cy={scalePower(0.50)} r="4" fill="#f59e0b" />
            <text x={scaleP(0.05) + 6} y={scalePower(0.50) - 6} fill="#f59e0b" fontSize="10" fontWeight="bold">
              p = 0.05 → 50%
            </text>

            {/* p = 0.20 line -> Power = 0.25 */}
            <line
              x1={scaleP(0.20)}
              y1={margin.top}
              x2={scaleP(0.20)}
              y2={margin.top + plotHeight}
              stroke="#a855f7"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <line
              x1={margin.left}
              y1={scalePower(0.25)}
              x2={scaleP(0.20)}
              y2={scalePower(0.25)}
              stroke="#a855f7"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <circle cx={scaleP(0.20)} cy={scalePower(0.25)} r="4" fill="#a855f7" />
            <text x={scaleP(0.20) + 6} y={scalePower(0.25) - 6} fill="#a855f7" fontSize="10" fontWeight="bold">
              p = 0.20 → 25%
            </text>

            {/* The 1-to-1 Curve */}
            <path d={curvePathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

            {/* Current Selected p-value point */}
            <circle
              cx={scaleP(Math.min(0.5, observedP))}
              cy={scalePower(observedPower)}
              r="6"
              fill="#ec4899"
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Labels */}
            <text x={margin.left + 5} y={margin.top + 12} fill="#94a3b8" fontSize="10">
              Power (100%)
            </text>
            <text x={svgWidth - margin.right} y={margin.top + plotHeight - 5} fill="#94a3b8" fontSize="10" textAnchor="end">
              Observed p-value
            </text>
            <text x={scaleP(0.05)} y={margin.top + plotHeight + 16} fill="#64748b" fontSize="10" textAnchor="middle">
              0.05
            </text>
            <text x={scaleP(0.20)} y={margin.top + plotHeight + 16} fill="#64748b" fontSize="10" textAnchor="middle">
              0.20
            </text>
          </svg>

          {/* Slider */}
          <div className="mt-3 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Test Observed p-Value:</span>
              <span className="font-mono text-pink-400 font-bold">p = {observedP.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.40"
              step="0.01"
              value={observedP}
              onChange={(e) => setObservedP(parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Metric Callout */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Calculated Post-Hoc Power
            </div>
            <div className="text-2xl font-bold font-mono text-pink-400 mt-1">
              {(observedPower * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {observedP > 0.05 ? (
                <>
                  Because <span className="font-mono text-slate-200">p &gt; 0.05</span>, observed power is <strong className="text-rose-300">guaranteed to be below 50%</strong> by pure arithmetic alone! It does not prove the test was "underpowered".
                </>
              ) : (
                <>
                  Because <span className="font-mono text-slate-200">p ≤ 0.05</span>, observed power is <strong className="text-emerald-300">above 50%</strong>.
                </>
              )}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-200/90 leading-relaxed">
            <strong className="text-emerald-300 block mb-1">The Golden Rule:</strong>
            "Power is a planning quantity, computed <strong className="text-white">before</strong> the study. After the study, report the effect estimate with its confidence interval."
          </div>
        </div>
      </div>

      {/* Confidence Interval Comparison: "Inconclusive" vs "No Effect" */}
      <div className="mt-5 pt-4 border-t border-slate-800">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-300 mb-2">
          Interpreting Non-Significant Results via Confidence Intervals
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Study A: Small Sample -> Inconclusive */}
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300">Small Study (n = 18)</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-mono text-[11px]">
                p = 0.28 (Not Significant)
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300">
              Point Estimate: +0.35 kg • 95% CI: [-0.30 kg, +1.00 kg]
            </div>
            <p className="text-slate-400 leading-relaxed">
              The wide interval spans zero, but also includes clinically important benefits (+1.00 kg).
              <strong className="text-amber-300 block mt-1">Conclusion: INCONCLUSIVE (not "no effect").</strong>
            </p>
          </div>

          {/* Study B: Large Sample -> Real evidence of no effect */}
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300">Large Study (n = 450)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 font-mono text-[11px]">
                p = 0.35 (Not Significant)
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300">
              Point Estimate: +0.04 kg • 95% CI: [-0.05 kg, +0.13 kg]
            </div>
            <p className="text-slate-400 leading-relaxed">
              The tight interval is bounded near zero, ruling out any meaningful clinical difference (&gt; 0.5 kg).
              <strong className="text-emerald-300 block mt-1">Conclusion: EVIDENCE OF NO MEANINGFUL EFFECT.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
