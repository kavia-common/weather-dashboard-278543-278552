import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { addFavoriteLocation, listFavoriteLocations, removeFavoriteLocation } from '../services/userDataService';

// PUBLIC_INTERFACE
export default function FavoritesSidebar({ onSelect }) {
  /** Renders a favorites list for the current user with remove and select. */
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  async function refresh() {
    if (!user) return;
    const { data } = await listFavoriteLocations(user.id);
    setFavorites(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    setFavorites([]);
    setError(null);
    if (user) {
      refresh();
    }
  }, [user]);

  const removeFav = async (name) => {
    if (!user) return;
    const res = await removeFavoriteLocation(user.id, name);
    if (res?.error) {
      setError('Unable to remove favorite');
    } else {
      refresh();
    }
  };

  if (!user) {
    return (
      <div className="card">
        <h2 className="section-title">Favorites</h2>
        <div className="footer-note">Sign in to save favorite locations.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="section-title">Favorites</h2>
      {error && <div className="alert" role="alert">{error}</div>}
      <div style={{ display: 'grid', gap: 8 }}>
        {favorites.length === 0 && <div className="footer-note">No favorites yet.</div>}
        {favorites.map((f) => (
          <div key={f.id} className="item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn" onClick={() => onSelect && onSelect(f.location_name)} aria-label={`Select ${f.location_name}`}>
              {f.location_name}{f.country ? `, ${f.country}` : ''}
            </button>
            <button
              className="btn"
              onClick={() => removeFav(f.location_name)}
              aria-label={`Remove ${f.location_name}`}
            >
              {'✕'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function AddFavoriteButton({ location }) {
  /** Button to add current location to favorites. */
  const { user } = useAuth();
  const [status, setStatus] = useState('');
  if (!user) return null;
  const onAdd = async () => {
    setStatus('');
    if (!location?.name) return;
    const res = await addFavoriteLocation(user.id, location.name, location.country || '');
    if (res?.error) setStatus('Unable to save favorite');
    else setStatus('Saved');
    setTimeout(() => setStatus(''), 1500);
  };
  return (
    <div>
      <button className="btn" onClick={onAdd} aria-label="Add to favorites">{'★'} Save</button>
      {status && <span className="footer-note" style={{ marginLeft: 8 }}>{status}</span>}
    </div>
  );
}
