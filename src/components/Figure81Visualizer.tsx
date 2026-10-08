import React, { useState, useMemo, useRef } from 'react';
import { computePower, normalPdf } from '../utils/stats';
import { Sliders, RefreshCw, Info, HelpCircle } from 'lucide-react';

interface Figure81VisualizerProps {
  initialDelta?: number;
  initialSE?: number;
  initialAlpha?: number;
}

export function Figure81Visualizer({
  initialDelta = 1.0,
  initialSE = 0.406,
  initialAlpha = 0.05,
}: Figure81VisualizerProps) {
  const [trueDelta, setTrueDelta] = useState<number>(initialDelta);
  const [se, setSe] = useState<number>(initialSE);
  const [alpha, setAlpha] = useState<number>(initialAlpha);
  const [hoveredX, setHoveredX] = useState<number | null>(null);

  const containerRef = useRef<SVGSVGElement | null>(null);

  // Power and cutoffs computation
  const stats = useMemo(() => {
    return computePower(trueDelta, se, alpha, 2.0);
  }, [trueDelta, se, alpha]);

  // Visual SVG chart dimensions
  const width = 760;
  const height = 340;
  const margin = { top: 30, right: 35, bottom: 50, left: 45 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // X range: covers from -1.6 kg to +2.6 kg to clearly see both curves
  const xMin = -1.5;
  const xMax = 2.5;

  const scaleX = (x: number) => {
    return margin.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
  };

  const invertScaleX = (px: number) => {
    const clampedPx = Math.max(margin.left, Math.min(width - margin.right, px));
    return xMin + ((clampedPx - margin.left) / plotWidth) * (xMax - xMin);
  };

  // Peak height determination
  const maxPdf = Math.max(normalPdf(0, 0, se), normalPdf(trueDelta, trueDelta, se));
  const yMax = maxPdf * 1.15;

  const scaleY = (y: number) => {
    return margin.top + plotHeight - (y / yMax) * plotHeight;
  };

  // Generate curve path points (samples across domain)
  const steps = 180;
  const stepSize = (xMax - xMin) / steps;

  // Path for H0 curve
  const h0Points: { x: number; y: number; val: number }[] = [];
  const h1Points: { x: number; y: number; val: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const xVal = xMin + i * stepSize;
    const yH0 = normalPdf(xVal, 0, se);
    const yH1 = normalPdf(xVal, trueDelta, se);
    h0Points.push({ x: scaleX(xVal), y: scaleY(yH0), val: xVal });
    h1Points.push({ x: scaleX(xVal), y: scaleY(yH1), val: xVal });
  }

  const h0PathD = `M ${h0Points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
  const h1PathD = `M ${h1Points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;

  // Shaded area paths
  // 1. H0 Left Tail (< cutoffLow)
  const h0LeftTailPoints = h0Points.filter(p => p.val <= stats.cutoffLow);
  const h0LeftTailD = h0LeftTailPoints.length > 0
    ? `M ${scaleX(xMin)},${scaleY(0)} L ${h0LeftTailPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} L ${scaleX(stats.cutoffLow)},${scaleY(0)} Z`
    : '';

  // 2. H0 Right Tail (> cutoffHigh)
  const h0RightTailPoints = h0Points.filter(p => p.val >= stats.cutoffHigh);
  const h0RightTailD = h0RightTailPoints.length > 0
    ? `M ${scaleX(stats.cutoffHigh)},${scaleY(0)} L ${h0RightTailPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} L ${scaleX(xMax)},${scaleY(0)} Z`
    : '';

  // 3. H1 Beta Area (between cutoffLow and cutoffHigh)
  const h1BetaPoints = h1Points.filter(p => p.val >= stats.cutoffLow && p.val <= stats.cutoffHigh);
  const h1BetaD = h1BetaPoints.length > 0
    ? `M ${scaleX(stats.cutoffLow)},${scaleY(0)} L ${h1BetaPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} L ${scaleX(stats.cutoffHigh)},${scaleY(0)} Z`
    : '';

  // 4. H1 Power Area (> cutoffHigh)
  const h1PowerPoints = h1Points.filter(p => p.val >= stats.cutoffHigh);
  const h1PowerD = h1PowerPoints.length > 0
    ? `M ${scaleX(stats.cutoffHigh)},${scaleY(0)} L ${h1PowerPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} L ${scaleX(xMax)},${scaleY(0)} Z`
    : '';

  // Ticks on X axis
  const xTicks = [-1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0, 2.5];

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    setHoveredX(invertScaleX(svgX));
  };

  const resetToFigureDefaults = () => {
    setTrueDelta(1.0);
    setSe(0.406);
    setAlpha(0.05);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl text-slate-100">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-400 bg-sky-950/70 border border-sky-800/60 px-2 py-0.5 rounded">
              Figure 8.1 Interactive Model
            </span>
            <span className="text-xs text-slate-400 font-mono">
              SE = {se.toFixed(3)} kg • Δ = {trueDelta.toFixed(2)} kg
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Sampling Distributions: Null vs. Alternative Hypothesis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Urban–rural difference in mean weight (Chapter 7 example). Cut-offs at ±{stats.cutoffHigh.toFixed(2)} kg (±1.96 × SE).
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={resetToFigureDefaults}
            className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition"
            title="Reset to Figure 8.1 values (Δ = 1.0 kg, SE = 0.406 kg)"
          >
            <RefreshCw className="w-3 h-3 text-sky-400" />
            Fig 8.1 Default
          </button>
          <button
            onClick={() => { setTrueDelta(0.5); setSe(0.406); setAlpha(0.05); }}
            className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            Δ = 0.5 kg (Power 23%)
          </button>
          <button
            onClick={() => { setTrueDelta(1.0); setSe(0.287); setAlpha(0.05); }}
            className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            Double n (Power 94%)
          </button>
          <button
            onClick={() => { setTrueDelta(1.0); setSe(0.406); setAlpha(0.01); }}
            className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            α = 0.01 (Power 46%)
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative mt-4 bg-slate-950/70 rounded-lg p-2 border border-slate-800/80 overflow-hidden">
        <svg
          ref={containerRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredX(null)}
        >
          {/* Grid lines */}
          {xTicks.map(tick => (
            <g key={tick}>
              <line
                x1={scaleX(tick)}
                y1={margin.top}
                x2={scaleX(tick)}
                y2={margin.top + plotHeight}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={scaleX(tick)}
                y={margin.top + plotHeight + 18}
                fill="#64748b"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
              >
                {tick >= 0 ? tick.toFixed(1) : tick.toFixed(1)}
              </text>
            </g>
          ))}

          {/* X Axis baseline */}
          <line
            x1={margin.left}
            y1={scaleY(0)}
            x2={width - margin.right}
            y2={scaleY(0)}
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Shaded Areas */}
          {/* 1. Type I Error Tails under H0 (alpha/2 each = 0.025) */}
          {h0LeftTailD && (
            <path
              d={h0LeftTailD}
              fill="rgba(239, 68, 68, 0.35)"
              stroke="none"
            />
          )}
          {h0RightTailD && (
            <path
              d={h0RightTailD}
              fill="rgba(239, 68, 68, 0.35)"
              stroke="none"
            />
          )}

          {/* 2. Type II Error Area under H1 (beta) */}
          {h1BetaD && (
            <path
              d={h1BetaD}
              fill="rgba(168, 85, 247, 0.40)"
              stroke="none"
            />
          )}

          {/* 3. Statistical Power Area under H1 (1 - beta) */}
          {h1PowerD && (
            <path
              d={h1PowerD}
              fill="rgba(16, 185, 129, 0.42)"
              stroke="none"
            />
          )}

          {/* Curve 1: Null Distribution H0 */}
          <path
            d={h0PathD}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
          />

          {/* Curve 2: Alternative Distribution H1 */}
          <path
            d={h1PathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
          />

          {/* Center markers */}
          {/* H0 Mean = 0 */}
          <line
            x1={scaleX(0)}
            y1={scaleY(0)}
            x2={scaleX(0)}
            y2={scaleY(normalPdf(0, 0, se))}
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <text
            x={scaleX(0)}
            y={scaleY(normalPdf(0, 0, se)) - 8}
            fill="#cbd5e1"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            H₀: Difference = 0 kg
          </text>

          {/* H1 Mean = trueDelta */}
          <line
            x1={scaleX(trueDelta)}
            y1={scaleY(0)}
            x2={scaleX(trueDelta)}
            y2={scaleY(normalPdf(trueDelta, trueDelta, se))}
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <text
            x={scaleX(trueDelta)}
            y={scaleY(normalPdf(trueDelta, trueDelta, se)) - 8}
            fill="#38bdf8"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            H₁: True diff = {trueDelta.toFixed(2)} kg
          </text>

          {/* Cut-off vertical lines (±1.96 * SE = ±0.80 kg) */}
          <g>
            {/* Cutoff Low */}
            <line
              x1={scaleX(stats.cutoffLow)}
              y1={margin.top + 10}
              x2={scaleX(stats.cutoffLow)}
              y2={scaleY(0)}
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="5 3"
            />
            <text
              x={scaleX(stats.cutoffLow) - 4}
              y={margin.top + 22}
              fill="#fbbf24"
              fontSize="10"
              fontWeight="bold"
              textAnchor="end"
            >
              -{stats.cutoffHigh.toFixed(2)} kg
            </text>

            {/* Cutoff High */}
            <line
              x1={scaleX(stats.cutoffHigh)}
              y1={margin.top + 10}
              x2={scaleX(stats.cutoffHigh)}
              y2={scaleY(0)}
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="5 3"
            />
            <text
              x={scaleX(stats.cutoffHigh) + 4}
              y={margin.top + 22}
              fill="#fbbf24"
              fontSize="10"
              fontWeight="bold"
              textAnchor="start"
            >
              +{stats.cutoffHigh.toFixed(2)} kg
            </text>
          </g>

          {/* Interactive Inspection Cursor */}
          {hoveredX !== null && (
            <g>
              <line
                x1={scaleX(hoveredX)}
                y1={margin.top}
                x2={scaleX(hoveredX)}
                y2={scaleY(0)}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle
                cx={scaleX(hoveredX)}
                cy={scaleY(0)}
                r="4.5"
                fill="#ffffff"
              />
              <rect
                x={Math.min(width - 165, Math.max(margin.left + 5, scaleX(hoveredX) - 75))}
                y={margin.top + 35}
                width="150"
                height="45"
                rx="6"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1"
              />
              <text
                x={Math.min(width - 165, Math.max(margin.left + 5, scaleX(hoveredX) - 75)) + 75}
                y={margin.top + 52}
                fill="#f8fafc"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                Sample: {hoveredX.toFixed(2)} kg
              </text>
              <text
                x={Math.min(width - 165, Math.max(margin.left + 5, scaleX(hoveredX) - 75)) + 75}
                y={margin.top + 68}
                fill={Math.abs(hoveredX) >= stats.cutoffHigh ? '#34d399' : '#fbbf24'}
                fontSize="10"
                textAnchor="middle"
              >
                {Math.abs(hoveredX) >= stats.cutoffHigh ? 'Decision: Reject H₀' : 'Decision: Do Not Reject'}
              </text>
            </g>
          )}

          {/* X Axis Label */}
          <text
            x={width / 2}
            y={height - 10}
            fill="#94a3b8"
            fontSize="11"
            textAnchor="middle"
          >
            Observed Difference in Mean Weight (kg)
          </text>
        </svg>

        {/* Legend Overlay */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900/80 border border-slate-800">
            <span className="w-3.5 h-3.5 rounded bg-red-500/40 border border-red-500/70 shrink-0" />
            <div>
              <span className="font-semibold text-rose-300">Type I Error (α)</span>
              <p className="text-[10px] text-slate-400">{(alpha * 100).toFixed(1)}% total ({(alpha * 50).toFixed(1)}% each tail)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900/80 border border-slate-800">
            <span className="w-3.5 h-3.5 rounded bg-purple-500/40 border border-purple-500/70 shrink-0" />
            <div>
              <span className="font-semibold text-purple-300">Type II Error (β)</span>
              <p className="text-[10px] text-slate-400 font-mono">β = {stats.beta.toFixed(2)} ({(stats.beta * 100).toFixed(0)}%)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900/80 border border-slate-800">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/40 border border-emerald-500/70 shrink-0" />
            <div>
              <span className="font-semibold text-emerald-300">Power (1 − β)</span>
              <p className="text-[10px] text-emerald-400 font-mono">Power = {stats.power.toFixed(2)} ({(stats.power * 100).toFixed(0)}%)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded bg-slate-900/80 border border-slate-800">
            <span className="w-3.5 h-3.5 rounded bg-amber-500/30 border border-amber-500/70 shrink-0" />
            <div>
              <span className="font-semibold text-amber-300">Cut-offs</span>
              <p className="text-[10px] text-slate-400 font-mono">±{stats.cutoffHigh.toFixed(2)} kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Levers */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
        {/* Lever 1: True Effect Size (Delta) */}
        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-300">True Effect Size (Δ)</span>
            <span className="font-mono text-sky-400 font-bold">{trueDelta.toFixed(2)} kg</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.05"
            value={trueDelta}
            onChange={(e) => setTrueDelta(parseFloat(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0.2 kg (Small)</span>
            <span>1.0 kg (Urban-Rural)</span>
            <span>2.0 kg</span>
          </div>
        </div>

        {/* Lever 2: Standard Error (SE) */}
        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-300">Standard Error (SE)</span>
            <span className="font-mono text-emerald-400 font-bold">{se.toFixed(3)} kg</span>
          </div>
          <input
            type="range"
            min="0.15"
            max="0.65"
            step="0.01"
            value={se}
            onChange={(e) => setSe(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0.15 kg (Large n)</span>
            <span>0.406 kg (Chapter 7)</span>
            <span>0.65 kg (Small n)</span>
          </div>
        </div>

        {/* Lever 3: Significance Level (Alpha) */}
        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-300">Significance Level (α)</span>
            <span className="font-mono text-rose-400 font-bold">{alpha.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.10"
            step="0.01"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0.01 (Strict)</span>
            <span>0.05 (Default)</span>
            <span>0.10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
