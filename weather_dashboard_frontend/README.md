# Weather Dashboard (Ocean Professional)

Interactive weather UI built with React, using a modern Ocean Professional theme.

## Features
- Header with debounced location search
- Current conditions card and compact WeatherCard
- Hourly and 7-day forecast sections
- Lightweight temperature trend chart (Canvas)
- Responsive layout with sidebar (visible on large screens)
- Accessible loading/error states (ARIA live)
- Supabase authentication (email/password), favorites, and recent searches
- Environment-variable based configuration (no secrets hardcoded)

## Environment Variables
Provide these in your `.env`:

Required for at least one mode:
- Proxy mode (recommended):
  - REACT_APP_API_BASE: Base URL for your backend weather proxy (e.g., https://api.example.com)
- Direct API mode (fallback when no proxy):
  - REACT_APP_WEATHER_API_KEY: Your weather API key (OpenWeatherMap by default)
  - REACT_APP_WEATHER_API_BASE: Weather API base (optional; defaults to https://api.openweathermap.org)

Supabase (optional for auth/favorites/history):
- REACT_APP_SUPABASE_URL: Supabase project URL.
- REACT_APP_SUPABASE_KEY: Supabase anon/public key.
- REACT_APP_FRONTEND_URL: The deployed site URL used for emailRedirectTo (optional; defaults to window.location.origin in browser).

Note: Do not commit real values. This repo does not write or read the `.env` directly beyond `process.env` at runtime.

Example `.env` (Proxy mode):
REACT_APP_API_BASE=https://your-backend.example.com
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
REACT_APP_SUPABASE_KEY=YOUR-ANON-PUBLIC-KEY
REACT_APP_FRONTEND_URL=https://your-frontend.example.com

Example `.env` (Direct API mode):
REACT_APP_WEATHER_API_KEY=YOUR_OPENWEATHERMAP_KEY
# Optional override:
# REACT_APP_WEATHER_API_BASE=https://api.openweathermap.org

## Run
- npm install
  - If your environment restricts network access, ensure the following packages are available: @supabase/supabase-js, @testing-library/react-hooks (dev). The app guards Supabase initialization; without the package, auth/favorites/history are disabled gracefully.
- npm start
- npm test

## API Integration
The frontend prefers a backend proxy derived from `REACT_APP_API_BASE`.

Primary proxy endpoint:
- GET `${REACT_APP_API_BASE}/weather?query=<city>`

Optional split endpoints (if your backend exposes them):
- GET `${REACT_APP_API_BASE}/weather/current?query=<city>`
- GET `${REACT_APP_API_BASE}/weather/hourly?query=<city>`
- GET `${REACT_APP_API_BASE}/weather/daily?query=<city>`

Direct API (fallback when no proxy):
- Defaults to OpenWeatherMap "Current weather data" endpoint:
  - GET `https://api.openweathermap.org/data/2.5/weather?q=<city>&appid=<REACT_APP_WEATHER_API_KEY>`
- Only current conditions are mapped in direct mode; hourly/daily arrays are empty unless proxy provides them.

Expected view model shape (UI expects this):
```
{
  "location": { "name": "Seattle", "country": "USA" },
  "current": {
    "tempC": 21,
    "humidity": 58,
    "windKph": 12,
    "condition": "Partly Cloudy",
    "icon": "⛅ or URL",
    "feelsLikeC": 22,
    "updatedAt": "2024-01-01T12:00:00Z"
  },
  "hourly": [...],
  "daily": [...]
}
```

## Security and Quality
- Inputs sanitized and debounced
- Timeouts and aborts for fetches
- Graceful error handling: generic messages; specific "City not found" when applicable
- No secrets in code; env variables only
- Use HTTPS for all endpoints in production

## Supabase Setup
1. In your Supabase project, under Authentication -> Settings, ensure email/password sign-in is enabled.
2. Create the following tables with Row Level Security (RLS) ON and appropriate policies:

SQL (run in Supabase SQL editor):
```sql
-- favorites table
create table if not exists public.favorites (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  location_name text not null,
  country text default ''::text,
  created_at timestamptz not null default now(),
  unique (user_id, location_name)
);

-- recent_searches table
create table if not exists public.recent_searches (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  query text not null,
  created_at timestamptz not null default now()
);

-- RLS policies
alter table public.favorites enable row level security;
alter table public.recent_searches enable row level security;

-- only owner can manage own favorites
create policy "favorites_select_own" on public.favorites for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on public.favorites for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on public.favorites for delete using (auth.uid() = user_id);

-- only owner can manage own recent searches
create policy "recent_select_own" on public.recent_searches for select using (auth.uid() = user_id);
create policy "recent_insert_own" on public.recent_searches for insert with check (auth.uid() = user_id);
create policy "recent_delete_own" on public.recent_searches for delete using (auth.uid() = user_id);
```

3. Add your project's URL and anon key to `.env` as shown above.
4. Start the app and use the Account panel in the header to sign up/sign in.

## Architecture
- src/components: UI components (Header, SearchBar, CurrentWeatherCard, WeatherCard, ForecastList, ForecastGraph, Sidebar, Spinner)
- src/components/auth: SignIn, SignUp, SignOutButton
- src/services: weatherService (API integration), supabaseClient (Supabase client), userDataService (favorites/recent)
- src/auth: AuthProvider for session handling
- src/utils: debounce, sanitizeQuery, safeFetch (with timeouts)
- src/theme.css and src/App.css: Theme and layout styles

## Testing
- Minimal tests cover AuthProvider shape and utility behaviors, including session init and sign-out transitions.
- Run: `npm test`
