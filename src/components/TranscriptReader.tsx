import React, { useEffect, useRef } from 'react';
import { SEGMENTS } from '../data/segments';
import { Play, Volume2, Bookmark, CheckCircle, Type } from 'lucide-react';

interface TranscriptReaderProps {
  currentSegmentId: number;
  currentParagraphIndex: number;
  isPlaying: boolean;
  onPlayParagraph: (segmentId: number, paragraphIndex: number) => void;
  onSelectSegment: (segmentId: number) => void;
  fontSize: 'normal' | 'large';
  setFontSize: (size: 'normal' | 'large') => void;
}

export function TranscriptReader({
  currentSegmentId,
  currentParagraphIndex,
  isPlaying,
  onPlayParagraph,
  onSelectSegment,
  fontSize,
  setFontSize,
}: TranscriptReaderProps) {
  const activeParagraphRef = useRef<HTMLDivElement | null>(null);

  // Smooth scroll to active paragraph when it changes and playing
  useEffect(() => {
    if (isPlaying && activeParagraphRef.current) {
      activeParagraphRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentSegmentId, currentParagraphIndex, isPlaying]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-full text-slate-100">
      {/* Reader Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            Verbatim Transcript (Sections 8.3 &amp; 8.4)
          </h2>
        </div>

        {/* Font size toggle */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <Type className="w-3.5 h-3.5 text-slate-400 ml-1" />
          <button
            onClick={() => setFontSize('normal')}
            className={`px-2 py-0.5 text-xs rounded transition ${
              fontSize === 'normal'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-2 py-0.5 text-xs rounded transition ${
              fontSize === 'large'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Large
          </button>
        </div>
      </div>

      {/* Reader Body / Scroll Area */}
      <div className="mt-4 overflow-y-auto space-y-8 pr-2 flex-1 max-h-[700px] scrollbar-thin scrollbar-thumb-slate-800">
        {SEGMENTS.map(segment => {
          const isSegmentActive = segment.id === currentSegmentId;

          return (
            <article
              key={segment.id}
              className={`p-4 rounded-xl transition-all border ${
                isSegmentActive
                  ? 'bg-slate-950/70 border-emerald-500/40 shadow-lg ring-1 ring-emerald-500/20'
                  : 'bg-slate-950/20 border-slate-800/60 hover:border-slate-700'
              }`}
            >
              {/* Segment Header */}
              <div className="flex items-start justify-between pb-3 mb-3 border-b border-slate-800/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Segment {segment.id}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {segment.subtitle}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {segment.title}
                  </h3>
                </div>

                <button
                  onClick={() => onPlayParagraph(segment.id, 0)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-700 flex items-center gap-1.5 transition shrink-0"
                  title="Read this segment"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play Seg {segment.id}</span>
                </button>
              </div>

              {/* Paragraphs in Segment */}
              <div className="space-y-3.5">
                {segment.paragraphs.map((para, pIdx) => {
                  const isParaActive = isSegmentActive && pIdx === currentParagraphIndex;

                  return (
                    <div
                      key={para.id}
                      ref={isParaActive ? activeParagraphRef : null}
                      onClick={() => onPlayParagraph(segment.id, pIdx)}
                      className={`group relative p-3 rounded-lg cursor-pointer transition-all border ${
                        isParaActive
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-md'
                          : 'bg-transparent border-transparent text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                      }`}
                    >
                      {/* Active Reader Indicator */}
                      {isParaActive && (
                        <div className="absolute -left-1 top-3 bottom-3 w-1 bg-emerald-400 rounded-full" />
                      )}

                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayParagraph(segment.id, pIdx);
                          }}
                          className={`mt-1 p-1 rounded-md opacity-0 group-hover:opacity-100 transition shrink-0 ${
                            isParaActive
                              ? 'opacity-100 bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white'
                          }`}
                          title="Read from this paragraph"
                        >
                          <Play className="w-3 h-3 fill-current" />
                        </button>

                        <p
                          className={`leading-relaxed ${
                            fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                          } ${isParaActive ? 'font-medium text-emerald-50' : 'text-slate-300'}`}
                        >
                          {para.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
