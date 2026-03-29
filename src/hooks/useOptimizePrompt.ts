'use client';

import { useCallback, useRef, useState } from 'react';

import { splitOptimizedOutput } from '@/lib/delimiter';
import { scorePrompt } from '@/lib/promptScore';
import {
  postOptimizeStream,
  postOptimizeSync,
  readUint8Stream,
} from '@/lib/client/optimizeApi';
import type { Mode, OptimizeVersion, ProviderId } from '@/lib/types';
import type { OptimizationLogInsert } from '@/lib/client/optimizationLogs';

async function safeLogOptimization(insert: OptimizationLogInsert) {
  // Client-side logging removed in favor of server-side logging
}

interface OptimizeState {
  optimizedText: string;
  explanation: string;
  changes: string;
  rawText: string;
  sessionId: string;
  provider: ProviderId;
  model: string;
  storedScore: number | null;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_PROVIDER: ProviderId = 'google';

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function initialState(): OptimizeState {
  return {
    optimizedText: '',
    explanation: '',
    changes: '',
    rawText: '',
    sessionId: '',
    provider: DEFAULT_PROVIDER,
    model: '',
    storedScore: null,
    isLoading: false,
    error: null,
  };
}

export function useOptimizePrompt() {
  const [state, setState] = useState<OptimizeState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState(initialState());
  }, []);

  const optimize = useCallback(
    async (args: {
      prompt: string;
      mode: Mode;
      provider: ProviderId;
      version: OptimizeVersion;
      apiKey?: string;
      model?: string;
      userId?: string;
    }) => {
      const prompt = args.prompt.trim();
      if (!prompt) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const sessionId = generateSessionId();
      setState((s) => ({
        ...s,
        optimizedText: '',
        explanation: '',
        changes: '',
        rawText: '',
        sessionId,
        provider: args.provider,
        model: '',
        storedScore: null, // reset so live score animates on re-optimization
        isLoading: true,
        error: null,
      }));

      try {
        if (args.version === 'v1') {
          const data = await postOptimizeSync({
            prompt,
            mode: args.mode,
            session_id: sessionId,
            user_id: args.userId,
            version: 'v1',
            provider: args.provider,
            apiKey: args.apiKey,
            model: args.model,
            signal: controller.signal,
          });

          setState((s) => ({
            ...s,
            optimizedText: data.optimizedText,
            explanation: data.explanation,
            changes: data.changes,
            rawText: data.rawText,
            provider: data.provider ?? s.provider,
            model: data.model ?? '',
            isLoading: false,
          }));

          // Client-side logging removed
          // void safeLogOptimization({ ... });

          return;
        }

        const { provider, model, reader } = await postOptimizeStream({
          prompt,
          mode: args.mode,
          session_id: sessionId,
          user_id: args.userId,
          version: 'v2',
          provider: args.provider,
          apiKey: args.apiKey,
          model: args.model,
          signal: controller.signal,
        });

        let buffer = '';

        await readUint8Stream(reader, (chunkText) => {
          buffer += chunkText;
          const { optimizedText, explanation, changes } = splitOptimizedOutput(buffer);
          setState((s) => ({
            ...s,
            rawText: buffer,
            optimizedText,
            explanation,
            changes,
            provider,
            model,
          }));
        });

        const { optimizedText, explanation, changes } = splitOptimizedOutput(buffer);
        // Client-side logging removed
        // void safeLogOptimization({ ... });

        // Update server-inserted row with prompt_score (streaming inserts at start before we have result)
        // Moved to server-side onFinish
        // void fetch('/api/optimization-log', ...);

        setState((s) => ({ ...s, isLoading: false }));
      } catch (err) {
        if (controller.signal.aborted) return;
        setState((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Something went wrong',
        }));
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [],
  );

  const loadSession = useCallback((data: {
    optimizedText: string;
    explanation: string;
    changes: string;
    sessionId: string;
    provider: ProviderId;
    model: string;
    storedScore?: number | null;
  }) => {
    setState((s) => ({
      ...s,
      optimizedText: data.optimizedText,
      explanation: data.explanation,
      changes: data.changes,
      rawText: '',
      sessionId: data.sessionId,
      provider: data.provider,
      model: data.model,
      storedScore: data.storedScore ?? null,
      isLoading: false,
      error: null,
    }));
  }, []);

  return { ...state, optimize, reset, loadSession };
}

