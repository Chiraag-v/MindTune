'use client';

import {
  ArrowRight,
  Sparkles,
  Zap,
  MessageSquareText,
  History,
  Share2,
  Mic,
  SlidersHorizontal,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface LandingPageProps {
  onGetStarted: () => void;
}

const STEPS = [
  {
    n: '01',
    title: 'Speak or type your idea',
    body: 'Dump your rough, messy thought exactly as it is — incomplete sentences, "um"s included. Or just speak it out loud using the built-in mic.',
  },
  {
    n: '02',
    title: 'MindTune rewrites it',
    body: 'The AI restructures, sharpens, and enriches your prompt in real time — streaming word by word — then scores it from 1 to 100 on a live quality meter.',
  },
  {
    n: '03',
    title: 'Understand, share, revisit',
    body: 'Read the full change log, ask follow-up questions, share the result with a single link, and reopen any past optimisation from your history.',
  },
];

const FEATURES = [
  {
    icon: Mic,
    title: 'Voice-to-Prompt',
    body: 'Speak your messy idea out loud. MindTune transcribes it and tunes it automatically — "I need like... a stock thing for beginners" becomes a polished prompt.',
    accent: 'text-rose-500',
  },
  {
    icon: Zap,
    title: 'Live Quality Score',
    body: 'A circular speedometer scores your optimised prompt 1–100 in real time with RGB colour feedback — red to yellow to green as quality rises.',
    accent: 'text-amber-500',
  },
  {
    icon: MessageSquareText,
    title: 'Ask Anything',
    body: 'A built-in Q&A lets you interrogate your optimised prompt — ask "Why was this constraint added?" and get a clear, formatted answer instantly.',
    accent: 'text-sky-500',
  },
  {
    icon: History,
    title: 'Full Prompt History',
    body: 'Every optimised prompt, explanation, change log, and Q&A thread is saved to your account. Open any past session and pick up exactly where you left off.',
    accent: 'text-emerald-500',
  },
  {
    icon: Share2,
    title: 'Shareable Links',
    body: 'One click generates a permanent read-only link to your optimisation. Send it to teammates, clients, or anyone — no account needed to view.',
    accent: 'text-pink-500',
  },
  {
    icon: SlidersHorizontal,
    title: 'Multiple AI Providers',
    body: 'Switch between Gemini 2.5 Flash, ChatGPT, Anthropic Claude, and Llama from a single dropdown. Use the default server key or bring your own.',
    accent: 'text-orange-500',
  },
];

const EXAMPLE = {
  before: 'I need like... a thing that tells me stock prices but like in a fun way for beginners, maybe with some graphs or whatever',
  after:  'Create a beginner-friendly stock price dashboard that displays real-time price data with interactive, colour-coded charts. Include tooltips explaining each metric in plain language, a watchlist feature, and a "What does this mean?" sidebar for first-time investors.',
};

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-zinc-100 bg-zinc-50/80 backdrop-blur dark:border-zinc-900 dark:bg-black/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="inline-flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-white/70 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/60">
              <Sparkles className="h-4 w-4" />
            </span>
            MindTune
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={onGetStarted}
              className="rounded-xl border border-zinc-200 bg-white/70 px-4 py-1.5 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
            >
              Log in
            </button>
            <button
              onClick={onGetStarted}
              className="cursor-pointer rounded-xl bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-20 text-center md:pt-28">
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-7xl">
          Speak messy.
          <br />
          <span className="text-zinc-400 dark:text-zinc-600">Get precision.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
          MindTune takes your rough, unstructured ideas — typed or spoken — and transforms
          them into sharp, high-quality prompts. Scored, explained, and shareable in seconds.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onGetStarted}
            className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-zinc-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get started — it&apos;s free
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-600">
          No credit card · No setup · Works in your browser
        </p>
      </section>

      {/* ── Before / After demo ── */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          {/* Header bar */}
          <div className="flex items-center gap-1.5 border-b border-zinc-100 px-5 py-3 dark:border-zinc-900">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <span className="ml-3 text-xs text-zinc-400 dark:text-zinc-600">MindTune — live demo</span>
          </div>

          <div className="grid grid-cols-1 divide-y divide-zinc-100 md:grid-cols-2 md:divide-x md:divide-y-0 dark:divide-zinc-900">
            {/* Before */}
            <div className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500">
                  Before
                </span>
              </div>
              <p className="text-sm leading-7 text-zinc-500 dark:text-zinc-500 italic">
                &ldquo;{EXAMPLE.before}&rdquo;
              </p>
            </div>

            {/* After */}
            <div className="relative p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  After — Score 91/100
                </span>
              </div>
              <p className="text-sm leading-7 text-zinc-800 dark:text-zinc-200">
                {EXAMPLE.after}
              </p>
              {/* Score badge */}
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Optimised · Explained · Ready to share
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-2 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">
          How it works
        </h2>
        <p className="mb-10 text-center text-sm text-zinc-500 dark:text-zinc-500">
          Three steps. Under thirty seconds.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="relative rounded-3xl border border-zinc-200 bg-white/60 p-7 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40"
            >
              <div className="mb-4 text-4xl font-black text-zinc-100 dark:text-zinc-900">
                {s.n}
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {s.body}
              </p>
              {/* connector arrow — only between cards */}
              {s.n !== '03' && (
                <ChevronRight className="absolute -right-3 top-1/2 hidden -translate-y-1/2 h-6 w-6 text-zinc-300 dark:text-zinc-700 md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-2 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50 md:text-3xl">
          Everything you need
        </h2>
        <p className="mb-10 text-center text-sm text-zinc-500 dark:text-zinc-500">
          Built for people who want AI to work harder, not just differently.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-3xl border border-zinc-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40"
              >
                <div className="mb-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                    <Icon className={`h-5 w-5 ${f.accent}`} />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {f.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-zinc-200 bg-white/50 py-10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/30">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
          {[
            { value: '4', label: 'AI Providers' },
            { value: '4', label: 'Optimisation Modes' },
            { value: '1–100', label: 'Quality Scoring' },
            { value: '∞', label: 'Prompt History' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50">{s.value}</div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Free forever · No credit card
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
          Ready to tune your first prompt?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-zinc-500 dark:text-zinc-400">
          Join MindTune and turn every rough idea into a precision prompt in seconds.
        </p>
        <button
          onClick={onGetStarted}
          className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 text-base font-semibold text-white shadow-xl transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Get started — it&apos;s free
          <ArrowRight className="h-5 w-5" />
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-200 py-8 text-center dark:border-zinc-900">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-600">
          <Sparkles className="h-3.5 w-3.5" />
          MindTune · Speak messy. Get precision.
        </div>
      </footer>
    </div>
  );
}
