import React from 'react';
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  Clock,
  Gauge,
  Sparkles,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { SEGMENTS } from '../data/segments';

interface NarratorControlBarProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentSegmentId: number;
  currentParagraphIndex: number;
  rate: number;
  setRate: (rate: number) => void;
  pauseBetweenParagraphsMs: number;
  setPauseBetweenParagraphsMs: (ms: number) => void;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceURI: string | null;
  setSelectedVoiceURI: (uri: string) => void;
  isWaitingPause: boolean;
  autoAdvance: boolean;
  setAutoAdvance: (advance: boolean) => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectSegment: (segId: number) => void;
}

export function NarratorControlBar({
  isPlaying,
  isPaused,
  currentSegmentId,
  currentParagraphIndex,
  rate,
  setRate,
  pauseBetweenParagraphsMs,
  setPauseBetweenParagraphsMs,
  availableVoices,
  selectedVoiceURI,
  setSelectedVoiceURI,
  isWaitingPause,
  autoAdvance,
  setAutoAdvance,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrev,
  onSelectSegment,
}: NarratorControlBarProps) {
  const currentSeg = SEGMENTS.find(s => s.id === currentSegmentId) || SEGMENTS[0];
  const totalParagraphsInSeg = currentSeg.paragraphs.length;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl text-slate-100">
      {/* Top Banner: Exact Narrative Style Guarantee */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Verbatim Professional Audio Narrator
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Read exactly as written
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Calm, clear delivery • Moderate pace ({rate}x) • Brief pause ({pauseBetweenParagraphsMs}ms) at paragraph breaks
            </p>
          </div>
        </div>

        {/* Live Audio State Indicator */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isPlaying && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-mono">
              {isWaitingPause ? (
                <span className="flex items-center gap-1.5 animate-pulse text-amber-300">
                  <Clock className="w-3 h-3" />
                  <span>Pause break...</span>
                </span>
              ) : (
                <>
                  <div className="flex items-end gap-0.5 h-3.5">
                    <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-2" />
                    <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-3.5 delay-75" />
                    <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-1.5 delay-150" />
                    <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-3 delay-100" />
                  </div>
                  <span>Narrating</span>
                </>
              )}
            </div>
          )}

          {isPaused && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 font-mono">
              Paused
            </span>
          )}

          {!isPlaying && !isPaused && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono">
              Ready to Play
            </span>
          )}
        </div>
      </div>

      {/* Main Controls & Segment Navigator */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onPrev}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700"
            title="Previous paragraph"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {!isPlaying ? (
            <button
              onClick={onPlay}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isPaused ? 'Resume Narration' : 'Start Reading'}</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={onStop}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700"
            title="Stop narration"
          >
            <Square className="w-4 h-4" />
          </button>

          <button
            onClick={onNext}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700"
            title="Next paragraph"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Current Segment Breadcrumb */}
        <div className="text-center md:text-left flex-1 px-2">
          <div className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-2">
            <span className="font-semibold text-emerald-400">Segment {currentSegmentId} of {SEGMENTS.length}</span>
            <span>•</span>
            <span>Paragraph {currentParagraphIndex + 1} of {totalParagraphsInSeg}</span>
          </div>
          <div className="text-sm font-semibold text-white truncate max-w-md mt-0.5">
            {currentSeg.title}
          </div>
        </div>

        {/* Segment Quick Buttons */}
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {SEGMENTS.map(s => (
            <button
              key={s.id}
              onClick={() => onSelectSegment(s.id)}
              className={`w-7 h-7 text-xs font-mono font-bold rounded-lg transition ${
                currentSegmentId === s.id
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
              title={`Jump to ${s.title}`}
            >
              {s.id}
            </button>
          ))}
        </div>
      </div>

      {/* Voice, Pace & Pause Controls */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Voice Selector */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 text-[11px] whitespace-nowrap">Voice:</span>
          <select
            value={selectedVoiceURI || ''}
            onChange={(e) => setSelectedVoiceURI(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-200 text-xs truncate focus:outline-none focus:border-emerald-500"
          >
            {availableVoices.map(v => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Moderate Pace (Rate) */}
        <div className="flex items-center gap-2">
          <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 text-[11px] whitespace-nowrap">Pace:</span>
          <div className="flex items-center gap-1 w-full">
            {[0.8, 0.92, 1.0, 1.15].map(r => (
              <button
                key={r}
                onClick={() => setRate(r)}
                className={`flex-1 py-1 px-1 rounded text-center font-mono text-[11px] transition ${
                  Math.abs(rate - r) < 0.02
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === 0.92 ? '0.9x (Calm)' : `${r}x`}
              </button>
            ))}
          </div>
        </div>

        {/* Paragraph Pause Duration */}
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 text-[11px] whitespace-nowrap">Break:</span>
          <div className="flex items-center gap-1 w-full">
            {[
              { ms: 350, label: '350ms' },
              { ms: 650, label: '650ms (Calm)' },
              { ms: 1000, label: '1000ms' },
            ].map(item => (
              <button
                key={item.ms}
                onClick={() => setPauseBetweenParagraphsMs(item.ms)}
                className={`flex-1 py-1 px-1 rounded text-center font-mono text-[11px] transition ${
                  pauseBetweenParagraphsMs === item.ms
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
