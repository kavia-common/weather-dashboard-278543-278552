# Supabase Integration Notes

This project integrates Supabase for:
- Email/password authentication
- Favorites per user
- Recent searches per user

Configuration:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_FRONTEND_URL (optional, used for emailRedirectTo)

Tables:
- favorites(id bigint pk, user_id uuid fk -> auth.users, location_name text unique per user, country text, created_at timestamptz)
- recent_searches(id bigint pk, user_id uuid, query text, created_at timestamptz)
Enable RLS on both and use policies allowing users to manage their own rows only.

Security:
- Never hardcode secrets.
- Use "anon" public key for client-side.
- Ensure HTTPS endpoints.

Notes:
- AuthProvider handles session and exposes signIn/signUp/signOut.
- userDataService contains functions to add/remove/list favorites and recent searches.
