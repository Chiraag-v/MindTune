'use client';

import { ExplanationPanel } from '@/components/ExplanationPanel';
import { FeedbackButtons } from '@/components/FeedbackButtons';
import { OutputCard } from '@/components/OutputCard';
import { PromptQABox } from '@/components/PromptQABox';
import type { ProviderId } from '@/lib/types';

interface PromptPerfectOutputsProps {
  optimizedText: string;
  explanation: string;
  changes: string;
  sessionId: string;
  mode: string;
  isLoading: boolean;
  provider: ProviderId;
  apiKey: string;
  initialQAMessages?: { role: 'user' | 'assistant'; content: string }[];
  initialFeedback?: { rating?: 'up' | 'down' | null; text?: string };
}

export function PromptPerfectOutputs(props: PromptPerfectOutputsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <OutputCard
          title="Optimized prompt"
          text={props.optimizedText}
          isLoading={props.isLoading}
          emptyText="Your optimized prompt will show up here."
          variant="code"
        />
        <OutputCard
          title="Explanation"
          text={props.explanation}
          isLoading={props.isLoading}
          emptyText="A detailed explanation of the optimized prompt will show up here."
          variant="prose"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <ExplanationPanel explanation={props.changes} />
        </div>
        {props.optimizedText && !props.isLoading && (
          <>
            <div className="w-full">
              <PromptQABox
                key={props.sessionId}
                optimizedPrompt={props.optimizedText}
                explanation={props.explanation}
                provider={props.provider}
                apiKey={props.apiKey}
                initialMessages={props.initialQAMessages}
                sessionId={props.sessionId}
              />
            </div>
            <div className="w-full">
              <FeedbackButtons
                key={props.sessionId}
                sessionId={props.sessionId}
                mode={props.mode}
                disabled={props.isLoading}
                initialRating={props.initialFeedback?.rating}
                initialFeedbackText={props.initialFeedback?.text}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

