/**
 * Supabase client initialization.
 * Reads configuration from environment variables only.
 * No secrets are hardcoded in source code.
 *
 * Note: We guard the import of '@supabase/supabase-js' to avoid build failures
 * in restricted CI environments without the package installed.
 */
let createClient = null;
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  ({ createClient } = require('@supabase/supabase-js'));
} catch (_e) {
  createClient = null;
}

// Read env at module load. Values are injected by CRA at build time.
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

let client = null;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /**
   * Returns a singleton Supabase client if env vars are configured and dep available, otherwise null.
   * Never hardcodes secrets. Uses only REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.
   */
  if (client) return client;
  const url = typeof SUPABASE_URL === 'string' ? SUPABASE_URL.trim() : '';
  const key = typeof SUPABASE_KEY === 'string' ? SUPABASE_KEY.trim() : '';
  if (!url || !key || !createClient) {
    return null;
  }
  client = createClient(url, key, {
    auth: {
      persistSession: true,
      storageKey: 'wd_auth',
      autoRefreshToken: true,
      // For email link flows; harmless for email/password
      detectSessionInUrl: true,
    },
  });
  return client;
}
