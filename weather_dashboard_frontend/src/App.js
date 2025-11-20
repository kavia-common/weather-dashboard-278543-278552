import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './theme.css';
import Header from './components/Header';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ForecastList from './components/ForecastList';
import ForecastGraph from './components/ForecastGraph';
import Sidebar from './components/Sidebar';
import { fetchWeather } from './services/weatherService';

/**
 * PUBLIC_INTERFACE
 * App - Weather Dashboard root component.
 * Renders header with search, current conditions, hourly and daily forecast,
 * simple temperature trend graph, and a responsive sidebar.
 */
function App() {
  const [theme] = useState('light'); // reserved for future theme switch if needed
  const [statusMsg, setStatusMsg] = useState('');
  const [query, setQuery] = useState('');
  const [data, setData] = useState({ location: null, current: null, hourly: [], daily: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Apply theme data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  const handleSearch = async (q) => {
    setQuery(q);
    if (!q) {
      setStatusMsg('Cleared search');
      setData({ location: null, current: null, hourly: [], daily: [] });
      setError(null);
      return;
    }
    setStatusMsg(`Searching for ${q}…`);
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWeather(q);
      setData({
        location: res.location || null,
        current: res.current || null,
        hourly: Array.isArray(res.hourly) ? res.hourly : [],
        daily: Array.isArray(res.daily) ? res.daily : [],
      });
      setStatusMsg(`Loaded forecast for ${res.location?.name || q}`);
    } catch (e) {
      // Avoid exposing stack traces or internal details
      setError('Failed to load weather data.');
      setStatusMsg('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const hourlyForChart = useMemo(() => data.hourly.slice(0, 12), [data.hourly]);

  return (
    <div>
      <Header onSearch={handleSearch} statusMessage={statusMsg} />
      <main className="container">
        <div className="layout" role="main">
          <div className="sidebar">
            <Sidebar current={data.current} />
          </div>

          <div className="content">
            {error && <div className="alert" role="alert">{error}</div>}
            {loading && !data.current && <div className="loading" role="status" aria-live="polite">Loading data…</div>}

            <div className="row">
              <CurrentWeatherCard
                location={data.location}
                current={data.current}
                loading={loading && !data.current}
                error={!!error && !data.current}
              />
              <ForecastGraph hourly={hourlyForChart} />
            </div>

            <div className="row" style={{ marginTop: 16 }}>
              <ForecastList title="Hourly Forecast" items={data.hourly} type="hourly" />
              <ForecastList title="7-Day Forecast" items={data.daily} type="daily" />
            </div>

            <div className="footer-note" style={{ marginTop: 12 }}>
              API base: {process.env.REACT_APP_API_BASE ? 'Configured' : 'Not configured (using mock data)'}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
