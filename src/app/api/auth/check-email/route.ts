import { type NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/client/supabase';

/**
 * POST /api/auth/check-email
 * Body: { email: string; currentUserId: string }
 * Returns: { exists: boolean }
 *
 * Uses the service-role client to check whether an email is already
 * registered in auth.users (excluding the requesting user themselves).
 */
export async function POST(req: NextRequest) {
  try {
    const { email, currentUserId } = await req.json() as {
      email: string;
      currentUserId: string;
    };

    if (!email || !currentUserId) {
      return NextResponse.json({ error: 'email and currentUserId are required' }, { status: 400 });
    }

    const admin = getSupabaseAdminClient();
    if (!admin) {
      return NextResponse.json({ error: 'Admin client not configured' }, { status: 500 });
    }

    // List all users and find one with the matching email that isn't the current user.
    // This is fine for small–medium user bases; for large apps add a DB index + RPC.
    let page = 1;
    const perPage = 1000;
    let found = false;

    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
      if (error) throw error;

      const match = data.users.find(
        (u) =>
          u.email?.toLowerCase() === email.toLowerCase() &&
          u.id !== currentUserId,
      );

      if (match) { found = true; break; }

      // If we got fewer results than the page size, we've reached the end.
      if (data.users.length < perPage) break;
      page += 1;
    }

    return NextResponse.json({ exists: found });
  } catch (err) {
    console.error('check-email error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
