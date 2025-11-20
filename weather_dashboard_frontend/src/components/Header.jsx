import React, { useState } from 'react';
import SearchBar from './SearchBar';
import { useAuth } from '../auth/AuthProvider';
import SignOutButton from './auth/SignOutButton';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';

// PUBLIC_INTERFACE
export default function Header({ onSearch, statusMessage }) {
  /** Header containing branding, search bar, and auth controls */
  const { user } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  return (
    <header className="header" role="banner">
      <div className="container header-inner">
        <div className="brand" aria-label="Weather Dashboard">
          <div className="brand-badge" aria-hidden="true">🌊</div>
          <span>Ocean Weather</span>
        </div>
        <SearchBar onSearch={onSearch} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {user ? (
            <>
              <span className="footer-note" aria-label="Signed in user email">{user.email}</span>
              <SignOutButton />
            </>
          ) : (
            <details>
              <summary className="btn" aria-label="Open authentication panel">Account</summary>
              <div style={{ display: 'grid', gap: 12, marginTop: 8, minWidth: 260 }}>
                {showSignup ? <SignUp /> : <SignIn />}
                <button className="btn" onClick={() => setShowSignup((s) => !s)}>
                  {showSignup ? 'Have an account? Sign in' : 'Create account'}
                </button>
              </div>
            </details>
          )}
        </div>
        <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: -9999 }}>
          {statusMessage}
        </div>
      </div>
    </header>
  );
}
