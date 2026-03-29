'use client';

import { Clock, Settings, Sparkles, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState } from 'react';

interface PromptPerfectHeaderProps {
  onHistoryClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  onLogoClick?: () => void;
  userEmail?: string;
  username?: string | null;
}

export function PromptPerfectHeader({ onHistoryClick, onSettingsClick, onLogout, onLogoClick, userEmail, username }: PromptPerfectHeaderProps) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <button
            onClick={onLogoClick}
            className="inline-flex cursor-pointer items-center gap-2 text-xl font-semibold tracking-tight text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50 md:text-2xl"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-zinc-200 bg-white/70 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
              <Sparkles className="h-4 w-4" />
            </span>
            MindTune
          </button>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-4xl">
            Minimal in. Perfect out.
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onHistoryClick}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Recent</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
              title="Profile"
            >
              <User className="h-4 w-4" />
            </button>
            
            {showProfile && (userEmail || username) && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowProfile(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-white/10">
                  {username && (
                    <div className="mb-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      Hi, {username} 👋
                    </div>
                  )}
                  {userEmail && (
                    <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {userEmail}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
      <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Paste a messy prompt, get a cleaner tuned one
      </p>
    </header>
  );
}

