'use client';

import { Clock, Pencil, Settings, Sparkles, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState } from 'react';

interface PromptPerfectHeaderProps {
  onHistoryClick?: () => void;
  onSettingsClick?: () => void;
  onEditProfileClick?: () => void;
  onLogout?: () => void;
  onLogoClick?: () => void;
  userEmail?: string;
  username?: string | null;
}

export function PromptPerfectHeader({ onHistoryClick, onSettingsClick, onEditProfileClick, onLogout, onLogoClick, userEmail, username }: PromptPerfectHeaderProps) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">

        {/* ── Logo + headline ── */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onLogoClick}
            className="group inline-flex cursor-pointer items-center gap-2.5 text-xl font-bold tracking-tight text-zinc-900 transition dark:text-zinc-50 md:text-2xl"
          >
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-500/20 to-pink-500/20 shadow-lg shadow-violet-500/10 transition group-hover:shadow-violet-500/20">
              <Sparkles className="h-4 w-4 text-violet-500 dark:text-violet-400" />
              <span className="absolute inset-0 rounded-xl border border-dashed border-violet-400/20 animate-spin-slow" />
            </span>
            <span className="gradient-text-subtle">MindTune</span>
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-4xl">
            Minimal in.{' '}
            <span className="gradient-text">Perfect out.</span>
          </h1>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex items-center gap-2">
          <button
            onClick={onHistoryClick}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/60 px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur transition hover:border-violet-300/50 hover:bg-white hover:text-zinc-900 hover:shadow-violet-500/10 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-zinc-300 dark:hover:border-violet-800/50 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Recent</span>
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/60 px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur transition hover:border-violet-300/50 hover:bg-white hover:shadow-violet-500/10 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-zinc-300 dark:hover:border-violet-800/50 dark:hover:bg-zinc-900"
              title="Profile"
            >
              <User className="h-4 w-4" />
            </button>

            {showProfile && (userEmail || username) && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-xl shadow-black/10 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/90">
                  {/* Gradient top bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
                  <div className="flex items-start justify-between gap-2 p-4">
                    <div className="min-w-0">
                      {username && (
                        <div className="mb-1 text-base font-bold text-zinc-900 dark:text-zinc-50">
                          Hi, {username} 👋
                        </div>
                      )}
                      {userEmail && (
                        <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {userEmail}
                        </div>
                      )}
                    </div>
                    {onEditProfileClick && (
                      <button
                        onClick={() => { setShowProfile(false); onEditProfileClick(); }}
                        title="Edit profile"
                        className="shrink-0 flex items-center gap-1 rounded-lg border border-zinc-200/80 bg-white/60 px-2 py-1 text-xs font-medium text-zinc-600 shadow-sm transition hover:border-violet-300/50 hover:bg-white hover:text-violet-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-violet-700/50 dark:hover:bg-zinc-700 dark:hover:text-violet-400"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/60 px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur transition hover:border-violet-300/50 hover:bg-white hover:shadow-violet-500/10 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-zinc-300 dark:hover:border-violet-800/50 dark:hover:bg-zinc-900"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>

      <p className="max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-500">
        Paste a messy prompt, get a cleaner tuned one
      </p>
    </header>
  );
}
