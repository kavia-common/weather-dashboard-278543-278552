 /**
  * Weather service that supports both:
  * - Backend proxy via REACT_APP_API_BASE (preferred for security)
  * - Direct 3rd-party API call (OpenWeatherMap by default) when proxy not provided
  * 
  * Env vars:
  * - REACT_APP_API_BASE: backend proxy base URL (if set, always used)
  * - REACT_APP_WEATHER_API_BASE: direct API base (defaults to https://api.openweathermap.org)
  * - REACT_APP_WEATHER_API_KEY: API key for direct API mode (required if no proxy)
  * 
  * No secrets are hardcoded. Inputs are sanitized.
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

// Map OpenWeatherMap response to our UI view model
function mapOwmToViewModel(owmCurrent, owmLocationName, countryCode) {
  if (!owmCurrent || !owmCurrent.main) return { location: null, current: null, hourly: [], daily: [] };
  const weather = Array.isArray(owmCurrent.weather) && owmCurrent.weather[0] ? owmCurrent.weather[0] : {};
  const wind = owmCurrent.wind || {};
  const toC = (k) => (typeof k === 'number' ? Math.round(k - 273.15) : null);
  return {
    location: { name: owmLocationName || '', country: countryCode || '' },
    current: {
      tempC: toC(owmCurrent.main.temp),
      humidity: owmCurrent.main.humidity ?? null,
      windKph: typeof wind.speed === 'number' ? Math.round(wind.speed * 3.6) : null, // m/s -> kph
      feelsLikeC: toC(owmCurrent.main.feels_like),
      condition: weather.description ? `${weather.description[0].toUpperCase()}${weather.description.slice(1)}` : '—',
      icon: weather.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : '⛅',
      updatedAt: new Date().toISOString(),
    },
    hourly: [],
    daily: [],
  };
}

async function fetchViaProxy(cleaned) {
  const base = process.env.REACT_APP_API_BASE;
  const url = buildUrl(base, '/weather', { query: cleaned });
  const data = await safeFetch(url, { headers: { Accept: 'application/json' } }, 10000);
  return mapToViewModel(data);
}

async function fetchViaOpenWeather(cleaned) {
  const directBase = process.env.REACT_APP_WEATHER_API_BASE || 'https://api.openweathermap.org';
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('API key missing');
  }
  // Fetch current weather by city name
  const url = buildUrl(directBase, '/data/2.5/weather', { q: cleaned, appid: apiKey });
  const data = await safeFetch(url, { headers: { Accept: 'application/json' } }, 10000);
  if (!data || data.cod === '404' || data.cod === 404) {
    const err = new Error('City not found');
    err.code = 'CITY_NOT_FOUND';
    throw err;
  }
  const country = data?.sys?.country || '';
  const name = data?.name || cleaned;
  return mapOwmToViewModel(data, name, country);
}

// PUBLIC_INTERFACE
export async function fetchWeather(query) {
  /**
   * Fetch weather data by location query.
   * - If REACT_APP_API_BASE is set, uses proxy: `${REACT_APP_API_BASE}/weather?query=<city>`
   * - Otherwise, calls OpenWeatherMap directly using REACT_APP_WEATHER_API_KEY
   * 
   * Errors are generic; city-not-found errors are identified to show friendly UI messages.
   */
  const cleaned = sanitizeQuery(query || '');
  if (!cleaned) {
    return { location: null, current: null, hourly: [], daily: [] };
  }
  const hasProxy = !!(process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim());
  try {
    return hasProxy ? await fetchViaProxy(cleaned) : await fetchViaOpenWeather(cleaned);
  } catch (e) {
    if (e && (e.code === 'CITY_NOT_FOUND' || /city not found/i.test(String(e.message)))) {
      const err = new Error('CITY_NOT_FOUND');
      err.code = 'CITY_NOT_FOUND';
      throw err;
    }
    throw new Error('Failed to fetch weather data');
  }
}

/**
 * PUBLIC_INTERFACE
 * fetchWeatherCurrent - For split backend routes; falls back to direct OWM current if no proxy.
 */
export async function fetchWeatherCurrent(query) {
  const cleaned = sanitizeQuery(query || '');
  if (!cleaned) return null;
  const hasProxy = !!(process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim());
  if (hasProxy) {
    const url = buildUrl(process.env.REACT_APP_API_BASE, '/weather/current', { query: cleaned });
    const data = await safeFetch(url, { headers: { Accept: 'application/json' } }, 8000);
    return data?.current || null;
  }
  const vm = await fetchViaOpenWeather(cleaned);
  return vm.current;
}

/**
 * PUBLIC_INTERFACE
 * fetchWeatherHourly - If proxy exists call it; otherwise return empty (OWM hourly requires OneCall and coordinates).
 */
export async function fetchWeatherHourly(query) {
  const cleaned = sanitizeQuery(query || '');
  if (!cleaned) return [];
  const hasProxy = !!(process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim());
  if (!hasProxy) return []; // keep simple direct mode
  const url = buildUrl(process.env.REACT_APP_API_BASE, '/weather/hourly', { query: cleaned });
  const data = await safeFetch(url, { headers: { Accept: 'application/json' } }, 8000);
  return Array.isArray(data?.hourly) ? data.hourly : [];
}

/**
 * PUBLIC_INTERFACE
 * fetchWeatherDaily - If proxy exists call it; otherwise return empty (OWM daily requires OneCall and coordinates).
 */
export async function fetchWeatherDaily(query) {
  const cleaned = sanitizeQuery(query || '');
  if (!cleaned) return [];
  const hasProxy = !!(process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim());
  if (!hasProxy) return [];
  const url = buildUrl(process.env.REACT_APP_API_BASE, '/weather/daily', { query: cleaned });
  const data = await safeFetch(url, { headers: { Accept: 'application/json' } }, 8000);
  return Array.isArray(data?.daily) ? data.daily : [];
}
