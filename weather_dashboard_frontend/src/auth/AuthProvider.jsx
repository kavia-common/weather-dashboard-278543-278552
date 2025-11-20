import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../services/supabaseClient';

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  error: null,
  signIn: async (_email, _password) => {},
  signUp: async (_email, _password, _redirectTo) => {},
  signOut: async () => {},
});

/**
 * AuthProvider manages Supabase session and exposes auth operations.
 * - Reads session on mount, listens for changes.
 * - Provides accessible error messages without leaking details.
 */
export function AuthProvider({ children }) {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!supabase); // if not configured, we still render
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const { data, error: err } = await supabase.auth.getSession();
        if (!active) return;
        if (err) {
          setError('Failed to load session');
        } else {
          setSession(data?.session || null);
          setUser(data?.session?.user || null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess || null);
      setUser(sess?.user || null);
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [supabase]);

  const signIn = useCallback(
    async (email, password) => {
      if (!supabase) {
        setError('Auth not configured');
        return { error: 'Auth not configured' };
      }
      setError(null);
      try {
        // Basic sanitization
        const e = String(email || '').trim().slice(0, 120);
        const p = String(password || '').slice(0, 256);
        const { data, error: err } = await supabase.auth.signInWithPassword({ email: e, password: p });
        if (err) {
          setError('Invalid credentials or sign-in failed');
          return { error: 'Sign-in failed' };
        }
        setSession(data.session || null);
        setUser(data.user || null);
        return { data };
      } catch {
        setError('Sign-in failed');
        return { error: 'Sign-in failed' };
      }
    },
    [supabase]
  );

  const signUp = useCallback(
    async (email, password, redirectTo) => {
      if (!supabase) {
        setError('Auth not configured');
        return { error: 'Auth not configured' };
      }
      setError(null);
      try {
        const e = String(email || '').trim().slice(0, 120);
        const p = String(password || '').slice(0, 256);
        const options = {};
        const siteUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
        // Supabase recommends passing emailRedirectTo for email confirmation flows
        options.emailRedirectTo = redirectTo || siteUrl;
        const { data, error: err } = await supabase.auth.signUp({ email: e, password: p, options });
        if (err) {
          setError('Signup failed');
          return { error: 'Signup failed' };
        }
        return { data };
      } catch {
        setError('Signup failed');
        return { error: 'Signup failed' };
      }
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    if (!supabase) {
      setError('Auth not configured');
      return { error: 'Auth not configured' };
    }
    try {
      const { error: err } = await supabase.auth.signOut();
      if (err) {
        setError('Sign-out failed');
        return { error: 'Sign-out failed' };
      }
      setSession(null);
      setUser(null);
      return { data: true };
    } catch {
      setError('Sign-out failed');
      return { error: 'Sign-out failed' };
    }
  }, [supabase]);

  const value = useMemo(
    () => ({ user, session, loading, error, signIn, signUp, signOut }),
    [user, session, loading, error, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Returns auth context with user, session, loading, error, and operations. */
  return useContext(AuthContext);
}
