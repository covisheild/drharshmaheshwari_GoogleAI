import { useState, useEffect, useRef, useCallback } from 'react';
import { SEGMENTS, Segment, Paragraph } from '../data/segments';

export interface NarratorState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSegmentId: number;
  currentParagraphIndex: number;
  rate: number;
  pauseBetweenParagraphsMs: number;
  selectedVoiceURI: string | null;
  availableVoices: SpeechSynthesisVoice[];
  isWaitingPause: boolean;
  autoAdvance: boolean;
}

export function useNarrator() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentSegmentId, setCurrentSegmentId] = useState<number>(1);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);
  const [rate, setRate] = useState<number>(0.92); // Calm, moderate pace default
  const [pauseBetweenParagraphsMs, setPauseBetweenParagraphsMs] = useState<number>(650); // Brief pause at paragraph breaks
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
  const [isWaitingPause, setIsWaitingPause] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  // References to keep track across async speech synthesis events
  const stateRef = useRef({
    isPlaying: false,
    isPaused: false,
    currentSegmentId: 1,
    currentParagraphIndex: 0,
    rate: 0.92,
    pauseBetweenParagraphsMs: 650,
    selectedVoiceURI: null as string | null,
    autoAdvance: true,
  });

  stateRef.current = {
    isPlaying,
    isPaused,
    currentSegmentId,
    currentParagraphIndex,
    rate,
    pauseBetweenParagraphsMs,
    selectedVoiceURI,
    autoAdvance,
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load and rank available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;

    const updateVoices = () => {
      const voices = synth.getVoices();
      if (!voices || voices.length === 0) return;

      // Filter for English voices first, then rank by calm/natural professional timbre
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      const sortedVoices = englishVoices.length > 0 ? englishVoices : voices;

      // Preferred calm professional narrators
      const preferredKeywords = ['natural', 'google us english', 'samantha', 'karen', 'daniel', 'serena', 'moira', 'oliver', 'arthur'];
      const bestMatch = sortedVoices.find(v => {
        const nameLower = v.name.toLowerCase();
        return preferredKeywords.some(kw => nameLower.includes(kw));
      }) || sortedVoices[0];

      setAvailableVoices(sortedVoices);
      if (!selectedVoiceURI && bestMatch) {
        setSelectedVoiceURI(bestMatch.voiceURI);
      }
    };

    updateVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = updateVoices;
    }

    return () => {
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = null;
      }
      synth.cancel();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsWaitingPause(false);
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const speakParagraph = useCallback((segmentId: number, paraIdx: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;

    // Clear prior utterances and timeouts
    synth.cancel();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const currentSegment = SEGMENTS.find(s => s.id === segmentId);
    if (!currentSegment || paraIdx >= currentSegment.paragraphs.length) {
      // Check if we should advance to the next segment
      if (stateRef.current.autoAdvance && segmentId < SEGMENTS.length) {
        const nextSegId = segmentId + 1;
        setCurrentSegmentId(nextSegId);
        setCurrentParagraphIndex(0);
        setIsWaitingPause(true);
        timerRef.current = setTimeout(() => {
          setIsWaitingPause(false);
          speakParagraph(nextSegId, 0);
        }, stateRef.current.pauseBetweenParagraphsMs + 400);
        return;
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        return;
      }
    }

    const paragraph = currentSegment.paragraphs[paraIdx];
    setCurrentSegmentId(segmentId);
    setCurrentParagraphIndex(paraIdx);
    setIsPlaying(true);
    setIsPaused(false);
    setIsWaitingPause(false);

    // EXACT TEXT AS WRITTEN: No added words
    const utterance = new SpeechSynthesisUtterance(paragraph.text);
    utterance.rate = stateRef.current.rate;
    utterance.pitch = 1.0;

    // Pick selected voice
    if (stateRef.current.selectedVoiceURI) {
      const selectedVoice = synth.getVoices().find(v => v.voiceURI === stateRef.current.selectedVoiceURI);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => {
      // Paragraph finished: calm brief pause before next paragraph
      const nextIdx = paraIdx + 1;
      const isLastInSegment = nextIdx >= currentSegment.paragraphs.length;

      if (!stateRef.current.isPlaying) return;

      setIsWaitingPause(true);

      const pauseDuration = stateRef.current.pauseBetweenParagraphsMs;
      timerRef.current = setTimeout(() => {
        setIsWaitingPause(false);
        if (stateRef.current.isPlaying) {
          if (!isLastInSegment) {
            speakParagraph(segmentId, nextIdx);
          } else if (stateRef.current.autoAdvance && segmentId < SEGMENTS.length) {
            speakParagraph(segmentId + 1, 0);
          } else {
            setIsPlaying(false);
            setIsPaused(false);
          }
        }
      }, pauseDuration);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis notice:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  }, []);

  const play = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      speakParagraph(currentSegmentId, currentParagraphIndex);
    }
  }, [isPaused, currentSegmentId, currentParagraphIndex, speakParagraph]);

  const pause = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const jumpTo = useCallback((segmentId: number, paraIdx = 0) => {
    setCurrentSegmentId(segmentId);
    setCurrentParagraphIndex(paraIdx);
    speakParagraph(segmentId, paraIdx);
  }, [speakParagraph]);

  const nextParagraph = useCallback(() => {
    const curSeg = SEGMENTS.find(s => s.id === currentSegmentId);
    if (!curSeg) return;

    if (currentParagraphIndex < curSeg.paragraphs.length - 1) {
      jumpTo(currentSegmentId, currentParagraphIndex + 1);
    } else if (currentSegmentId < SEGMENTS.length) {
      jumpTo(currentSegmentId + 1, 0);
    }
  }, [currentSegmentId, currentParagraphIndex, jumpTo]);

  const previousParagraph = useCallback(() => {
    if (currentParagraphIndex > 0) {
      jumpTo(currentSegmentId, currentParagraphIndex - 1);
    } else if (currentSegmentId > 1) {
      const prevSeg = SEGMENTS.find(s => s.id === currentSegmentId - 1);
      if (prevSeg) {
        jumpTo(currentSegmentId - 1, prevSeg.paragraphs.length - 1);
      }
    }
  }, [currentSegmentId, currentParagraphIndex, jumpTo]);

  return {
    isPlaying,
    isPaused,
    currentSegmentId,
    setCurrentSegmentId,
    currentParagraphIndex,
    setCurrentParagraphIndex,
    rate,
    setRate: (newRate: number) => {
      setRate(newRate);
      if (isPlaying) {
        // Restart current paragraph with new rate smoothly
        speakParagraph(currentSegmentId, currentParagraphIndex);
      }
    },
    pauseBetweenParagraphsMs,
    setPauseBetweenParagraphsMs,
    availableVoices,
    selectedVoiceURI,
    setSelectedVoiceURI: (uri: string) => {
      setSelectedVoiceURI(uri);
      if (isPlaying) {
        speakParagraph(currentSegmentId, currentParagraphIndex);
      }
    },
    isWaitingPause,
    autoAdvance,
    setAutoAdvance,
    play,
    pause,
    stop,
    jumpTo,
    nextParagraph,
    previousParagraph,
  };
}
