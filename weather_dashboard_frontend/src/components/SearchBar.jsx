import React, { useMemo, useState } from 'react';
import { debounce, sanitizeQuery } from '../utils';

// PUBLIC_INTERFACE
export default function SearchBar({ onSearch }) {
  /**
   * Accessible search input that debounces user input and triggers onSearch(query).
   * Input is sanitized to prevent injection and noisy characters.
   */
  const [value, setValue] = useState('');
  const debounced = useMemo(
    () =>
      debounce((v) => {
        const clean = sanitizeQuery(v);
        onSearch && onSearch(clean);
      }, 500),
    [onSearch]
  );

  const onChange = (e) => {
    const v = e.target.value;
    setValue(v);
    debounced(v);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const clean = sanitizeQuery(value);
    onSearch && onSearch(clean);
  };

  return (
    <form className="searchbar" role="search" aria-label="Search location" onSubmit={onSubmit}>
      <span className="icon-left" aria-hidden="true">🔎</span>
      <input
        data-testid="search-input"
        type="text"
        placeholder="Search city (e.g., Seattle)"
        aria-label="Search city"
        value={value}
        onChange={onChange}
        inputMode="search"
        autoComplete="off"
      />
      <button className="icon-right btn" aria-label="Submit search" type="submit">
        Go
      </button>
    </form>
  );
}
