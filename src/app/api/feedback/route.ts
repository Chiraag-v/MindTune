import type { NextRequest } from 'next/server';

import { getSupabaseAdminClient } from '@/lib/client/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      session_id?: string;
      rating?: string;
      mode?: string;
      feedback_text?: string;
    };

    const sessionId = typeof body.session_id === 'string' ? body.session_id.trim() : '';
    const rating = body.rating === 'up' || body.rating === 'down' ? body.rating : null;
    const feedbackText = typeof body.feedback_text === 'string' ? body.feedback_text.trim() : null;

    if (!sessionId || !rating) {
      return Response.json(
        { error: 'session_id and rating (up|down) are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const updateData: { feedback: string; feedback_text?: string } = { feedback: rating };
      if (feedbackText !== null) {
        updateData.feedback_text = feedbackText;
      }

      const { error } = await supabase
        .from('optimization_logs')
        .update(updateData)
        .eq('session_id', sessionId);

      if (error) {
        console.error('Failed to update feedback:', error);
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Request failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
