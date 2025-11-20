# Weather Dashboard (Ocean Professional)

Interactive weather UI built with React, using a modern Ocean Professional theme.

## Features
- Header with debounced location search
- Current conditions card
- Hourly and 7-day forecast sections
- Lightweight temperature trend chart (Canvas)
- Responsive layout with sidebar (visible on large screens)
- Accessible loading/error states (ARIA live)
- Supabase integration scaffolding (future)
- Environment-variable based configuration (no secrets hardcoded)

## Environment Variables
Provide these in your `.env`:
- REACT_APP_API_BASE: Base URL for weather API proxy (e.g., https://api.example.com). Required for live data.
- REACT_APP_SUPABASE_URL: Supabase project URL (for future integration).
- REACT_APP_SUPABASE_KEY: Supabase anon/public key (for future integration).

Note: Do not commit real values. This repo does not write or read the .env directly beyond process.env at runtime.

Example `.env`:
REACT_APP_API_BASE=https://your-backend.example.com

## Run
- npm install
- npm start
- npm test

## Architecture
- src/components: UI components (Header, SearchBar, CurrentWeatherCard, ForecastList, ForecastGraph, Sidebar)
- src/services: weatherService (API integration), supabaseClient (scaffolding)
- src/utils: debounce, sanitizeQuery, safeFetch (with timeouts)
- src/theme.css and src/App.css: Theme and layout styles

## API Integration
The frontend calls a backend proxy derived from `REACT_APP_API_BASE`.

Primary endpoint:
- GET `${REACT_APP_API_BASE}/weather?query=<city>`

Optional split endpoints (if your backend exposes them):
- GET `${REACT_APP_API_BASE}/weather/current?query=<city>`
- GET `${REACT_APP_API_BASE}/weather/hourly?query=<city>`
- GET `${REACT_APP_API_BASE}/weather/daily?query=<city>`

Expected response shape for the primary endpoint:
```
{
  "location": { "name": "Seattle", "country": "USA" },
  "current": {
    "tempC": 21,
    "humidity": 58,
    "windKph": 12,
    "condition": "Partly Cloudy",
    "icon": "⛅",
    "feelsLikeC": 22,
    "updatedAt": "2024-01-01T12:00:00Z"
  },
  "hourly": [
    { "time": "2024-01-01T13:00:00Z", "tempC": 20, "condition": "Cloudy", "icon": "☁️" }
  ],
  "daily": [
    { "date": "2024-01-02", "lowC": 12, "highC": 18, "condition": "Sunny", "icon": "☀️" }
  ]
}
```

Notes:
- Inputs are sanitized in the UI before requesting.
- Requests include timeouts and use AbortController under the hood (`safeFetch`).
- Errors are handled gracefully with generic messages; no internal details are exposed.

## Security and Quality
- Input sanitized and debounced
- Network errors handled without leaking stack traces
- No secrets in code; env variables only
- Use HTTPS for all endpoints in production

## Supabase
Scaffold added in src/services/supabaseClient.js
- TODO: Install supabase-js and initialize client when ready.
