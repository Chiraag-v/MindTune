import { getSupabaseAdminClient } from '@/lib/client/supabase';
import { generateText } from 'ai';
import type { NextRequest } from 'next/server';

import {
  getLanguageModel,
  isRetryableProviderError,
  resolveModelList,
  hasServerKey,
} from '@/lib/providers';
import type { ProviderId } from '@/lib/types';

function isProvider(value: unknown): value is ProviderId {
  return (
    value === 'google' ||
    value === 'openai' ||
    value === 'anthropic' ||
    value === 'groq'
  );
}

async function pickFirstWorkingModel(args: {
  provider: ProviderId;
  apiKey?: string;
  system: string;
  prompt: string;
  modelIds: string[];
}): Promise<string> {
  let lastError: unknown = null;
  for (const modelId of args.modelIds) {
    try {
      const model = getLanguageModel(
        { provider: args.provider, model: modelId, apiKey: args.apiKey },
        modelId,
      );

      // Very small preflight call so we can fall back if a model is missing/quota'd.
      await generateText({
        model,
        system: args.system,
        prompt: args.prompt,
        maxOutputTokens: 20,
      });

      return modelId;
    } catch (err) {
      lastError = err;
      if (isRetryableProviderError(err)) continue;
      break;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('No model succeeded');
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      prompt: string;
      explanation: string;
      question: string;
      provider?: ProviderId;
      apiKey?: string;
      session_id?: string;
    };

    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const explanation = typeof body.explanation === 'string' ? body.explanation.trim() : '';
    const question = typeof body.question === 'string' ? body.question.trim() : '';
    const provider: ProviderId = isProvider(body.provider) ? body.provider : 'google';
    const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : undefined;
    const sessionId = typeof body.session_id === 'string' ? body.session_id.trim() : '';

    if (!prompt || !question) {
      return Response.json({ error: 'prompt and question are required' }, { status: 400 });
    }

    // Check if we have a key (either BYOK or server-side)
    const hasKey = apiKey || hasServerKey(provider);
    if (!hasKey) {
      return Response.json(
        {
          error: `Missing API key for ${provider}.`,
        },
        { status: 400 },
      );
    }

    const system = `You are a helpful AI assistant.
Your goal is to answer the user's question about an optimized prompt and its explanation.

Here is the optimized prompt:
${prompt}

Here is the explanation of the changes:
${explanation}

Answer the user's question clearly and concisely.
FORMATTING RULES:
- Use Markdown formatting.
- Use bullet points ("- ") for lists or steps to make it easy to scan.
- Use bold text ("**text**") for key terms or emphasis.
- Separate distinct topics or points with full paragraph breaks (empty lines) to increase readability.
- Keep the layout clean and spacious, similar to how ChatGPT or Gemini formats answers.
- Use lists often. If you have more than 2 related points, make a list.
- Add a blank line before and after every list.
- When explaining code or technical concepts, use code blocks.`;

    const modelIds = resolveModelList({ provider, model: '', apiKey });
    const modelId = await pickFirstWorkingModel({ provider, apiKey, system, prompt: question, modelIds });
    const model = getLanguageModel({ provider, model: modelId, apiKey }, modelId);

    const result = await generateText({
      model,
      system,
      prompt: question,
    });

    if (sessionId) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        // Log user question
        const { error: userError } = await supabase.from('optimization_qa').insert({
          session_id: sessionId,
          role: 'user',
          content: question,
        });
        if (userError) console.error('Failed to log user question:', userError);
        
        // Log assistant answer
        const { error: assistantError } = await supabase.from('optimization_qa').insert({
          session_id: sessionId,
          role: 'assistant',
          content: result.text,
        });
        if (assistantError) console.error('Failed to log assistant answer:', assistantError);
      }
    }

    return Response.json({ answer: result.text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get answer';
    return Response.json({ error: message }, { status: 500 });
  }
}
