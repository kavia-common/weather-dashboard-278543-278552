import React from 'react';
import FavoritesSidebar from './FavoritesSidebar';
import RecentSearches from './RecentSearches';

// PUBLIC_INTERFACE
export default function Sidebar({ current, onSelect }) {
  /**
   * Sidebar with details, favorites, and recent searches.
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

      <div style={{ marginTop: 16 }}>
        <FavoritesSidebar onSelect={onSelect} />
      </div>

      <RecentSearches onSelect={onSelect} />
    </aside>
  );
}
