import React from 'react';

// PUBLIC_INTERFACE
export default function ForecastList({ title, items, type = 'hourly' }) {
  /**
   * Renders a horizontal list for hourly or daily forecasts.
   */
  const isHourly = type === 'hourly';
  return (
    <section className="card" aria-labelledby={`${type}-title`}>
      <h2 id={`${type}-title`} className="section-title">{title}</h2>
      <div className={isHourly ? 'hourly-list' : 'daily-list'}>
        {(items || []).map((it, idx) => (
          <div className="item" key={idx} aria-label={`${isHourly ? 'Hour' : 'Day'} forecast`}>
            <div style={{ fontWeight: 600 }}>
              {isHourly
                ? new Date(it.time).toLocaleTimeString([], { hour: '2-digit' })
                : new Date(it.date).toLocaleDateString([], { weekday: 'short' })}
            </div>
            <div style={{ fontSize: 24 }}>{it.icon || '⛅'}</div>
            <div style={{ color: '#374151' }}>
              {isHourly ? `${Math.round(it.tempC)}°C` : `${Math.round(it.lowC)}° / ${Math.round(it.highC)}°`}
            </div>
            <div className="footer-note">{it.condition}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
