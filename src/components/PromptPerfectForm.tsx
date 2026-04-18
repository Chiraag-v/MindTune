'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { ApiKeyField } from '@/components/ApiKeyField';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Select } from '@/components/Select';
import type { Mode, OptimizeVersion, ProviderId } from '@/lib/types';

const MODE_OPTIONS: Array<{ value: Mode; label: string }> = [
  { value: 'developer',   label: 'Developer' },
  { value: 'beginner',    label: 'Beginner' },
  { value: 'specific',    label: 'Specific' },
  { value: 'step-by-step',label: 'Step-by-step' },
];

const PROVIDER_OPTIONS: Array<{ value: ProviderId; label: string }> = [
  { value: 'google',    label: 'Gemini 2.5 Flash (Default)' },
  { value: 'openai',    label: 'ChatGPT' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'groq',      label: 'Llama' },
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
    <div className="grid grid-cols-1 gap-5">
      <SegmentedControl
        label="Mode"
        value={props.mode}
        onChange={props.onModeChange}
        options={MODE_OPTIONS}
        disabled={props.disabled}
      />

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 px-3 py-1.5 text-xs font-semibold text-zinc-400 backdrop-blur transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/8 hover:text-violet-400 dark:border-zinc-800/60 dark:bg-zinc-950/30"
      >
        {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        {showAdvanced ? 'Hide' : 'Show'} advanced
      </button>

      {showAdvanced && (
        <div className="overflow-hidden rounded-2xl border border-white/6 bg-white/3 p-4 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/30">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
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
                props.provider === 'google'    ? 'AIzaSy...' :
                props.provider === 'openai'    ? 'sk-...' :
                props.provider === 'anthropic' ? 'sk-ant-...' : 'gsk_...'
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
