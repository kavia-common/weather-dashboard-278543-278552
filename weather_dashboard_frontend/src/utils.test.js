import { sanitizeQuery, debounce } from './utils';

jest.useFakeTimers();

test('sanitizeQuery allows safe chars, trims, caps length and collapses spaces', () => {
  const s = sanitizeQuery('   New<>York!!  City 123   ');
  expect(s).toBe('NewYork City 123');
});

test('sanitizeQuery returns empty for non-string', () => {
  expect(sanitizeQuery(null)).toBe('');
  expect(sanitizeQuery(undefined)).toBe('');
  expect(sanitizeQuery(42)).toBe('');
});

test('debounce delays function execution', () => {
  const fn = jest.fn();
  const d = debounce(fn, 300);
  d(1);
  d(2);
  jest.advanceTimersByTime(299);
  expect(fn).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith(2);
});
