import React from 'react';
import { useAuth } from '../auth/AuthProvider';

// PUBLIC_INTERFACE
export default function AuthStatus() {
  /**
   * Accessible live region for authentication status messages.
   * Announces errors and important states for screen readers.
   */
  const { error, loading, user } = useAuth();
  const message = error
    ? error
    : loading
    ? 'Authenticating...'
    : user
    ? 'Signed in'
    : 'Signed out';

  return (
    <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: -9999 }}>
      {message}
    </div>
  );
}
