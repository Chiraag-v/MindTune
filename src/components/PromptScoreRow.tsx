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

function scoreToGlow(score: number): string {
  const s = Math.max(0, Math.min(100, score)) / 100;
  if (s >= 0.7) return 'rgba(34,197,94,0.25)';
  if (s >= 0.4) return 'rgba(234,179,8,0.25)';
  return 'rgba(239,68,68,0.20)';
}

const SIZE = 140;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CX = SIZE / 2;
const CY = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function PromptScoreRow({ originalText, optimizedText, storedScore }: PromptScoreRowProps) {
  const original = scorePrompt(originalText);
  const optimized = storedScore != null ? storedScore : scorePrompt(optimizedText);
  const delta = Math.max(0, optimized - original);
  const dashOffset = CIRCUMFERENCE * (1 - optimized / 100);
  const fillColor = scoreToRgb(optimized);
  const glowColor = scoreToGlow(optimized);

  return (
    <div className="card-animated-border group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/60 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:border-zinc-300/60 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-950/40 dark:hover:border-zinc-700/60">

      {/* Ambient score glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-3xl"
        style={{ background: `radial-gradient(circle at 20% 50%, ${glowColor}, transparent 60%)` }}
      />

      <div className="relative flex flex-wrap items-center gap-8">

        {/* ── Circular score dial ── */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Quality Score
          </span>

          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full opacity-0 transition-all duration-700 group-hover:opacity-100"
              style={{
                boxShadow: `0 0 32px ${glowColor}, 0 0 64px ${glowColor}`,
                borderRadius: '50%',
              }}
            />

            <svg width={SIZE} height={SIZE} className="origin-center drop-shadow-sm">
              {/* Track */}
              <circle
                cx={CX} cy={CY} r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE}
                className="text-zinc-100 dark:text-zinc-800"
              />
              {/* Progress arc */}
              <circle
                cx={CX} cy={CY} r={RADIUS}
                fill="none"
                stroke={fillColor}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${CX} ${CY})`}
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 6px ${fillColor}99)` }}
              />
            </svg>

            {/* Center value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: '8%' }}>
              <span className="text-3xl font-black tabular-nums leading-none" style={{ color: fillColor }}>
                <OdometerNumber value={optimized} />
              </span>
              <span className="mt-0.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-600">/ 100</span>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-600 w-14">Original</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tabular-nums" style={{ color: scoreToRgb(original) }}>
                <OdometerNumber value={original} />
              </span>
              <span className="text-xs text-zinc-400">/100</span>
            </div>
          </div>

          <div className="h-px w-32 bg-zinc-100 dark:bg-zinc-800" />

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-600 w-14">Change</span>
            <span className={`text-base font-bold tabular-nums ${
              delta > 0 ? 'text-emerald-500' : delta < 0 ? 'text-rose-500' : 'text-zinc-400'
            }`}>
              {delta > 0 ? '+' : ''}<OdometerNumber value={delta} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
