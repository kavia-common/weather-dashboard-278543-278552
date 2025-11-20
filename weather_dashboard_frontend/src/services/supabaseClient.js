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

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

let client = null;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /** Returns a singleton Supabase client if env vars are configured and dep available, otherwise null. */
  if (client) return client;
  if (!SUPABASE_URL || !SUPABASE_KEY || !createClient) {
    return null;
  }
  client = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      storageKey: 'wd_auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}
