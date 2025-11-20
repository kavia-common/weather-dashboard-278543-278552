/**
 * Supabase scaffolding for future integration.
 * Reads configuration from environment variables only.
 * No secrets are hardcoded in source code.
 *
 * TODO: Uncomment when supabase-js is added as a dependency and used.
 */

// import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

/**
// PUBLIC_INTERFACE
export function getSupabaseClient() {
  // Validate presence at runtime without throwing sensitive details
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    // Intentionally return null to indicate not configured yet
    return null;
  }
  // return createClient(SUPABASE_URL, SUPABASE_KEY);
  return null; // Placeholder until supabase-js is installed
}
*/
export function getSupabaseClient() {
  return null; // Placeholder
}
