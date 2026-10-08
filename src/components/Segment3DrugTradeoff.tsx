import React, { useState } from 'react';
import { Pill, Scale, ArrowRight, TrendingDown, Layers } from 'lucide-react';
import { computePower } from '../utils/stats';

export function Segment3DrugTradeoff() {
  const [alpha, setAlpha] = useState<number>(0.05);
  const [sampleSizeN, setSampleSizeN] = useState<number>(48);
  const [isPaired, setIsPaired] = useState<boolean>(false);

  // Base standard deviation for urban-rural/drug outcome
  const baseSigma = 2.0;
  // Effective SE = (sigma * sqrt(2/n)) * (paired design reduction factor)
  const pairedFactor = isPaired ? 0.707 : 1.0;
  const effectiveSE = (baseSigma * Math.sqrt(2 / sampleSizeN)) * pairedFactor;
  const trueEffect = 1.0; // 1 kg / 1 unit improvement

  const stats = computePower(trueEffect, effectiveSE, alpha, baseSigma);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
            Section 8.3 In Practice
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Clinical Trial Decision Trade-Offs & The √n Lever
          </h3>
        </div>
        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
          <Scale className="w-5 h-5" />
        </div>
      </div>

      {/* The Two Asymmetric Costs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4">
        {/* Type I Error in Drug Trial */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
              Type I Error Cost (α)
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-200">
              α = {alpha.toFixed(3)}
            </span>
          </div>
          <h4 className="text-base font-semibold text-white mt-2 flex items-center gap-2">
            <Pill className="w-4 h-4 text-rose-400" /> Approving a Useless Drug
          </h4>
          <p className="text-xs text-rose-200/80 mt-1.5 leading-relaxed">
            Approving a drug that has no real pharmacological benefit over placebo. Patients endure toxic side-effects and financial cost without medical gain.
          </p>
        </div>

        {/* Type II Error in Drug Trial */}
        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Type II Error Cost (β)
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-200">
              β = {stats.beta.toFixed(2)}
            </span>
          </div>
          <h4 className="text-base font-semibold text-white mt-2 flex items-center gap-2">
            <Pill className="w-4 h-4 text-purple-400" /> Abandoning a Useful Drug
          </h4>
          <p className="text-xs text-purple-200/80 mt-1.5 leading-relaxed">
            Discarding or shelving a genuinely effective therapy because the study failed to reach significance. Future patients miss a cure.
          </p>
        </div>
      </div>

      {/* Principle Callout */}
      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
        <p className="leading-relaxed">
          <strong className="text-amber-300">"The choice of alpha is a judgement, not a law."</strong> For a fixed sample size, lowering alpha pushes the cut-offs outward: Type I tails shrink, but the Type II area (β) swells.
        </p>
        <p className="leading-relaxed text-slate-400">
          <strong className="text-emerald-300">To lower BOTH errors simultaneously:</strong> you must shrink the standard error! The primary lever is sample size (falls with <span className="font-mono text-emerald-300">√n</span>), or employing a paired/matched design.
        </p>
      </div>

      {/* Interactive Levers */}
      <div className="mt-5 space-y-4 pt-4 border-t border-slate-800">
        {/* Trade-off Slider: Alpha */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <span>Shift Cut-offs (Alpha Level):</span>
              <span className="font-mono text-rose-300 font-bold">{alpha}</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Cut-off = ±{stats.cutoffHigh.toFixed(2)} units
            </span>
          </div>
          <input
            type="range"
            min="0.005"
            max="0.10"
            step="0.005"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>Stricter α (0.005) → Bigger β ({stats.beta > 0.4 ? 'High!' : stats.beta.toFixed(2)})</span>
            <span>Balanced (0.05)</span>
            <span>Lenient α (0.10) → Smaller β</span>
          </div>
        </div>

        {/* The sqrt(n) Lever: Sample Size */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <span>Sample Size per group (n):</span>
              <span className="font-mono text-emerald-300 font-bold">{sampleSizeN}</span>
            </span>
            <span className="text-emerald-400 font-mono text-[11px]">
              SE = {effectiveSE.toFixed(3)} (Falls with 1/√n)
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="150"
            step="5"
            value={sampleSizeN}
            onChange={(e) => setSampleSizeN(parseInt(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>Small n = 15 (Wide SE)</span>
            <span>n = 48 (Chapter 7)</span>
            <span>Large n = 150 (Tiny SE)</span>
          </div>
        </div>

        {/* Design Lever: Paired/Matched Design */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-xs font-semibold text-slate-200">Paired / Matched Design</span>
              <p className="text-[11px] text-slate-400">Controls subject-to-subject variability, shrinking SE by ~29%</p>
            </div>
          </div>
          <button
            onClick={() => setIsPaired(!isPaired)}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              isPaired
                ? 'bg-sky-500 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isPaired ? 'Paired Enabled' : 'Unpaired'}
          </button>
        </div>
      </div>

      {/* Outcome Metric Summary */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded bg-slate-950/50 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Type I Error</span>
          <span className="text-sm font-bold font-mono text-rose-400">{(alpha * 100).toFixed(1)}%</span>
        </div>
        <div className="p-2 rounded bg-slate-950/50 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Type II Error (β)</span>
          <span className="text-sm font-bold font-mono text-purple-400">{(stats.beta * 100).toFixed(1)}%</span>
        </div>
        <div className="p-2 rounded bg-slate-950/50 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Power (1 − β)</span>
          <span className="text-sm font-bold font-mono text-emerald-400">{(stats.power * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
