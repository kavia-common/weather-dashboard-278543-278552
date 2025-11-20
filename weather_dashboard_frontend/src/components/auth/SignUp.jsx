import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';

// PUBLIC_INTERFACE
export default function SignUp() {
  /** Simple email/password sign-up with basic sanitization. */
  const { signUp, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const siteUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
    await signUp(email, password, siteUrl);
  };

  return (
    <form onSubmit={submit} aria-label="Sign up form" className="card" style={{ width: '100%' }}>
      <h2 className="section-title">Create account</h2>
      {error && <div className="alert" role="alert">{error}</div>}
      <div style={{ display: 'grid', gap: 8 }}>
        <label>
          <span className="footer-note">Email</span>
          <input
            type="email"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(String(e.target.value || '').trim())}
            required
            autoComplete="email"
          />
        </label>
        <label>
          <span className="footer-note">Password</span>
          <input
            type="password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value || '')}
            required
            autoComplete="new-password"
            minLength={6}
          />
        </label>
        <button className="btn" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
        <div className="footer-note">After sign-up, check your email if confirmations are enabled.</div>
      </div>
    </form>
  );
}
