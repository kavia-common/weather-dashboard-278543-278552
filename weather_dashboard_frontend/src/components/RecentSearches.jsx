import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { listRecentSearches } from '../services/userDataService';

// PUBLIC_INTERFACE
export default function RecentSearches({ onSelect }) {
  /** Shows last N recent searches for quick re-selection. */
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  async function refresh() {
    if (!user) return;
    const { data } = await listRecentSearches(user.id, 8);
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    setItems([]);
    if (user) {
      refresh();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h2 className="section-title">Recent Searches</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.length === 0 && <div className="footer-note">No recent searches.</div>}
        {items.map((it) => (
          <button
            key={it.id}
            className="btn"
            onClick={() => onSelect && onSelect(it.query)}
            aria-label={`Search ${it.query}`}
          >
            {it.query}
          </button>
        ))}
      </div>
    </div>
  );
}
