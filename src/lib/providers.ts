import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import { openai, createOpenAI } from '@ai-sdk/openai';
import { anthropic, createAnthropic } from '@ai-sdk/anthropic';
import { groq, createGroq } from '@ai-sdk/groq';

import type { ProviderId } from './types';

export interface ProviderSelection {
  provider: ProviderId;
  model: string;
  apiKey?: string;
}

export function hasServerKey(provider: ProviderId): boolean {
  switch (provider) {
    case 'google':
      return Boolean(process.env.GOOGLE_API_KEY);
    case 'openai':
      return Boolean(process.env.OPENAI_API_KEY);
    case 'anthropic':
      return Boolean(process.env.ANTHROPIC_API_KEY);
    case 'groq':
      return Boolean(process.env.GROQ_API_KEY);
    default:
      return false;
  }
}

function getProviderInstance(provider: ProviderId, apiKey?: string) {
  const key = apiKey?.trim();

  switch (provider) {
    case 'google': {
      const effectiveKey = key || process.env.GOOGLE_API_KEY;
      if (!effectiveKey) return google;
      return createGoogleGenerativeAI({ apiKey: effectiveKey });
    }
    case 'openai': {
      const effectiveKey = key || process.env.OPENAI_API_KEY;
      if (!effectiveKey) return openai;
      return createOpenAI({ apiKey: effectiveKey });
    }
    case 'anthropic': {
      const effectiveKey = key || process.env.ANTHROPIC_API_KEY;
      if (!effectiveKey) return anthropic;
      return createAnthropic({ apiKey: effectiveKey });
    }
    case 'groq': {
      const effectiveKey = key || process.env.GROQ_API_KEY;
      if (!effectiveKey) return groq;
      return createGroq({ apiKey: effectiveKey });
    }
    default:
      return google;
  }
}

export function getDefaultModels(provider: ProviderId): string[] {
  switch (provider) {
    case 'google':
      return [
        'gemini-2.5-flash', // User requested default
        'gemini-2.5-flash-lite',
        'gemini-2.5-pro',
        'gemini-2.0-flash',
        'gemini-1.5-pro',
      ];
    case 'openai':
      return ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];
    case 'anthropic':
      return [
        'claude-3-5-sonnet-20241022',
        'claude-3-5-haiku-20241022',
        'claude-3-opus-20240229',
      ];
    case 'groq':
      return [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant',
        'mixtral-8x7b-32768',
      ];
    default:
      return [];
  }
}

export function isRetryableProviderError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('429') ||
    msg.toLowerCase().includes('rate limit') ||
    msg.toLowerCase().includes('quota') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('404') ||
    msg.toLowerCase().includes('not found') ||
    msg.toLowerCase().includes('does not exist') ||
    msg.includes('500') ||
    msg.includes('503')
  );
}

export function resolveModelList(selection: ProviderSelection): string[] {
  if (selection.model?.trim()) return [selection.model.trim()];
  return getDefaultModels(selection.provider);
}

export function getLanguageModel(selection: ProviderSelection, modelId: string) {
  const instance = getProviderInstance(selection.provider, selection.apiKey);
  // All provider instances are callable: provider(modelId)
  return instance(modelId);
}
