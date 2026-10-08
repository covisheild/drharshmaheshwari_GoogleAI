import React, { useState } from 'react';
import { Target, BookOpen, Calculator, Check, ArrowRight } from 'lucide-react';

export function Segment4EffectSize() {
  const [rawDelta, setRawDelta] = useState<number>(1.0);
  const [pooledSD, setPooledSD] = useState<number>(1.88); // 1.0 / 1.88 = 0.53 (matching text d = 0.53)

  const cohensD = pooledSD > 0 ? (rawDelta / pooledSD) : 0;

  const getDClassification = (d: number) => {
    if (d < 0.2) return { label: 'Negligible', color: 'text-slate-400' };
    if (d < 0.5) return { label: 'Small Effect', color: 'text-sky-400' };
    if (d < 0.8) return { label: 'Medium Effect (0.5 – 0.8)', color: 'text-emerald-400' };
    return { label: 'Large Effect (> 0.8)', color: 'text-amber-400' };
  };

  const classification = getDClassification(cohensD);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            Section 8.4 Core Concept
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Significance Level, Power & Effect Size
          </h3>
        </div>
        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
          <Target className="w-5 h-5" />
        </div>
      </div>

      {/* Conceptual Definitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4">
        {/* Alpha Choice */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <span>Significance Level (α)</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
            "I accept rejecting a true null hypothesis this often, and no more."
          </p>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Fixed by the researcher <strong className="text-white">before the data are seen</strong>. Conventional default is <span className="font-mono text-slate-200">α = 0.05</span>.
          </p>
        </div>

        {/* Statistical Power */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span>Power (1 − β)</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
            "The chance that the study will find an effect of a stated size if it is there."
          </p>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Always refers to a <strong className="text-white">stated effect size</strong>, which must be specified in advance.
          </p>
        </div>
      </div>

      {/* Raw vs Standardized Effect Size Calculator */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
            <Calculator className="w-4 h-4" />
            <span>Raw vs Standardised Effect Size (Cohen's d)</span>
          </div>
          <span className={`text-xs font-semibold ${classification.color}`}>
            {classification.label}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Raw Effect */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Raw Difference in Means (Δ):</span>
              <span className="font-mono text-sky-300 font-bold">{rawDelta.toFixed(2)} kg</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={rawDelta}
              onChange={(e) => setRawDelta(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Outcome's native scale (e.g. difference in kilograms)
            </p>
          </div>

          {/* Pooled SD */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Pooled Standard Deviation (s):</span>
              <span className="font-mono text-sky-300 font-bold">{pooledSD.toFixed(2)} kg</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="3.0"
              step="0.05"
              value={pooledSD}
              onChange={(e) => setPooledSD(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Natural variability across both sampled groups
            </p>
          </div>
        </div>

        {/* Formula output */}
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <span className="text-slate-400">Cohen's d = Δ / s =</span>
            <span>{rawDelta.toFixed(2)} / {pooledSD.toFixed(2)} =</span>
            <span className="text-emerald-400 font-bold text-sm">{cohensD.toFixed(2)}</span>
          </div>
          <button
            onClick={() => { setRawDelta(1.0); setPooledSD(1.88); }}
            className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-sky-300 hover:bg-slate-700 transition"
          >
            Urban-Rural Text Value (d = 0.53)
          </button>
        </div>
      </div>

      {/* CI vs Effect Size Warning & Fisher Convention */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 block mb-1">Confidence Interval ≠ Effect Size</strong>
          A confidence interval is an <em>interval estimate</em> of an effect size, showing how precisely the effect has been measured, not the effect size itself.
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 leading-relaxed">
          <strong className="text-slate-200 block mb-1">Fisher (1925) Convention</strong>
          R. A. Fisher called P = 0.05 <em>"convenient to take as a limit"</em>. It is a historical convention and consensus baseline, not a mathematical law of nature.
        </div>
      </div>
    </div>
  );
}
