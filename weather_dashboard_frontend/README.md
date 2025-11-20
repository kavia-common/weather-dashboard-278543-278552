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
- REACT_APP_API_BASE: Base URL for weather API proxy (e.g., https://api.example.com). If not set, the app uses mocked data.
- REACT_APP_SUPABASE_URL: Supabase project URL (for future integration).
- REACT_APP_SUPABASE_KEY: Supabase anon/public key (for future integration).

Note: Do not commit real values. This repo does not write or read the .env directly beyond process.env at runtime.

## Run
- npm install
- npm start
- npm test

## Architecture
- src/components: UI components (Header, SearchBar, CurrentWeatherCard, ForecastList, ForecastGraph, Sidebar)
- src/services: weatherService (API/mocks), supabaseClient (scaffolding)
- src/utils: debounce and sanitize helpers
- src/theme.css and src/App.css: Theme and layout styles

## API Integration
- When REACT_APP_API_BASE is provided, searches call:
  GET ${REACT_APP_API_BASE}/weather?query=<city>
- Otherwise, mocked data is used (TODO comment included in code).

## Security and Quality
- Input sanitized and debounced
- Network errors handled without leaking stack traces
- No secrets in code; env variables only

## Supabase
Scaffold added in src/services/supabaseClient.js
- TODO: Install supabase-js and initialize client when ready.
