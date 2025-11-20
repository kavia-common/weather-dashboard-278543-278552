import React from 'react';
import { useAuth } from '../../auth/AuthProvider';

// PUBLIC_INTERFACE
export default function SignOutButton() {
  /** Sign-out button that calls Supabase signOut via context. */
  const { signOut, loading } = useAuth();
  return (
    <button className="btn" onClick={() => signOut()} disabled={loading} aria-label="Sign out">
      ⎋ Sign out
    </button>
  );
}
