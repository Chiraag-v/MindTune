import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;
let adminCached: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  
  if (!url || !anonKey) {
    console.warn('Supabase credentials missing');
    return null;
  }

  // Debug log to verify URL is loaded
  if (typeof window !== 'undefined' && !cached) {
    console.log('Initializing Supabase client with URL:', url);
  }

  cached = createClient(url, anonKey, {
    auth: {
      // Default 10s is too tight with Turbopack/HMR + multiple tabs (Navigator LockManager contention).
      lockAcquireTimeout: 60_000,
    },
  });
  return cached;
}

/** Server-only: uses service role key, bypasses RLS. Use for trusted server operations. */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (adminCached) return adminCached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) return null;

  adminCached = createClient(url, serviceRoleKey);
  return adminCached;
}

