import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from './AuthProvider';

// Mock the supabase client provider to inject a fake client for tests
jest.mock('../services/supabaseClient', () => {
  let listeners = [];
  const fakeSession = { user: { id: 'u1', email: 'user@example.com' } };
  let currentSession = null;

  const client = {
    auth: {
      getSession: jest.fn(async () => ({ data: { session: currentSession }, error: null })),
      onAuthStateChange: jest.fn((cb) => {
        const sub = { unsubscribe: () => {} };
        const entry = { callback: cb, subscription: sub };
        listeners.push(entry);
        return { data: { subscription: sub } };
      }),
      signInWithPassword: jest.fn(async ({ email, password }) => {
        if (email && password) {
          currentSession = fakeSession;
          listeners.forEach((l) => l.callback('SIGNED_IN', currentSession));
          return { data: { session: currentSession, user: fakeSession.user }, error: null };
        }
        return { data: { session: null, user: null }, error: new Error('bad') };
      }),
      signUp: jest.fn(async ({ email, password }) => {
        if (email && password) {
          return { data: { user: { id: 'u2', email } }, error: null };
        }
        return { data: null, error: new Error('bad') };
      }),
      signOut: jest.fn(async () => {
        currentSession = null;
        listeners.forEach((l) => l.callback('SIGNED_OUT', null));
        return { error: null };
      }),
    },
    from: jest.fn(),
  };

  return {
    getSupabaseClient: () => client,
  };
});

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

test('AuthProvider exposes default shape without crash when supabase not configured', async () => {
  // For this test, temporarily mock getSupabaseClient to return null
  jest.isolateModules(() => {
    jest.doMock('../services/supabaseClient', () => ({ getSupabaseClient: () => null }));
    const { AuthProvider: Provider, useAuth: hook } = require('./AuthProvider');
    function W({ children }) {
      return <Provider>{children}</Provider>;
    }
    const { result } = renderHook(() => hook(), { wrapper: W });
    expect(result.current).toHaveProperty('user', null);
    expect(result.current).toHaveProperty('session', null);
    expect(result.current).toHaveProperty('loading', false);
    expect(result.current).toHaveProperty('error', null);
  });
});

test('AuthProvider initializes with user=null, then reflects sign-in and sign-out', async () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  // Initially loading may be true briefly, but user should be null
  expect(result.current.user).toBe(null);

  // Sign in
  await act(async () => {
    await result.current.signIn('user@example.com', 'password123');
  });
  expect(result.current.user).toEqual(expect.objectContaining({ email: 'user@example.com' }));

  // Sign out
  await act(async () => {
    await result.current.signOut();
  });
  expect(result.current.user).toBe(null);
});
