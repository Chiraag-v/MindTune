'use client';

import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { getSupabaseClient } from '@/lib/client/supabase';

const inputClass = `block w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-600 backdrop-blur transition-all duration-200
  focus:border-violet-500/50 focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-violet-500/20`;

const labelClass = 'block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2';

export function Auth({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [message, setMessage]   = useState<string | null>(null);
  const [mode, setMode]         = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [showPassword, setShowPassword] = useState(false);

  const switchMode = (next: 'login' | 'signup' | 'forgot_password') => {
    setMode(next);
    setError(null);
    setMessage(null);
    setEmail('');
    setPassword('');
    setUsername('');
    setShowPassword(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = getSupabaseClient();
    if (!supabase) { setError('Supabase client not initialized'); setLoading(false); return; }

    try {
      if (mode === 'forgot_password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        });
        if (error) throw error;
        setMessage('If an account exists for this email, you will receive a password reset link.');

      } else if (mode === 'signup') {
        const trimmedUsername = username.trim();
        if (!trimmedUsername) { setError('Please enter a username.'); setLoading(false); return; }
        if (trimmedUsername.length < 3) { setError('Username must be at least 3 characters.'); setLoading(false); return; }

        const { data: existing } = await supabase
          .from('personal_info').select('id').ilike('username', trimmedUsername).maybeSingle();
        if (existing) { setError('That username is already taken. Please choose another.'); setLoading(false); return; }

        const { data, error } = await supabase.auth.signUp({
          email, password, options: { data: { username: trimmedUsername } },
        });
        if (error) throw error;

        if (data.session) { onLogin(); }
        else if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError('User already exists. Please login instead.'); switchMode('login');
        } else {
          setMessage('Check your email for the confirmation link!');
        }

      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      if (msg === 'Failed to fetch')
        setError('Connection failed. Please check your internet or if the Supabase project is active.');
      else if (msg.toLowerCase().includes('invalid login credentials'))
        setError('Incorrect email or password. Please try again, or use "Forgot password?" to reset it.');
      else if (msg.toLowerCase().includes('email not confirmed'))
        setError('Please confirm your email before logging in. Check your inbox for a confirmation link.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset password';
  const subtitle = mode === 'login' ? 'Login to access your prompt history'
    : mode === 'signup' ? 'Free forever. No credit card required.'
    : 'Enter your email to receive a reset link';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4">

      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl animate-glow-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-pink-600/10 blur-3xl animate-glow-pulse delay-300" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/8 blur-3xl animate-glow-pulse delay-500" />
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-md animate-fade-up">

        {/* Gradient border wrapper */}
        <div className="rounded-3xl p-px bg-gradient-to-br from-violet-500/30 via-transparent to-pink-500/20">
          <div className="rounded-3xl bg-zinc-900/90 backdrop-blur-xl p-8 shadow-2xl shadow-black/60">

            {/* Logo */}
            <div className="mb-8 flex flex-col items-center gap-4">
              <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/20 to-pink-500/20 shadow-lg shadow-violet-500/10">
                <Sparkles className="h-5 w-5 text-violet-400" />
                <span className="absolute inset-0 rounded-2xl border border-dashed border-violet-400/20 animate-spin-slow" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-black tracking-tight">
                  <span className="gradient-text">{title}</span>
                </h1>
                <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleAuth}>

              {mode === 'signup' && (
                <div>
                  <label htmlFor="username" className={labelClass}>Name</label>
                  <input
                    id="username" type="text" autoComplete="username" required
                    value={username} onChange={(e) => setUsername(e.target.value)}
                    className={inputClass} placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                  id="email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className={inputClass} placeholder="you@example.com"
                />
              </div>

              {mode !== 'forgot_password' && (
                <div>
                  <label htmlFor="password" className={labelClass}>Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pr-11`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-violet-400"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword
                        ? <EyeOff className="h-4 w-4" />
                        : <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => switchMode('forgot_password')}
                    className="text-xs font-medium text-zinc-500 transition hover:text-violet-400">
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-400">
                  {error}
                </div>
              )}
              {message && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 hover:shadow-xl disabled:opacity-50 btn-shimmer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-flex gap-1">
                      <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    Processing…
                  </span>
                ) : (
                  mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link'
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 text-center text-sm text-zinc-600">
              {mode === 'login' && (
                <>
                  Don&apos;t have an account?{' '}
                  <button type="button" onClick={() => switchMode('signup')}
                    className="font-semibold text-violet-400 transition hover:text-violet-300">
                    Sign up →
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchMode('login')}
                    className="font-semibold text-violet-400 transition hover:text-violet-300">
                    Log in →
                  </button>
                </>
              )}
              {mode === 'forgot_password' && (
                <button type="button" onClick={() => switchMode('login')}
                  className="font-semibold text-violet-400 transition hover:text-violet-300">
                  ← Back to Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
