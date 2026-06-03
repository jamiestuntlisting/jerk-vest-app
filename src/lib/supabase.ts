/**
 * Supabase client used for analytics.
 *
 * Reads public config (see config.ts). If it is not set, the client is null and
 * all analytics calls become safe no-ops — the app still works fully.
 */
import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export const analyticsConfigured = !!supabase;
