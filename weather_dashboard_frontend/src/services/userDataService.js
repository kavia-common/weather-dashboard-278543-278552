import { getSupabaseClient } from './supabaseClient';

function sanitizeText(input, maxLen = 120) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[\u0000-\u001F<>]/g, '').slice(0, maxLen);
}

// PUBLIC_INTERFACE
export async function addFavoriteLocation(userId, locationName, country) {
  /** Adds a favorite location for a user. */
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return { error: 'Not authorized' };
  const name = sanitizeText(locationName, 120);
  const ctry = sanitizeText(country || '', 80);
  if (!name) return { error: 'Invalid location' };
  try {
    const { data, error } = await supabase
      .from('favorites')
      .upsert({ user_id: userId, location_name: name, country: ctry }, { onConflict: 'user_id,location_name' })
      .select();
    if (error) return { error: 'Failed to save favorite' };
    return { data };
  } catch {
    return { error: 'Failed to save favorite' };
  }
}

// PUBLIC_INTERFACE
export async function removeFavoriteLocation(userId, locationName) {
  /** Removes a favorite location for a user. */
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return { error: 'Not authorized' };
  const name = sanitizeText(locationName, 120);
  if (!name) return { error: 'Invalid location' };
  try {
    const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('location_name', name);
    if (error) return { error: 'Failed to remove favorite' };
    return { data: true };
  } catch {
    return { error: 'Failed to remove favorite' };
  }
}

// PUBLIC_INTERFACE
export async function listFavoriteLocations(userId) {
  /** Lists favorite locations for a user. */
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return { data: [] };
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id, location_name, country, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return { data: [] };
    return { data: data || [] };
  } catch {
    return { data: [] };
  }
}

// PUBLIC_INTERFACE
export async function addRecentSearch(userId, query, limit = 8) {
  /** Adds a recent search entry and prunes to last N queries per user. */
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return { error: 'Not authorized' };
  const q = sanitizeText(query, 120);
  if (!q) return { error: 'Invalid query' };
  try {
    // insert
    const { error: insErr } = await supabase.from('recent_searches').insert({ user_id: userId, query: q });
    if (insErr) return { error: 'Failed to save search' };

    // prune older items over limit
    const { data } = await supabase
      .from('recent_searches')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (Array.isArray(data) && data.length > limit) {
      const idsToRemove = data.slice(limit).map((d) => d.id);
      if (idsToRemove.length) {
        await supabase.from('recent_searches').delete().in('id', idsToRemove);
      }
    }
    return { data: true };
  } catch {
    return { error: 'Failed to save search' };
  }
}

// PUBLIC_INTERFACE
export async function listRecentSearches(userId, limit = 8) {
  /** Lists last N recent searches for a user. */
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return { data: [] };
  try {
    const { data, error } = await supabase
      .from('recent_searches')
      .select('id, query, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return { data: [] };
    return { data: data || [] };
  } catch {
    return { data: [] };
  }
}
