'use client';

import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/client/supabase';

/**
 * Email shown in the UI after auth confirms on the server. `session.user.email`
 * can stay on the old address until the JWT is refreshed; `getUser()` returns
 * the current row from Auth, so we re-fetch on auth events and when the tab
 * becomes visible again (e.g. user confirmed in another window).
 */
export function useAuthUserEmail(session: Session) {
  const [email, setEmail] = useState(() => session.user.email ?? '');

  useEffect(() => {
    setEmail(session.user.email ?? '');
  }, [session.user.email, session.user.id]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const pull = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user?.email) return;
      setEmail(user.email);
    };

    void pull();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED' ||
        event === 'SIGNED_IN' ||
        event === 'INITIAL_SESSION'
      ) {
        void pull();
      }
    });

    const onVisible = () => {
      if (document.visibilityState === 'visible') void pull();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', pull);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', pull);
    };
  }, [session.user.id]);

  return email;
}
