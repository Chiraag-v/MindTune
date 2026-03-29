import { createClient } from '@supabase/supabase-js';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface SharePageProps {
  params: Promise<{ shareId: string }>;
}

async function getSharedOptimization(shareId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('optimization_logs')
    .select('original_prompt, optimized_prompt, explanation, changes, mode, created_at')
    .eq('share_id', shareId)
    .maybeSingle();

  return data;
}

export default async function SharedPage({ params }: SharePageProps) {
  const { shareId } = await params;
  const data = await getSharedOptimization(shareId);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Shared prompt not found
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            This link may have expired or does not exist.
          </p>
          <Link
            href="/welcome"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Go to MindTune <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const date = data.created_at
    ? new Date(data.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Nav */}
      <nav className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <div className="inline-flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-zinc-200 bg-white/70 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/60">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          MindTune
        </div>
        <Link
            href="/welcome"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Try MindTune <ArrowRight className="h-3.5 w-3.5" />
          </Link>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium capitalize text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            {data.mode ?? 'developer'} mode
          </span>
          {date && (
            <span className="text-xs text-zinc-400">{date}</span>
          )}
        </div>

        <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Shared Optimization
        </h1>

        {/* Original prompt */}
        <section className="mb-6 rounded-3xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Original Prompt
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            {data.original_prompt}
          </p>
        </section>

        {/* Optimized prompt */}
        {data.optimized_prompt && (
          <section className="mb-6 rounded-3xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Optimized Prompt
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-900 dark:text-zinc-50">
              {data.optimized_prompt}
            </p>
          </section>
        )}

        {/* Explanation */}
        {data.explanation && (
          <section className="mb-6 rounded-3xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Explanation
            </h2>
            <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
              <ReactMarkdown>{data.explanation}</ReactMarkdown>
            </div>
          </section>
        )}

        {/* What changed */}
        {data.changes && (
          <section className="mb-10 rounded-3xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              What Changed and Why
            </h2>
            <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
              <ReactMarkdown>{data.changes}</ReactMarkdown>
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="rounded-3xl border border-zinc-200 bg-white/60 p-6 text-center shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Want to tune your own prompts?
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Free forever. Supports Gemini, ChatGPT, Anthropic & Llama.
          </p>
          <Link
            href="/welcome"
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Try MindTune for free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
