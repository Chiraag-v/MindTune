'use client';

import { RotateCcw, Sparkles } from 'lucide-react';
import { useRef } from 'react';

interface PromptPerfectActionsProps {
  canSubmit: boolean;
  isLoading: boolean;
  onSubmit: () => void;
  onReset: () => void;
  usedProvider?: string;
  usedModel?: string;
}

export function PromptPerfectActions(props: PromptPerfectActionsProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  // Magnetic effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = btnRef.current;
    if (!btn || !props.canSubmit || props.isLoading) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleMouseLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = '';
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* ── Tune it — gradient magnetic button ── */}
      <button
        ref={btnRef}
        type="button"
        onClick={props.onSubmit}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        disabled={!props.canSubmit || props.isLoading}
        className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        style={{
          background: props.isLoading
            ? 'linear-gradient(135deg, #7c3aed, #9333ea)'
            : 'linear-gradient(135deg, #7c3aed, #9333ea, #db2777)',
          boxShadow: props.canSubmit && !props.isLoading
            ? '0 0 24px rgba(139, 92, 246, 0.4), 0 4px 16px rgba(139, 92, 246, 0.3)'
            : undefined,
        }}
      >
        {/* Shimmer layer */}
        {!props.isLoading && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent btn-shimmer" />
        )}

        {/* AI thinking dots when loading */}
        {props.isLoading ? (
          <>
            <span className="relative flex items-center gap-2">
              <span className="inline-flex gap-1">
                <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-white" />
                <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-white" />
                <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Tuning…
            </span>
          </>
        ) : (
          <span className="relative flex items-center gap-2">
            <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            Tune it
          </span>
        )}
      </button>

      {/* ── Reset button ── */}
      <button
        type="button"
        onClick={props.onReset}
        disabled={props.isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200/80 bg-white/60 px-5 py-3 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur transition hover:border-zinc-300 hover:bg-white hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
      >
        <RotateCcw className="h-4 w-4 transition-transform duration-300 hover:rotate-180" />
        Reset
      </button>

      {/* ── Provider / model info ── */}
      {props.usedModel && (
        <div className="text-xs text-zinc-400 dark:text-zinc-500 sm:ml-auto">
          <span className="font-medium text-zinc-500 dark:text-zinc-400">{props.usedProvider}</span>
          <span className="mx-1 opacity-40">·</span>
          <span>{props.usedModel}</span>
        </div>
      )}
    </div>
  );
}
