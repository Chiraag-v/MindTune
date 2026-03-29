'use client';

import { useState } from 'react';

import { ApiKeyField } from '@/components/ApiKeyField';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Select } from '@/components/Select';
import type { Mode, OptimizeVersion, ProviderId } from '@/lib/types';

const MODE_OPTIONS: Array<{ value: Mode; label: string }> = [
  { value: 'developer', label: 'Developer' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'specific', label: 'Specific' },
  { value: 'step-by-step', label: 'Step-by-step' },
];

const PROVIDER_OPTIONS: Array<{ value: ProviderId; label: string }> = [
  { value: 'google', label: 'Gemini 2.5 Flash (Default)' },
  { value: 'openai', label: 'ChatGPT' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'groq', label: 'Llama' },
];

interface PromptPerfectFormProps {
  mode: Mode;
  onModeChange: (value: Mode) => void;
  version: OptimizeVersion;
  onVersionChange: (value: OptimizeVersion) => void;
  provider: ProviderId;
  onProviderChange: (value: ProviderId) => void;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  apiKeyHelpText: string;
  apiKeyDisabled?: boolean;
  disabled?: boolean;
}

export function PromptPerfectForm(props: PromptPerfectFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6">
      <SegmentedControl
        label="Mode"
        value={props.mode}
        onChange={props.onModeChange}
        options={MODE_OPTIONS}
        disabled={props.disabled}
      />

      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:hover:bg-zinc-950"
      >
        {showAdvanced ? 'Hide' : 'Show'} advanced
      </button>

      {showAdvanced ? (
        <div className="rounded-3xl border border-zinc-200 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
                AI Provider
              </span>
              <Select
                value={props.provider}
                onChange={props.onProviderChange}
                options={PROVIDER_OPTIONS}
                disabled={props.disabled}
              />
            </label>

            <ApiKeyField
              label={props.provider === 'google' ? 'API Key (Optional)' : 'BYOK API Key'}
              value={props.apiKey}
              onChange={props.onApiKeyChange}
              helpText={props.apiKeyHelpText}
              disabled={props.apiKeyDisabled}
              provider={props.provider}
              placeholder={
                props.provider === 'google'
                  ? 'AIzaSy...'
                  : props.provider === 'openai'
                    ? 'sk-...'
                    : props.provider === 'anthropic'
                      ? 'sk-ant-...'
                      : 'gsk_...'
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
