import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from './AuthProvider';

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

test('AuthProvider exposes default shape without crash when supabase not configured', async () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  expect(result.current).toHaveProperty('user', null);
  expect(result.current).toHaveProperty('session', null);
  expect(result.current).toHaveProperty('loading');
  expect(result.current).toHaveProperty('error', null);
  expect(typeof result.current.signIn).toBe('function');
  expect(typeof result.current.signUp).toBe('function');
  expect(typeof result.current.signOut).toBe('function');

  // Calls should not throw when not configured; should return error object
  let res;
  await act(async () => {
    res = await result.current.signIn('a@b.com', 'x');
  });
  expect(res).toHaveProperty('error');
});
