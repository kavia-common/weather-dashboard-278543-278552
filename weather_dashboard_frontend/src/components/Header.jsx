import React from 'react';
import SearchBar from './SearchBar';

// PUBLIC_INTERFACE
export default function Header({ onSearch, statusMessage }) {
  /** Header containing branding and the search bar */
  return (
    <header className="header" role="banner">
      <div className="container header-inner">
        <div className="brand" aria-label="Weather Dashboard">
          <div className="brand-badge" aria-hidden="true">🌊</div>
          <span>Ocean Weather</span>
        </div>
        <SearchBar onSearch={onSearch} />
        <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: -9999 }}>
          {statusMessage}
        </div>
      </div>
    </header>
  );
}
