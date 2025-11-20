import React from 'react';

// PUBLIC_INTERFACE
export default function Sidebar({ current }) {
  /**
   * Sidebar with additional stats and placeholders for future features.
   */
  return (
    <aside className="sidebar">
      <div className="card">
        <h2 className="section-title">Details</h2>
        {current ? (
          <>
            <div className="stat"><span>Condition</span><span>{current.condition}</span></div>
            <div className="stat"><span>Feels Like</span><span>{Math.round(current.feelsLikeC)}°C</span></div>
            <div className="stat"><span>Humidity</span><span>{current.humidity}%</span></div>
            <div className="stat"><span>Wind</span><span>{current.windKph} kph</span></div>
          </>
        ) : (
          <div className="footer-note">Search a city to view details.</div>
        )}
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h2 className="section-title">Integrations</h2>
        <div className="footer-note">
          TODO: Supabase integration for favorites and history. Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY are set.
        </div>
      </div>
    </aside>
  );
}
