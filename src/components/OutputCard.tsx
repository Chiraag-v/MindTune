import { FileText, Sparkles } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface OutputCardProps {
  title: string;
  text: string;
  isLoading?: boolean;
  emptyText?: string;
  variant?: 'code' | 'prose';
}

// Render inline **bold** markers
function renderInlineMd(content: string): React.ReactNode[] {
  return content.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
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

// Full markdown-aware renderer — handles headings, bullets, numbered lists, paragraphs
function renderMarkdown(text: string, accent: 'violet' | 'indigo'): React.ReactNode[] {
  const dotCls =
    accent === 'violet' ? 'bg-violet-400/80' : 'bg-indigo-400/80';

  return text
    .trim()
    .split(/\r?\n/)
    .map((line, i) => {
      // ### sub-heading (check deeper levels first)
      const h3 = line.match(/^###\s+(.*)/);
      if (h3) {
        return (
          <p key={i} className="mb-1 mt-4 text-sm font-bold text-zinc-200 first:mt-0">
            {renderInlineMd(h3[1])}
          </p>
        );
      }

      // ## section heading
      const h2 = line.match(/^##\s+(.*)/);
      if (h2) {
        return (
          <p key={i} className="mb-1 mt-5 text-[15px] font-bold leading-snug text-zinc-100 first:mt-0">
            {renderInlineMd(h2[1])}
          </p>
        );
      }

      // # top-level heading
      const h1 = line.match(/^#\s+(.*)/);
      if (h1) {
        return (
          <p key={i} className="mb-1 mt-5 text-base font-bold leading-snug text-white first:mt-0">
            {renderInlineMd(h1[1])}
          </p>
        );
      }

      // Indented sub-bullet (2+ spaces then - / * / •)
      const subBullet = line.match(/^(\s{2,})[-*•]\s+(.*)/);
      if (subBullet) {
        return (
          <div key={i} className="my-0.5 flex items-start gap-2 pl-5">
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
            <span className="text-sm leading-7 text-zinc-400">
              {renderInlineMd(subBullet[2])}
            </span>
          </div>
        );
      }

      // Top-level bullet: - / * / •
      const bullet = line.match(/^[-*•]\s+(.*)/);
      if (bullet) {
        return (
          <div key={i} className="my-1 flex items-start gap-2.5">
            <span className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotCls}`} />
            <span className="text-sm leading-7 text-zinc-300">
              {renderInlineMd(bullet[1])}
            </span>
          </div>
        );
      }

      // Numbered list item (possibly indented): "  1. text"
      const numItem = line.match(/^(\s*)(\d+)\.\s+(.*)/);
      if (numItem) {
        return (
          <div
            key={i}
            className={`my-1 flex items-start gap-2 ${numItem[1].length > 0 ? 'pl-4' : ''}`}
          >
            <span className="min-w-[1.25rem] shrink-0 text-right text-sm font-semibold text-zinc-500">
              {numItem[2]}.
            </span>
            <span className="text-sm leading-7 text-zinc-300">
              {renderInlineMd(numItem[3])}
            </span>
          </div>
        );
      }

      // Blank line — small spacer
      if (!line.trim()) {
        return <div key={i} className="h-1" />;
      }

      // Default paragraph
      return (
        <p key={i} className="text-sm leading-7 text-zinc-300">
          {renderInlineMd(line)}
        </p>
      );
    });
}

export function OutputCard({ title, text, isLoading, emptyText, variant = 'code' }: OutputCardProps) {
  const display = text.trim();
  const isCode = variant === 'code';
  const accent = isCode ? 'violet' : 'indigo';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/6 bg-zinc-900/50 shadow-lg shadow-black/20 backdrop-blur-xl dark:border-zinc-800/60">
      {/* Accent top line */}
      <div
        className={`absolute inset-x-0 top-0 h-px ${
          isCode
            ? 'bg-gradient-to-r from-transparent via-violet-500/70 to-transparent'
            : 'bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent'
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-2.5">
          {isCode ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/15">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/15">
              <FileText className="h-3.5 w-3.5 text-indigo-400" />
            </div>
          )}
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            {title}
          </h2>
        </div>
        <CopyButton text={display} disabled={isLoading} />
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/5" />

      {/* Content */}
      <div className="p-5">
        {display ? (
          <div>
            {renderMarkdown(display, accent)}
            {isLoading && (
              <span
                className={`ml-0.5 animate-pulse ${
                  isCode ? 'text-violet-400' : 'text-indigo-400'
                }`}
              >
                ▍
              </span>
            )}
          </div>
        ) : (
          <div className="flex justify-center py-6">
            {isLoading ? (
              <span className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="inline-flex gap-1">
                  <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-zinc-500" />
                  <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-zinc-500" />
                  <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-zinc-500" />
                </span>
                Generating…
              </span>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-500">
                {emptyText ?? 'Nothing yet.'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
