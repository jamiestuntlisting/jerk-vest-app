/**
 * Supabase client used for analytics logging.
 *
 * Configuration is read from public env vars (EXPO_PUBLIC_*) so the same code
 * runs on web (Vercel) and native. If the vars are not set the client is null
 * and all analytics calls become safe no-ops — the app still works fully.
 */
import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export const analyticsConfigured = !!supabase;

/** URL of the token-gated edge function that returns the /admin summary. */
export const ANALYTICS_FN_URL = process.env.EXPO_PUBLIC_ANALYTICS_FN_URL ?? '';
