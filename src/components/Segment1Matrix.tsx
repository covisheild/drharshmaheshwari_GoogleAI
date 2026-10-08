import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export function Segment1Matrix() {
  const [activeCell, setActiveCell] = useState<'alpha' | 'power' | 'confidence' | 'beta' | null>(null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            Section 8.3 Concept
          </span>
          <h3 className="text-lg font-bold text-white mt-1">The 2×2 Decision Matrix</h3>
        </div>
        <p className="text-xs text-slate-400 max-w-xs text-right hidden sm:block">
          Cross the two true states with the two sample decisions to see the four outcomes.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left text-slate-400 font-medium border-b border-slate-800 bg-slate-950/40 w-1/4">
                Decision from Sample
              </th>
              <th className="p-3 text-center border-b border-l border-slate-800 bg-slate-950/40 w-3/8">
                <span className="block text-xs uppercase text-slate-400 tracking-wider">True State</span>
                <span className="font-semibold text-slate-200">Null Hypothesis True (H₀)</span>
                <span className="block text-xs text-slate-500 font-normal">No real effect in reality</span>
              </th>
              <th className="p-3 text-center border-b border-l border-slate-800 bg-slate-950/40 w-3/8">
                <span className="block text-xs uppercase text-slate-400 tracking-wider">True State</span>
                <span className="font-semibold text-emerald-300">Null Hypothesis False (H₁)</span>
                <span className="block text-xs text-slate-500 font-normal">Real effect exists</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1: Reject H0 */}
            <tr>
              <td className="p-3.5 border-b border-slate-800 font-semibold text-amber-300 bg-slate-950/30">
                Reject Null Hypothesis
                <span className="block text-xs text-slate-400 font-normal mt-0.5">
                  Conclude an effect exists
                </span>
              </td>

              {/* Cell: Type I error (alpha) */}
              <td
                onMouseEnter={() => setActiveCell('alpha')}
                onMouseLeave={() => setActiveCell(null)}
                className={`p-4 border-b border-l border-slate-800 transition-all cursor-pointer ${
                  activeCell === 'alpha'
                    ? 'bg-rose-950/50 border-rose-600/50 ring-1 ring-rose-500/50'
                    : 'bg-rose-950/20 hover:bg-rose-950/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-300">Type I Error</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-200 font-mono font-semibold">
                        α (alpha)
                      </span>
                    </div>
                    <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
                      Rejecting H₀ when it is true: concluding there is an effect when there is none (False Positive).
                    </p>
                    <div className="mt-2 text-[11px] text-slate-400">
                      Standard convention: <span className="font-mono text-slate-200">α = 0.05</span> (5% chance).
                    </div>
                  </div>
                </div>
              </td>

              {/* Cell: Correct rejection (Power = 1 - beta) */}
              <td
                onMouseEnter={() => setActiveCell('power')}
                onMouseLeave={() => setActiveCell(null)}
                className={`p-4 border-b border-l border-slate-800 transition-all cursor-pointer ${
                  activeCell === 'power'
                    ? 'bg-emerald-950/50 border-emerald-600/50 ring-1 ring-emerald-500/50'
                    : 'bg-emerald-950/20 hover:bg-emerald-950/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-300">Correct Decision</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 font-mono font-semibold">
                        Power = 1 − β
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                      Rejecting H₀ when it is false: detecting an effect that genuinely exists (True Positive).
                    </p>
                    <div className="mt-2 text-[11px] text-slate-400">
                      Conventional target: <span className="font-mono text-slate-200">80% – 90%</span> power.
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            {/* Row 2: Do Not Reject H0 */}
            <tr>
              <td className="p-3.5 border-b border-slate-800 font-semibold text-slate-300 bg-slate-950/30">
                Do Not Reject Null
                <span className="block text-xs text-slate-400 font-normal mt-0.5">
                  Fail to conclude an effect
                </span>
              </td>

              {/* Cell: Correct acceptance (1 - alpha) */}
              <td
                onMouseEnter={() => setActiveCell('confidence')}
                onMouseLeave={() => setActiveCell(null)}
                className={`p-4 border-b border-l border-slate-800 transition-all cursor-pointer ${
                  activeCell === 'confidence'
                    ? 'bg-slate-800/80 border-slate-600 ring-1 ring-slate-500/50'
                    : 'bg-slate-900/40 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-700/30 text-slate-300 border border-slate-700 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">Correct Decision</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-300 font-mono font-semibold">
                        1 − α
                      </span>
                    </div>
                    <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">
                      Not rejecting H₀ when it is true: accurately recognizing the absence of an effect.
                    </p>
                    <div className="mt-2 text-[11px] text-slate-400">
                      Confidence level: <span className="font-mono text-slate-200">95%</span> when α = 0.05.
                    </div>
                  </div>
                </div>
              </td>

              {/* Cell: Type II error (beta) */}
              <td
                onMouseEnter={() => setActiveCell('beta')}
                onMouseLeave={() => setActiveCell(null)}
                className={`p-4 border-b border-l border-slate-800 transition-all cursor-pointer ${
                  activeCell === 'beta'
                    ? 'bg-amber-950/50 border-amber-600/50 ring-1 ring-amber-500/50'
                    : 'bg-amber-950/20 hover:bg-amber-950/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-300">Type II Error</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-mono font-semibold">
                        β (beta)
                      </span>
                    </div>
                    <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                      Failing to reject H₀ when it is false: missing an effect that exists (False Negative).
                    </p>
                    <div className="mt-2 text-[11px] text-slate-400">
                      Complement of power: <span className="font-mono text-slate-200">β = 1 − Power</span>.
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Clinical Context Footnote */}
      <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Hover over any quadrant to inspect its probability formula and medical consequence.
          </span>
        </div>
        <span className="text-slate-500 font-mono hidden md:inline">Chapter 8 • Section 8.3</span>
      </div>
    </div>
  );
}
