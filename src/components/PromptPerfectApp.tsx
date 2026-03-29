'use client';

import { useMemo, useState, useEffect } from 'react';
import { type Session } from '@supabase/supabase-js';

import { PromptPerfectActions } from '@/components/PromptPerfectActions';
import { PromptChatBox } from '@/components/PromptChatBox';
import { PromptPerfectForm } from '@/components/PromptPerfectForm';
import { PromptPerfectHeader } from '@/components/PromptPerfectHeader';
import { PromptPerfectOutputs } from '@/components/PromptPerfectOutputs';
import { PromptScoreRow } from '@/components/PromptScoreRow';
import { HistoryPanel, type HistoryItem } from '@/components/HistoryPanel';
import { Auth } from '@/components/Auth';
import { useApiConfig } from '@/hooks/useApiConfig';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useOptimizePrompt } from '@/hooks/useOptimizePrompt';
import { getSupabaseClient } from '@/lib/client/supabase';
import type { Mode, OptimizeVersion, ProviderId } from '@/lib/types';

import { SettingsModal } from '@/components/SettingsModal';
import { ShareButton } from '@/components/ShareButton';

function PromptPerfectMain({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const userId = session.user.id;
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<Mode>('developer');
  // Always use v2 (Stream)
  const [version, setVersion] = useState<OptimizeVersion>('v2');
  const [provider, setProvider] = useState<ProviderId>('google');
  const [username, setUsername] = useState<string | null>(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // First try session metadata (available immediately after signup)
    const metaUsername = session.user.user_metadata?.username as string | undefined;
    if (metaUsername) setUsername(metaUsername);

    // Then confirm/override from DB (source of truth)
    const supabase = getSupabaseClient();
    if (!supabase) return;
    supabase
      .from('personal_info')
      .select('username')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.username) setUsername(data.username);
      });
  }, [userId, session.user.user_metadata]);
  const [initialQAMessages, setInitialQAMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [initialFeedback, setInitialFeedback] = useState<{ rating?: 'up' | 'down' | null; text?: string }>({});

  const { hasServerKey } = useApiConfig();
  
  // Separate storage for each provider's key, scoped by userId
  const googleKey = useLocalStorageState(`promptperfect:apiKey:google:${userId}`, '');
  const openaiKey = useLocalStorageState(`promptperfect:apiKey:openai:${userId}`, '');
  const anthropicKey = useLocalStorageState(`promptperfect:apiKey:anthropic:${userId}`, '');
  const groqKey = useLocalStorageState(`promptperfect:apiKey:groq:${userId}`, '');

  const currentKey =
    provider === 'google'
      ? googleKey
      : provider === 'openai'
        ? openaiKey
        : provider === 'anthropic'
          ? anthropicKey
          : groqKey;

  const {
    optimizedText,
    explanation,
    changes,
    sessionId,
    storedScore,
    provider: usedProvider,
    model: usedModel,
    isLoading,
    error,
    optimize,
    reset,
    loadSession,
  } = useOptimizePrompt();

  const helpText = useMemo(() => {
    const serverHasKey = hasServerKey(provider);
    if (serverHasKey) {
      return 'Server key detected. You can leave this empty, or paste a BYOK key to override.';
    }
    const providerNames: Record<string, string> = {
      google: 'Gemini',
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      groq: 'Groq',
    };
    const displayName = providerNames[provider] ?? provider;
    return `No server key detected for ${displayName}. Paste your key.`;
  }, [hasServerKey, provider]);

  const shouldShowKeyHint =
    !hasServerKey(provider) && currentKey.hydrated && currentKey.value.trim().length === 0;

  return (
    <div className="min-h-screen w-full px-5 py-10 md:px-10 md:py-12">
      <div className="w-full">
        <div className="mb-10">
          <PromptPerfectHeader 
            onHistoryClick={() => setIsHistoryOpen(true)} 
            onSettingsClick={() => setIsSettingsOpen(true)}
            onLogout={onLogout}
            onLogoClick={() => window.location.href = '/welcome'}
            userEmail={session.user.email}
            username={username}
          />
        </div>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={onLogout}
        />

        <HistoryPanel
          userId={userId}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelect={async (item: HistoryItem) => {
            setPrompt(item.original_prompt);
            setMode(item.mode as Mode);
            setProvider(item.provider as ProviderId);
            
            loadSession({
              optimizedText: item.optimized_prompt || '',
              explanation: item.explanation || '',
              changes: item.changes || '',
              sessionId: item.session_id,
              provider: item.provider as ProviderId,
              model: item.model || '',
              storedScore: item.prompt_score ?? null,
            });

            setInitialFeedback({
              rating: item.feedback as 'up' | 'down' | null,
              text: item.feedback_text,
            });

            try {
              const res = await fetch(`/api/qa-history?session_id=${item.session_id}`);
              if (res.ok) {
                const data = await res.json();
                setInitialQAMessages(data.messages || []);
              } else {
                setInitialQAMessages([]);
              }
            } catch (e) {
              console.error('Failed to fetch QA history', e);
              setInitialQAMessages([]);
            }
          }}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PromptChatBox
            value={prompt}
            onChange={setPrompt}
            disabled={isLoading}
            onAutoTune={() => {
              if (!prompt.trim()) return;
              setInitialQAMessages([]);
              setInitialFeedback({});
              optimize({
                prompt,
                mode,
                provider,
                version,
                apiKey: currentKey.value,
                userId: userId,
              });
            }}
          />

          <div className="space-y-6">
            <div className="rounded-[28px] border border-zinc-200 bg-white/50 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/30 md:p-7">
              <PromptPerfectForm
                mode={mode}
                onModeChange={setMode}
                version={version}
                onVersionChange={(v) => {
                  setVersion(v);
                  reset();
                }}
                provider={provider}
                onProviderChange={setProvider}
                apiKey={currentKey.value}
                onApiKeyChange={currentKey.setValue}
                apiKeyHelpText={helpText}
                apiKeyDisabled={isLoading || !currentKey.hydrated}
                disabled={isLoading}
              />

              <div className="mt-6">
                <PromptPerfectActions
                  canSubmit={Boolean(prompt.trim())}
                  isLoading={isLoading}
                  usedProvider={usedProvider}
                  usedModel={usedModel}
                  onSubmit={() => {
                    setInitialQAMessages([]);
                    setInitialFeedback({});
                    optimize({
                      prompt,
                      mode,
                      provider,
                      version,
                      apiKey: currentKey.value,
                      userId: userId,
                    });
                  }}
                  onReset={() => {
                    setPrompt('');
                    setInitialQAMessages([]);
                    setInitialFeedback({});
                    reset();
                  }}
                />
              </div>
            </div>

            <PromptScoreRow
              originalText={prompt}
              optimizedText={optimizedText}
              storedScore={storedScore}
            />

            {optimizedText.trim() && <ShareButton sessionId={sessionId} />}

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                {error}
              </div>
            ) : null}

            {shouldShowKeyHint ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-800 shadow-sm backdrop-blur dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                Add <code className="font-mono">{provider.toUpperCase()}_API_KEY</code> to <code className="font-mono">.env</code> and
                restart <code className="font-mono">npm run dev</code>, or open Advanced and paste a BYOK key.
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          <PromptPerfectOutputs
            optimizedText={optimizedText}
            explanation={explanation}
            changes={changes}
            sessionId={sessionId}
            mode={mode}
            isLoading={isLoading}
            provider={provider}
            apiKey={currentKey.value}
            initialQAMessages={initialQAMessages}
            initialFeedback={initialFeedback}
          />
        </div>
      </div>
    </div>
  );
}

import { UpdatePassword } from '@/components/UpdatePassword';
import { LandingPage } from '@/components/LandingPage';

export function PromptPerfectApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [forceAuth, setForceAuth] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === '1') {
      setForceAuth(true);
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoadingSession(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoadingSession(false);
      
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      } else if (!session) {
        setIsPasswordRecovery(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
      setSession(null);
    }
  };

  if (loadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-400" />
      </div>
    );
  }

  if (isPasswordRecovery) {
    return <UpdatePassword onComplete={() => setIsPasswordRecovery(false)} />;
  }

  // Show landing page for logged-out users who haven't clicked Get Started yet
  if (!session && showLanding && !forceAuth) {
    return <LandingPage onGetStarted={() => { setShowLanding(false); setForceAuth(true); }} />;
  }

  // Always show login/signup after clicking Get Started, even if already logged in
  if (!session || forceAuth) {
    return <Auth onLogin={() => setForceAuth(false)} />;
  }

  return <PromptPerfectMain session={session} onLogout={handleLogout} />;
}
