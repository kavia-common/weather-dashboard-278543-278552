/**
 * Weather service for fetching current conditions and forecasts.
 * Uses REACT_APP_API_BASE when provided; otherwise returns mocked data.
 * No secrets are hardcoded. For real backend integration, set REACT_APP_API_BASE.
 */

// PUBLIC_INTERFACE
export async function fetchWeather(query) {
  /**
   * Fetch weather data by location query.
   * - If process.env.REACT_APP_API_BASE exists, calls `${base}/weather?query=<query>`
   * - Otherwise, returns mocked data.
   */
  const base = process.env.REACT_APP_API_BASE;
  const clean = encodeURIComponent(query);

  if (base && base.trim() !== '') {
    const url = `${base.replace(/\/+$/, '')}/weather?query=${clean}`;
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) {
      throw new Error(`Weather API error: ${res.status}`);
    }
    return res.json();
  }

  // TODO: Replace with backend integration via REACT_APP_API_BASE once available.
  // Mocked data structure for UI scaffolding
  const now = new Date();
  const hours = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getTime() + i * 3600 * 1000);
    return {
      time: d.toISOString(),
      tempC: 17 + Math.round(Math.sin(i / 2) * 5),
      condition: i % 3 === 0 ? 'Sunny' : i % 3 === 1 ? 'Cloudy' : 'Rain',
      icon: i % 3 === 0 ? '☀️' : i % 3 === 1 ? '☁️' : '🌧️',
    };
  });

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now.getTime() + i * 86400 * 1000);
    const baseT = 18 + Math.round(Math.sin(i) * 3);
    return {
      date: d.toISOString().slice(0, 10),
      highC: baseT + 4,
      lowC: baseT - 3,
      condition: i % 2 === 0 ? 'Partly Cloudy' : 'Sunny',
      icon: i % 2 === 0 ? '⛅' : '☀️',
    };
  });

  return Promise.resolve({
    location: { name: query || 'Sample City', country: 'Sampleland' },
    current: {
      tempC: 21,
      humidity: 58,
      windKph: 12,
      condition: 'Partly Cloudy',
      icon: '⛅',
      feelsLikeC: 22,
      updatedAt: now.toISOString(),
    },
    hourly: hours,
    daily: days,
  });
}
