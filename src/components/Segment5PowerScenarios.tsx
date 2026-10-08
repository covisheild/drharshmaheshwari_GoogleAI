import React, { useState } from 'react';
import { Sparkles, Calculator, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';
import { computeRequiredSampleSize, computePower } from '../utils/stats';

export function Segment5PowerScenarios() {
  // Scenario state
  const [activeScenario, setActiveScenario] = useState<'urban-1kg' | 'half-effect' | 'double-n' | 'tight-alpha' | 'custom'>('urban-1kg');

  // Planning calculator state
  const [planDelta, setPlanDelta] = useState<number>(1.0);
  const [planSD, setPlanSD] = useState<number>(2.0);
  const [planTargetPower, setPlanTargetPower] = useState<number>(0.80);
  const [planAlpha, setPlanAlpha] = useState<number>(0.05);

  const sampleSizePlan = computeRequiredSampleSize(planDelta, planSD, planAlpha, planTargetPower);

  // Scenarios presets from the book text
  const scenarios = [
    {
      id: 'urban-1kg',
      name: 'Original Urban–Rural (1.0 kg)',
      desc: 'Raw effect = 1.0 kg, d = 0.53, α = 0.05',
      delta: 1.0,
      se: 0.406,
      alpha: 0.05,
      expectedPower: '0.69 (69%)',
      textNote: 'The baseline study from Chapter 7.',
    },
    {
      id: 'half-effect',
      name: 'Half Effect (0.5 kg)',
      desc: 'Smaller difference = 0.5 kg, α = 0.05',
      delta: 0.5,
      se: 0.406,
      alpha: 0.05,
      expectedPower: '0.23 (23%)',
      textNote: 'Misses a half-kilogram difference more than 3 times in 4 (β = 77%).',
    },
    {
      id: 'double-n',
      name: 'Doubled Groups (2 × n)',
      desc: 'SE falls to 0.287 kg, α = 0.05',
      delta: 1.0,
      se: 0.287,
      alpha: 0.05,
      expectedPower: '0.94 (94%)',
      textNote: 'Doubling both groups raises power dramatically to 94%.',
    },
    {
      id: 'tight-alpha',
      name: 'Tightened Alpha (α = 0.01)',
      desc: 'Original groups, but α = 0.01',
      delta: 1.0,
      se: 0.406,
      alpha: 0.01,
      expectedPower: '0.46 (46%)',
      textNote: 'Lowering α widens cutoffs, cutting power down to 46%.',
    },
  ];

  const currentScenarioObj = scenarios.find(s => s.id === activeScenario) || scenarios[0];
  const computedStats = computePower(currentScenarioObj.delta, currentScenarioObj.se, currentScenarioObj.alpha);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded">
            Section 8.4 Case Scenarios
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            The 4 Levers of Power & Sample Size Planning
          </h3>
        </div>
        <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
          <BarChart2 className="w-5 h-5" />
        </div>
      </div>

      {/* The Four Things Power Depends On */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">1. Sample Size (n)</span>
          <span className="text-xs font-semibold text-emerald-400">Larger n raises power</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">2. Significance (α)</span>
          <span className="text-xs font-semibold text-rose-400">Larger α raises power</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">3. Effect Size (Δ)</span>
          <span className="text-xs font-semibold text-sky-400">Larger Δ raises power</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">4. Variability (SD)</span>
          <span className="text-xs font-semibold text-amber-400">Smaller SD raises power</span>
        </div>
      </div>

      {/* Urban-Rural Text Presets */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-300 block mb-2">
          Compare the 4 Textbook Scenarios from Paragraph 1:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {scenarios.map(sc => (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc.id as any)}
              className={`p-3 rounded-lg text-left transition border ${
                activeScenario === sc.id
                  ? 'bg-sky-950/60 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                  : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="text-xs font-bold text-white">{sc.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{sc.desc}</div>
              <div className="mt-2 text-xs font-mono font-bold text-emerald-400">
                Power: {sc.expectedPower}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Scenario Callout */}
        <div className="mt-3 p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-300">
            <strong className="text-sky-400">{currentScenarioObj.name}: </strong>
            {currentScenarioObj.textNote}
          </div>
          <div className="text-right font-mono text-[11px] text-slate-400 hidden sm:block">
            Beta = {(computedStats.beta * 100).toFixed(0)}% • Cut-off = ±{computedStats.cutoffHigh.toFixed(2)} kg
          </div>
        </div>
      </div>

      {/* 80% Power Convention & Study Planning Calculator */}
      <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Calculator className="w-4 h-4" />
            <span>Study Planning: Cohen (1992) & ICH E9 80% Power Rule</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            n per group = 2 × (z_α/2 + z_β)² × (σ/Δ)²
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Standard Deviation (σ):</span>
              <span className="font-mono text-white font-bold">{planSD.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.2"
              value={planSD}
              onChange={(e) => setPlanSD(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Difference to Detect (Δ):</span>
              <span className="font-mono text-white font-bold">{planDelta.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={planDelta}
              onChange={(e) => setPlanDelta(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Target Power:</span>
              <span className="font-mono text-white font-bold">{(planTargetPower * 100).toFixed(0)}%</span>
            </div>
            <select
              value={planTargetPower}
              onChange={(e) => setPlanTargetPower(parseFloat(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-xs rounded p-1.5 text-slate-200"
            >
              <option value="0.80">80% Power (Cohen 1992 Benchmark)</option>
              <option value="0.85">85% Power</option>
              <option value="0.90">90% Power (ICH E9 Upper Target)</option>
              <option value="0.95">95% Power</option>
            </select>
          </div>
        </div>

        {/* Calculated Result Box */}
        <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-emerald-200 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sample Size Required per Group:</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 mt-0.5">
              Formula: <strong className="text-white">{sampleSizePlan.normalFormulaN} children</strong> per group (normal formula) • <strong className="text-white">{sampleSizePlan.exactSoftwareN} children</strong> (exact software).
            </p>
          </div>

          <button
            onClick={() => { setPlanSD(2.0); setPlanDelta(1.0); setPlanTargetPower(0.80); setPlanAlpha(0.05); }}
            className="px-3 py-1.5 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shrink-0"
          >
            Reset to 63 / 64 Children Example
          </button>
        </div>
      </div>
    </div>
  );
}
