import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';

// PUBLIC_INTERFACE
export default function SignIn() {
  /** Simple email/password sign-in form with basic sanitization and a11y. */
  const { signIn, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <form onSubmit={submit} aria-label="Sign in form" className="card" style={{ width: '100%' }}>
      <h2 className="section-title">Sign in</h2>
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
            autoComplete="current-password"
            minLength={6}
          />
        </label>
        <button className="btn" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </div>
    </form>
  );
}
