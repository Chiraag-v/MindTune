'use client';

import {
  ArrowRight, Sparkles, Zap, MessageSquareText,
  History, Share2, Mic, SlidersHorizontal,
  CheckCircle, ChevronRight,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useRef, useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

// ── Floating particle dot ──────────────────────────────────────────────────
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="pointer-events-none absolute rounded-full"
      style={style}
    />
  );
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  width: Math.random() * 6 + 2,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 6,
  color: ['rgba(139,92,246,0.5)', 'rgba(236,72,153,0.5)', 'rgba(16,185,129,0.4)', 'rgba(245,158,11,0.4)'][i % 4],
}));

// ── Magnetic button ────────────────────────────────────────────────────────
function MagneticButton({ onClick, children, className }: { onClick: () => void; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`cursor-pointer transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </button>
  );
}

// ── Tilt card ──────────────────────────────────────────────────────────────
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  );
}

// ── Step card ──────────────────────────────────────────────────────────────
const STEPS = [
  { n: '01', title: 'Speak or type your idea', body: 'Dump your rough, messy thought — incomplete sentences, "um"s included. Or click the mic and just speak.' },
  { n: '02', title: 'MindTune rewrites it', body: 'AI restructures, sharpens, and enriches your prompt in real time — scored 1–100 on a live quality dial.' },
  { n: '03', title: 'Understand, share, revisit', body: 'Read the change log, ask follow-up questions, share with a link, and reopen any session from your history.' },
];

const FEATURES = [
  { icon: Mic,              title: 'Voice-to-Prompt',      body: 'Speak messy ideas aloud. MindTune transcribes and tunes automatically.',                accent: 'from-rose-500 to-pink-500',    glow: 'rgba(244,63,94,0.25)' },
  { icon: Zap,              title: 'Live Quality Score',   body: 'Circular speedometer scores 1–100 with RGB colour feedback as quality rises.',           accent: 'from-amber-400 to-orange-500', glow: 'rgba(245,158,11,0.25)' },
  { icon: MessageSquareText,title: 'Ask Anything',         body: 'Built-in Q&A lets you interrogate your optimised prompt with formatted answers.',        accent: 'from-sky-400 to-blue-500',     glow: 'rgba(14,165,233,0.25)' },
  { icon: History,          title: 'Full Prompt History',  body: 'Every session — prompt, explanation, Q&A — saved and restorable anytime.',               accent: 'from-emerald-400 to-teal-500', glow: 'rgba(16,185,129,0.25)' },
  { icon: Share2,           title: 'Shareable Links',      body: 'One click. Permanent read-only link. No account needed to view.',                        accent: 'from-pink-500 to-fuchsia-500', glow: 'rgba(236,72,153,0.25)' },
  { icon: SlidersHorizontal,title: 'Multiple AI Providers',body: 'Gemini, ChatGPT, Anthropic, Groq — switch in one dropdown, bring your own key.',        accent: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.25)' },
];

const EXAMPLE = {
  before: '"I need like… a thing that tells me stock prices but like in a fun way for beginners, maybe with some graphs or whatever"',
  after: 'Create a beginner-friendly stock price dashboard displaying real-time data with interactive, colour-coded charts. Include tooltips explaining each metric, a watchlist feature, and a "What does this mean?" sidebar for first-time investors.',
};

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100">

      {/* ── Cursor reactive glow ── */}
      {mounted && (
        <div
          className="pointer-events-none fixed z-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: 600, height: 600,
            left: cursorPos.x - 300, top: cursorPos.y - 300,
            background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      )}

      {/* ── Floating particles ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {mounted && PARTICLES.map(p => (
          <Particle
            key={p.id}
            style={{
              width: p.width, height: p.width,
              left: `${p.left}%`, top: `${p.top}%`,
              background: p.color,
              animation: `float ${p.duration}s ${p.delay}s ease-in-out infinite`,
              boxShadow: `0 0 ${p.width * 3}px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl animate-glow-pulse" />
        <div className="absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-pink-600/10 blur-3xl animate-glow-pulse delay-300" />
        <div className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-emerald-600/8 blur-3xl animate-glow-pulse delay-500" />
      </div>

      {/* ── Sticky glass nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="inline-flex items-center gap-2.5">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/20 to-pink-500/20 shadow-lg shadow-violet-500/10">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="absolute inset-0 rounded-xl animate-spin-slow border border-dashed border-violet-500/20" />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">MindTune</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={onGetStarted}
              className="cursor-pointer rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-semibold text-violet-300 backdrop-blur transition hover:bg-violet-500/20 hover:text-violet-200 hover:border-violet-400/50"
            >
              Log in
            </button>
            <MagneticButton
              onClick={onGetStarted}
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 btn-shimmer hover:shadow-violet-500/40 hover:shadow-xl"
            >
              Sign up free
            </MagneticButton>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-24 text-center md:pt-36">
        <div className="animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
            Powered by Gemini · ChatGPT · Anthropic · Groq
          </div>

          <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
            <span className="block text-white">Speak messy.</span>
            <span className="block gradient-text">Get precision.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            MindTune transforms rough, unstructured ideas — typed or spoken — into sharp, 
            high-quality prompts. Scored, explained, and shareable in seconds.
          </p>

          <div className="mt-10 flex justify-center">
            <MagneticButton
              onClick={onGetStarted}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-violet-500/30 btn-shimmer"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get started — it&apos;s free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ── Before / After demo ── */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24">
        <TiltCard className="card-animated-border overflow-hidden rounded-3xl border border-white/8 bg-zinc-900/60 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {/* Window bar */}
          <div className="flex items-center gap-1.5 border-b border-white/5 bg-black/20 px-5 py-3.5">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-amber-500/70" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-xs font-medium text-zinc-600">mindtune.app — live preview</span>
          </div>

          <div className="grid grid-cols-1 divide-y divide-white/5 md:grid-cols-2 md:divide-x md:divide-y-0">
            {/* Before */}
            <div className="p-8">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Before
              </span>
              <p className="mt-3 text-sm leading-7 italic text-zinc-500">{EXAMPLE.before}</p>
            </div>

            {/* After */}
            <div className="relative p-8">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                After — Score 91 / 100
              </span>
              <p className="mt-3 text-sm leading-7 text-zinc-200">{EXAMPLE.after}</p>
              <div className="mt-5 flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Optimised · Explained · Ready to share
              </div>

              {/* Score ring decoration */}
              <div className="absolute right-6 top-6 opacity-20">
                <svg width="56" height="56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#71717a" strokeWidth="4" />
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#22c55e" strokeWidth="4"
                    strokeDasharray={138.2} strokeDashoffset={138.2 * 0.09}
                    transform="rotate(-90 28 28)" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </TiltCard>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-2 text-center text-3xl font-bold text-white md:text-4xl">
          How it works
        </h2>
        <p className="mb-12 text-center text-sm text-zinc-500">Three steps. Under thirty seconds.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <TiltCard key={s.n} className="card-animated-border relative rounded-3xl border border-white/6 bg-zinc-900/50 p-8 backdrop-blur-sm">
              <div className="mb-5 text-5xl font-black text-white/5">{s.n}</div>
              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.body}</p>
              {i < 2 && (
                <ChevronRight className="absolute -right-3 top-1/2 hidden -translate-y-1/2 h-6 w-6 text-zinc-700 md:block" />
              )}
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-2 text-center text-3xl font-bold text-white md:text-4xl">
          Everything you need
        </h2>
        <p className="mb-12 text-center text-sm text-zinc-500">
          Built for people who want AI to work harder, not just differently.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <TiltCard
                key={f.title}
                className="card-animated-border group relative overflow-hidden rounded-3xl border border-white/6 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/12 hover:bg-zinc-900/80"
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-3xl"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${f.glow}, transparent 70%)` }}
                />

                <div className={`relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${f.accent} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="relative text-sm font-bold text-white">{f.title}</h3>
                <p className="relative mt-2 text-xs leading-relaxed text-zinc-500">{f.body}</p>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="relative z-10 border-y border-white/5 bg-zinc-900/40 py-12 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
          {[
            { value: '4', label: 'AI Providers' },
            { value: '4', label: 'Optimisation Modes' },
            { value: '1–100', label: 'Quality Scoring' },
            { value: '∞', label: 'Prompt History' },
          ].map((s) => (
            <div key={s.label}>
              <div className="gradient-text text-4xl font-black">{s.value}</div>
              <div className="mt-1 text-xs text-zinc-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          Free forever · No credit card
        </div>
        <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
          Ready to tune your<br />
          <span className="gradient-text">first prompt?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base text-zinc-500">
          Join MindTune and turn every rough idea into a precision prompt in seconds.
        </p>
        <div className="mt-10">
          <MagneticButton
            onClick={onGetStarted}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-violet-500/30 btn-shimmer hover:shadow-violet-500/50 hover:shadow-2xl"
          >
            <span className="relative z-10 flex items-center gap-3">
              Get started — it&apos;s free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </MagneticButton>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700">
          <Sparkles className="h-3.5 w-3.5" />
          MindTune · Speak messy. Get precision.
        </div>
      </footer>
    </div>
  );
}
