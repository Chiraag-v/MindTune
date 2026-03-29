import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getSupabaseAdminClient } from '@/lib/client/supabase';

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    // Check if already shared
    const { data: existing } = await supabase
      .from('optimization_logs')
      .select('share_id')
      .eq('session_id', session_id)
      .maybeSingle();

    if (existing?.share_id) {
      return NextResponse.json({ share_id: existing.share_id });
    }

    // Generate new share ID and save
    const share_id = nanoid(10);
    const { error } = await supabase
      .from('optimization_logs')
      .update({ share_id })
      .eq('session_id', session_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ share_id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Request failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
