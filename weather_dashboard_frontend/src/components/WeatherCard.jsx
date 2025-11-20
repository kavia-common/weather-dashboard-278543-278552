import React from 'react';

// PUBLIC_INTERFACE
export default function WeatherCard({ city, country, temperatureC, condition, humidity, windKph, icon, updatedAt }) {
  /**
   * Displays a compact current weather card.
   * Props:
   * - city, country
   * - temperatureC, condition, humidity, windKph
   * - icon (emoji or URL), updatedAt ISO string
   */
  return (
    <section className="card current-card" aria-label="Current weather">
      <div>
        <h2 className="section-title">Weather</h2>
        <div className="current-temp">
          {icon ? (String(icon).startsWith('http') ? <img src={icon} alt="" style={{ height: 40, verticalAlign: 'middle' }} /> : icon) : '⛅'}{' '}
          {typeof temperatureC === 'number' ? `${Math.round(temperatureC)}°C` : '—'}
        </div>
        <div className="meta">
          <span className="badge">{condition || '—'}</span>
          <span style={{ marginLeft: 8 }}>Humidity: {humidity ?? '—'}%</span>
          <span style={{ marginLeft: 8 }}>Wind: {windKph ?? '—'} kph</span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 600 }}>{city || '—'}</div>
        <div className="footer-note">{country || ''}</div>
        {updatedAt && <div className="footer-note">Updated {new Date(updatedAt).toLocaleTimeString()}</div>}
      </div>
    </section>
  );
}
