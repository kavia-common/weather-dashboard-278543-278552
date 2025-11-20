 /**
  * Weather service for fetching current conditions and forecasts through a backend proxy.
  * Uses REACT_APP_API_BASE; includes robust timeout/abort handling and sanitized inputs.
  * No secrets are hardcoded. Requires backend proxy to be configured.
  */

import { sanitizeQuery, safeFetch } from '../utils';

/**
 * Normalize base URL by removing trailing slashes.
 */
function normalizeBase(base) {
  return String(base || '').replace(/\/*$/, '');
}

/**
 * Build a URL with query params safely encoded.
 */
function buildUrl(base, path, params = {}) {
  const u = new URL(`${normalizeBase(base)}${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      u.searchParams.set(k, String(v));
    }
  });
  return u.toString();
}

/**
 * Shape the backend response into the UI model if needed.
 * If backend already matches, this will pass-through safely.
 */
function mapToViewModel(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload');
  }

  const location = payload.location || null;
  const current = payload.current || null;
  const hourly = Array.isArray(payload.hourly) ? payload.hourly : [];
  const daily = Array.isArray(payload.daily) ? payload.daily : [];

  return { location, current, hourly, daily };
}

// PUBLIC_INTERFACE
export async function fetchWeather(query) {
  /**
   * Fetch weather data by location query using backend proxy.
   * - Calls `${REACT_APP_API_BASE}/weather?query=<city>`
   * - Gracefully handles network errors/timeouts by throwing a generic error message.
   * Note: This function no longer returns mock/demo data. Ensure REACT_APP_API_BASE is set.
   */
  const base = process.env.REACT_APP_API_BASE;
  const cleaned = sanitizeQuery(query || '');
  if (!cleaned) {
    // Return an empty structure to clear UI when query is empty.
    return { location: null, current: null, hourly: [], daily: [] };
  }

  if (!base || base.trim() === '') {
    // Explicitly fail if not configured, rather than using mock data.
    // The UI will show a friendly error message.
    throw new Error('API base not configured');
  }

  const url = buildUrl(base, '/weather', { query: cleaned });

  try {
    // Use safeFetch to enforce timeout/abort and standardized error handling
    const data = await safeFetch(url, { headers: { Accept: 'application/json' } }, 10000);
    return mapToViewModel(data);
  } catch (_e) {
    // Never leak internal details
    throw new Error('Failed to fetch weather data');
  }
}

/**
 * PUBLIC_INTERFACE
 * fetchWeatherCurrent - Optional helper for current-only endpoint if backend splits routes.
 */
export async function fetchWeatherCurrent(query) {
  const base = process.env.REACT_APP_API_BASE;
  const cleaned = sanitizeQuery(query || '');
  if (!cleaned) return null;
  if (!base || base.trim() === '') throw new Error('API base not configured');

  const url = buildUrl(base, '/weather/current', { query: cleaned });
  try {
    const data = await safeFetch(url, { headers: { Accept: 'application/json' } }, 8000);
    return data?.current || null;
  } catch {
    throw new Error('Failed to fetch current conditions');
  }
}

/**
 * PUBLIC_INTERFACE
 * fetchWeatherHourly - Optional helper for hourly endpoint if backend splits routes.
 */
export async function fetchWeatherHourly(query) {
  const base = process.env.REACT_APP_API_BASE;
  const cleaned = sanitizeQuery(query || '');
  if (!cleaned) return [];
  if (!base || base.trim() === '') throw new Error('API base not configured');

  const url = buildUrl(base, '/weather/hourly', { query: cleaned });
  try {
    const data = await safeFetch(url, { headers: { Accept: 'application/json' } }, 8000);
    return Array.isArray(data?.hourly) ? data.hourly : [];
  } catch {
    throw new Error('Failed to fetch hourly forecast');
  }
}

/**
 * PUBLIC_INTERFACE
 * fetchWeatherDaily - Optional helper for daily endpoint if backend splits routes.
 */
export async function fetchWeatherDaily(query) {
  const base = process.env.REACT_APP_API_BASE;
  const cleaned = sanitizeQuery(query || '');
  if (!cleaned) return [];
  if (!base || base.trim() === '') throw new Error('API base not configured');

  const url = buildUrl(base, '/weather/daily', { query: cleaned });
  try {
    const data = await safeFetch(url, { headers: { Accept: 'application/json' } }, 8000);
    return Array.isArray(data?.daily) ? data.daily : [];
  } catch {
    throw new Error('Failed to fetch daily forecast');
  }
}
