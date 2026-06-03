/**
 * Lightweight, fire-and-forget analytics.
 *
 * - Writes go directly to Supabase via the anon key (RLS allows insert-only).
 * - Reads (the /admin dashboard) go through a token-gated edge function so the
 *   raw data is never exposed to the public anon key.
 * - Every call is wrapped so analytics can never break the UI.
 */
import { Platform } from 'react-native';
import { supabase } from './supabase';

function rand() {
  return (
    Math.random().toString(36).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}

let memSession: string | null = null;

/** Stable id for a visit. Persisted on web, per-process on native. */
function sessionId(): string {
  if (memSession) return memSession;
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      let s = localStorage.getItem('jv_sid');
      if (!s) {
        s = rand();
        localStorage.setItem('jv_sid', s);
      }
      memSession = s;
      return s;
    }
  } catch {
    /* ignore storage errors */
  }
  memSession = rand();
  return memSession;
}

function webContext() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return { path: undefined, referrer: undefined, userAgent: undefined };
  }
  return {
    path: window.location?.pathname,
    referrer: document?.referrer || undefined,
    userAgent: navigator?.userAgent,
  };
}

export type TrackOpts = {
  path?: string;
  label?: string;
  meta?: Record<string, unknown>;
};

/** Record an event. Never throws, never blocks the caller. */
export function track(eventType: string, opts: TrackOpts = {}): void {
  if (!supabase) return;
  const ctx = webContext();
  const row = {
    event_type: eventType,
    path: opts.path ?? ctx.path ?? null,
    label: opts.label ?? null,
    session_id: sessionId(),
    referrer: ctx.referrer ?? null,
    user_agent: ctx.userAgent ?? null,
    platform: Platform.OS,
    meta: opts.meta ?? null,
  };
  // Fire and forget.
  void supabase
    .from('analytics_events')
    .insert(row)
    .then(({ error }) => {
      if (error && __DEV__) console.warn('[analytics]', error.message);
    });
}

export type AnalyticsSummary = {
  generatedAt: string;
  totals: { events: number; pageViews: number; sessions: number; outboundClicks: number };
  byPath: { path: string; views: number }[];
  byEvent: { event_type: string; count: number }[];
  topTiles: { label: string; count: number }[];
  daily: { day: string; views: number; sessions: number }[];
  recent: { created_at: string; event_type: string; path: string | null; label: string | null }[];
};

/**
 * Fetch the dashboard summary. Calls the token-gated `analytics_summary` RPC
 * with the public anon key; the token is verified server-side, so a wrong token
 * returns no data.
 */
export async function fetchAnalytics(token: string): Promise<AnalyticsSummary> {
  if (!supabase) throw new Error('NOT_CONFIGURED');
  const { data, error } = await supabase.rpc('analytics_summary', { p_token: token });
  if (error) throw new Error('REQUEST_FAILED');
  if (!data || (data as { error?: string }).error) throw new Error('UNAUTHORIZED');
  return data as AnalyticsSummary;
}
