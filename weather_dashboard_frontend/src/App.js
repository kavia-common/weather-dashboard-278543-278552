import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './theme.css';
import Header from './components/Header';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ForecastList from './components/ForecastList';
import ForecastGraph from './components/ForecastGraph';
import Sidebar from './components/Sidebar';
import Spinner from './components/Spinner';
import WeatherCard from './components/WeatherCard';
import { fetchWeather } from './services/weatherService';
import { useAuth } from './auth/AuthProvider';
import { AddFavoriteButton } from './components/FavoritesSidebar';
import { addRecentSearch } from './services/userDataService';

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
  const { user } = useAuth();

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
      // Record recent search for signed-in users
      if (user?.id) {
        await addRecentSearch(user.id, q, 8);
      }
    } catch (e) {
      const isCityNotFound = e && (e.code === 'CITY_NOT_FOUND' || /CITY_NOT_FOUND/.test(String(e.message)));
      setError(isCityNotFound ? 'City not found. Try another search.' : 'Failed to load weather data.');
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
        <h1 className="section-title" style={{ fontSize: 22, marginTop: 8 }}>Weather Dashboard</h1>
        <div className="layout" role="main">
          <div className="sidebar">
            <Sidebar current={data.current} onSelect={handleSearch} />
          </div>

          <div className="content">
            {error && <div className="alert" role="alert">{error}</div>}
            {loading && !data.current && <Spinner label="Loading data…" />}

            <div className="row">
              <div>
                {/* Existing detailed card remains for extended info */}
                <CurrentWeatherCard
                  location={data.location}
                  current={data.current}
                  loading={loading && !data.current}
                  error={!!error && !data.current}
                />
                {/* New compact WeatherCard per requirement */}
                {data.current && (
                  <div style={{ marginTop: 12 }}>
                    <WeatherCard
                      city={data.location?.name}
                      country={data.location?.country}
                      temperatureC={data.current?.tempC}
                      condition={data.current?.condition}
                      humidity={data.current?.humidity}
                      windKph={data.current?.windKph}
                      icon={data.current?.icon}
                      updatedAt={data.current?.updatedAt}
                    />
                  </div>
                )}
                {data.location?.name && <AddFavoriteButton location={data.location} />}
              </div>
              <ForecastGraph hourly={hourlyForChart} />
            </div>

            <div className="row" style={{ marginTop: 16 }}>
              <ForecastList title="Hourly Forecast" items={data.hourly} type="hourly" />
              <ForecastList title="7-Day Forecast" items={data.daily} type="daily" />
            </div>

            <div className="footer-note" style={{ marginTop: 12 }}>
              {process.env.REACT_APP_API_BASE
                ? 'Using backend proxy for weather data.'
                : (process.env.REACT_APP_WEATHER_API_KEY
                    ? 'Using direct OpenWeatherMap API.'
                    : 'Set REACT_APP_API_BASE or REACT_APP_WEATHER_API_KEY to enable live data.')}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
