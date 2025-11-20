# Supabase Integration Notes

This project includes scaffolding for future Supabase usage:
- src/services/supabaseClient.js exposes getSupabaseClient() placeholder and reads configuration from env vars:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_KEY

To enable Supabase:
1. Install dependency:
   npm install @supabase/supabase-js
2. Uncomment createClient usage in supabaseClient.js.
3. Use the client for features like:
   - Saving favorite locations
   - Recent search history
   - User preferences

Security:
- Never hardcode secrets.
- Use "anon" public key for client-side.
- Ensure HTTPS endpoints.

Backend:
- No backend integration is required for Supabase usage, but you can add an API gateway if needed for controlled features.
