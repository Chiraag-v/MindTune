'use client';

import { ChevronDown, GitCommitHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ExplanationPanelProps {
  explanation: string;
}

const BULLET_RE = /^[-*•]\s+/;

function renderInlineMd(content: string): React.ReactNode[] {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong key={i} className="font-semibold text-zinc-100">
          {m[1]}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

type Item = { type: 'bullet' | 'paragraph'; content: string };

function parseItems(text: string): Item[] {
  if (!text.trim()) return [];
  return text
    .trim()
    .split(/\r?\n/)
    .flatMap((line): Item[] => {
      if (BULLET_RE.test(line)) {
        return [{ type: 'bullet', content: line.replace(BULLET_RE, '').trim() }];
      }
      if (line.trim()) {
        return [{ type: 'paragraph', content: line.trim() }];
      }
      return [];
    });
}

export function ExplanationPanel({ explanation }: ExplanationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasContent = Boolean(explanation.trim());
  const wasEmptyRef = useRef(true);

  useEffect(() => {
    if (hasContent && wasEmptyRef.current) {
      setIsExpanded(true);
      wasEmptyRef.current = false;
    } else if (!hasContent) {
      setIsExpanded(false);
      wasEmptyRef.current = true;
    }
  }, [hasContent]);

  const items = parseItems(explanation);

  // Number bullets sequentially
  let bulletCount = 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/6 bg-zinc-900/50 shadow-lg shadow-black/20 backdrop-blur-xl dark:border-zinc-800/60">
      {/* Pink accent top line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/60 to-transparent" />

      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-500/15">
            <GitCommitHorizontal className="h-3.5 w-3.5 text-pink-400" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            What changed and why
          </h2>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <>
          <div className="mx-5 h-px bg-white/5" />
          <div className="px-5 pb-5 pt-4">
            {hasContent ? (
              <ul className="space-y-3">
                {items.map((item, i) => {
                  if (item.type === 'bullet') {
                    bulletCount += 1;
                    const num = bulletCount;
                    return (
                      <li key={i} className="flex items-start gap-3">
                        {/* Gradient numbered pill */}
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{
                            background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                          }}
                        >
                          {num}
                        </span>
                        <span className="text-sm leading-6 text-zinc-300">
                          {renderInlineMd(item.content)}
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li key={i} className="pl-8 text-sm leading-6 text-zinc-400">
                      {renderInlineMd(item.content)}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-4 text-center text-sm text-zinc-600 dark:text-zinc-500">
                No changes yet. Optimize a prompt to see what changed from your original to the
                improved version.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
