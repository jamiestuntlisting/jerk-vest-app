/**
 * Public, client-safe runtime config.
 *
 * EXPO_PUBLIC_* env vars win when present (local dev or other hosts). Otherwise
 * the committed defaults below are used — necessary because the Vercel build in
 * this setup cannot read project env vars.
 *
 * ONLY public values belong here. The Supabase anon/publishable key is designed
 * to be embedded in clients and is restricted by RLS to INSERT-only. The admin
 * token is NEVER here — it lives only inside the database.
 */
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Optional looping muted background video for the menu. */
export const BG_VIDEO_URL = process.env.EXPO_PUBLIC_BG_VIDEO_URL ?? '';
/** Optional menu audio loop (stays OFF until the user toggles it). */
export const MENU_AUDIO_URL = process.env.EXPO_PUBLIC_MENU_AUDIO_URL ?? '';

/** Optional headshot photos for the About page. Empty = initials avatars. */
export const HEADSHOT_NICK_URL = process.env.EXPO_PUBLIC_HEADSHOT_NICK_URL ?? '';
export const HEADSHOT_JAMIE_URL = process.env.EXPO_PUBLIC_HEADSHOT_JAMIE_URL ?? '';
