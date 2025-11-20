export function debounce(fn, delay = 400) {
  let t;
  return (...args) => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), delay);
  };
}

/**
 * PUBLIC_INTERFACE
 * sanitizeQuery - Sanitizes a search query to prevent injection and ensures safe usage in URLs.
 * Accepts only letters, numbers, space, comma, hyphen. Trims and collapses spaces.
 */
export function sanitizeQuery(input) {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim().slice(0, 80); // cap length to prevent abuse
  const cleaned = trimmed.replace(/[^a-zA-Z0-9 ,.-]/g, ''); // whitelist
  return cleaned.replace(/\s+/g, ' ');
}

/**
 * PUBLIC_INTERFACE
 * safeFetch - Wrapper around fetch that handles errors and timeouts.
 */
export async function safeFetch(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Network error: ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}
