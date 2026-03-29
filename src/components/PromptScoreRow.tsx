'use client';

import { OdometerNumber } from '@/components/OdometerNumber';
import { scorePrompt } from '@/lib/promptScore';

interface PromptScoreRowProps {
  originalText: string;
  optimizedText: string;
  storedScore?: number | null;
}

function scoreToRgb(score: number): string {
  const s = Math.max(0, Math.min(100, score)) / 100;
  let r: number, g: number, b: number;
  if (s <= 0.5) {
    const t = s * 2;
    r = 255; g = Math.round(255 * t); b = 0;
  } else {
    const t = (s - 0.5) * 2;
    r = Math.round(255 * (1 - t)); g = 255; b = 0;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

const SIZE = 120;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CX = SIZE / 2;
const CY = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function PromptScoreRow({ originalText, optimizedText, storedScore }: PromptScoreRowProps) {
  const original = scorePrompt(originalText);
  // Use the stored score from DB when loading history, otherwise calculate live
  const optimized = storedScore != null ? storedScore : scorePrompt(optimizedText);
  const delta = Math.max(0, optimized - original);
  const dashOffset = CIRCUMFERENCE * (1 - optimized / 100);
  const fillColor = scoreToRgb(optimized);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-400">
            Quality score
          </span>
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} className="origin-center">
              <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="currentColor" strokeWidth={STROKE} className="text-zinc-200 dark:text-zinc-700" />
              <circle
                cx={CX} cy={CY} r={RADIUS} fill="none"
                stroke={fillColor} strokeWidth={STROKE} strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${CX} ${CY})`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: '8%' }}>
              <span className="text-2xl font-bold tabular-nums" style={{ color: fillColor }}>
                <OdometerNumber value={optimized} />
              </span>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">/ 100</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Original</span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: scoreToRgb(original) }}>
              <OdometerNumber value={original} />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Change</span>
            <span className={`text-sm font-semibold tabular-nums ${delta > 0 ? 'text-emerald-500' : delta < 0 ? 'text-rose-500' : 'text-zinc-400'}`}>
              {delta > 0 ? '+' : ''}<OdometerNumber value={delta} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
