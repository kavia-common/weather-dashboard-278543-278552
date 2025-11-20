import React from 'react';

// PUBLIC_INTERFACE
export default function Spinner({ label = 'Loading…' }) {
  /** Accessible spinner using ARIA with Ocean Professional styling */
  return (
    <div role="status" aria-live="polite" className="loading" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <circle cx="12" cy="12" r="10" stroke="rgba(37,99,235,0.25)" strokeWidth="4" fill="none" />
        <path d="M22 12a10 10 0 0 1-10 10" stroke="rgba(37,99,235,0.9)" strokeWidth="4" fill="none" />
      </svg>
      <span>{label}</span>
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </div>
  );
}
