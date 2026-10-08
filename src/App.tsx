import React, { useState } from 'react';
import { useNarrator } from './hooks/useNarrator';
import { NarratorControlBar } from './components/NarratorControlBar';
import { TranscriptReader } from './components/TranscriptReader';
import { Segment1Matrix } from './components/Segment1Matrix';
import { Figure81Visualizer } from './components/Figure81Visualizer';
import { Segment3DrugTradeoff } from './components/Segment3DrugTradeoff';
import { Segment4EffectSize } from './components/Segment4EffectSize';
import { Segment5PowerScenarios } from './components/Segment5PowerScenarios';
import { Segment6PostHocFallacy } from './components/Segment6PostHocFallacy';
import { SEGMENTS } from './data/segments';
import {
  BookOpen,
  LineChart,
  Layers,
  HelpCircle,
  ExternalLink,
  Volume2,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  const narrator = useNarrator();
  const [selectedTab, setSelectedTab] = useState<'sync' | 'fig81' | 'planning' | 'fallacy'>('sync');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  // Render the visual component that corresponds to the active segment
  const renderVisualForSegment = (segmentId: number) => {
    switch (segmentId) {
      case 1:
        return <Segment1Matrix />;
      case 2:
        return <Figure81Visualizer />;
      case 3:
        return <Segment3DrugTradeoff />;
      case 4:
        return <Segment4EffectSize />;
      case 5:
        return <Segment5PowerScenarios />;
      case 6:
        return <Segment6PostHocFallacy />;
      default:
        return <Figure81Visualizer />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-md">
              <BookOpen className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Type One &amp; Type Two Error
                </h1>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Sections 8.3 &amp; 8.4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verbatim Audio Reader &amp; Interactive Figure 8.1 Sampling Distributions
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto text-xs">
            <button
              onClick={() => setSelectedTab('sync')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                selectedTab === 'sync'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Read &amp; Listen (Split View)</span>
            </button>

            <button
              onClick={() => setSelectedTab('fig81')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                selectedTab === 'fig81'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Figure 8.1 Studio</span>
            </button>

            <button
              onClick={() => setSelectedTab('planning')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                selectedTab === 'planning'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Power &amp; Planning</span>
            </button>

            <button
              onClick={() => setSelectedTab('fallacy')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                selectedTab === 'fallacy'
                  ? 'bg-rose-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Post-Hoc Fallacy</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Narrator Control Header */}
        <NarratorControlBar
          isPlaying={narrator.isPlaying}
          isPaused={narrator.isPaused}
          currentSegmentId={narrator.currentSegmentId}
          currentParagraphIndex={narrator.currentParagraphIndex}
          rate={narrator.rate}
          setRate={narrator.setRate}
          pauseBetweenParagraphsMs={narrator.pauseBetweenParagraphsMs}
          setPauseBetweenParagraphsMs={narrator.setPauseBetweenParagraphsMs}
          availableVoices={narrator.availableVoices}
          selectedVoiceURI={narrator.selectedVoiceURI}
          setSelectedVoiceURI={narrator.setSelectedVoiceURI}
          isWaitingPause={narrator.isWaitingPause}
          autoAdvance={narrator.autoAdvance}
          setAutoAdvance={narrator.setAutoAdvance}
          onPlay={narrator.play}
          onPause={narrator.pause}
          onStop={narrator.stop}
          onNext={narrator.nextParagraph}
          onPrev={narrator.previousParagraph}
          onSelectSegment={(segId) => narrator.jumpTo(segId, 0)}
        />

        {/* Tab 1: Synchronized Split View */}
        {selectedTab === 'sync' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Verbatim Transcript Reader */}
            <div className="lg:col-span-6 xl:col-span-5 h-full">
              <TranscriptReader
                currentSegmentId={narrator.currentSegmentId}
                currentParagraphIndex={narrator.currentParagraphIndex}
                isPlaying={narrator.isPlaying}
                onPlayParagraph={(segId, pIdx) => narrator.jumpTo(segId, pIdx)}
                onSelectSegment={(segId) => narrator.jumpTo(segId, 0)}
                fontSize={fontSize}
                setFontSize={setFontSize}
              />
            </div>

            {/* Right Column: Dynamic Companion Visualization synced with Narrator */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-4">
              {/* Context bar indicating active segment companion */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-400 font-medium">Companion Visual for Segment {narrator.currentSegmentId}:</span>
                  <span className="font-semibold text-white">
                    {SEGMENTS.find(s => s.id === narrator.currentSegmentId)?.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">Switch Segment:</span>
                  <div className="flex items-center gap-1">
                    {SEGMENTS.map(s => (
                      <button
                        key={s.id}
                        onClick={() => narrator.jumpTo(s.id, 0)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                          narrator.currentSegmentId === s.id
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {s.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Render dynamic segment component */}
              {renderVisualForSegment(narrator.currentSegmentId)}
            </div>
          </div>
        )}

        {/* Tab 2: Full Width Figure 8.1 Studio */}
        {selectedTab === 'fig81' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-sky-400" />
                <span className="text-slate-300">
                  Figure 8.1 displays sampling distributions under <strong className="text-white">H₀ (mean = 0)</strong> and <strong className="text-white">H₁ (mean = 1 kg)</strong> with standard error <strong className="text-white">0.406 kg</strong>.
                </span>
              </div>
              <button
                onClick={() => narrator.jumpTo(2, 0)}
                className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center gap-1.5 transition shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Segment 2 Narration</span>
              </button>
            </div>

            <Figure81Visualizer />
          </div>
        )}

        {/* Tab 3: Power & Sample Size Planning */}
        {selectedTab === 'planning' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">
                  Explore how <strong className="text-white">n, α, effect size Δ, and variability</strong> govern statistical power. Test the 63/64 sample size benchmark.
                </span>
              </div>
              <button
                onClick={() => narrator.jumpTo(5, 0)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Segment 5 Narration</span>
              </button>
            </div>

            <Segment5PowerScenarios />
            <Segment4EffectSize />
          </div>
        )}

        {/* Tab 4: Post-Hoc Fallacy & Inconclusive Studies */}
        {selectedTab === 'fallacy' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                <span className="text-slate-300">
                  Why observed (post-hoc) power is circular and provides zero new information beyond the p-value.
                </span>
              </div>
              <button
                onClick={() => narrator.jumpTo(6, 0)}
                className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold flex items-center gap-1.5 transition shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Segment 6 Narration</span>
              </button>
            </div>

            <Segment6PostHocFallacy />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Medical Statistics Educational Suite • Sections 8.3 &amp; 8.4</span>
          <span className="font-mono text-slate-400">Verbatim Speech Engine • Calm Delivery • 650ms Paragraph Breaks</span>
        </div>
      </footer>
    </div>
  );
}
