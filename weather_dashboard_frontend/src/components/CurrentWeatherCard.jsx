import React from 'react';

// PUBLIC_INTERFACE
export default function CurrentWeatherCard({ location, current, loading, error }) {
  /**
   * Displays current conditions.
   * Shows loading and error states accessibly.
   */
  if (loading) {
    return <div className="card loading" role="status" aria-live="polite">Loading current conditions…</div>;
  }
  if (error) {
    return <div className="card alert" role="alert">Unable to load current conditions.</div>;
  }
  if (!current) {
    return <div className="card">Search a city to see current weather.</div>;
  }

  return (
    <section className="card current-card" aria-labelledby="current-title">
      <div>
        <h2 id="current-title" className="section-title">Current Conditions</h2>
        <div className="current-temp" data-testid="current-temp">
          {current.icon || '⛅'} {Math.round(current.tempC)}°C
        </div>
        <div className="meta">
          <span className="badge" title="Feels like">Feels like {Math.round(current.feelsLikeC)}°C</span>
          <span style={{ marginLeft: 8 }}>Humidity: {current.humidity}%</span>
          <span style={{ marginLeft: 8 }}>Wind: {current.windKph} kph</span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 600 }}>{location?.name || '—'}</div>
        <div style={{ color: '#6b7280' }}>{location?.country || ''}</div>
        <div className="footer-note">Updated {new Date(current.updatedAt).toLocaleTimeString()}</div>
      </div>
    </section>
  );
}
