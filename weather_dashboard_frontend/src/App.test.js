import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from './components/SearchBar';
import CurrentWeatherCard from './components/CurrentWeatherCard';

jest.useFakeTimers();

test('SearchBar debounces input and calls onSearch', async () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);

  const input = screen.getByTestId('search-input');
  fireEvent.change(input, { target: { value: 'Sea' } });
  fireEvent.change(input, { target: { value: 'Seatt' } });
  fireEvent.change(input, { target: { value: 'Seattle' } });

  // Fast-forward debounce time
  jest.advanceTimersByTime(500);

  await waitFor(() => {
    expect(onSearch).toHaveBeenCalled();
  });
  expect(onSearch).toHaveBeenLastCalledWith('Seattle');
});

test('CurrentWeatherCard renders temperature and city', () => {
  const current = {
    tempC: 20,
    humidity: 50,
    windKph: 10,
    feelsLikeC: 19,
    condition: 'Sunny',
    updatedAt: new Date().toISOString(),
    icon: '☀️',
  };
  const location = { name: 'Seattle', country: 'USA' };

  render(<CurrentWeatherCard current={current} location={location} loading={false} error={false} />);

  expect(screen.getByText(/Current Conditions/i)).toBeInTheDocument();
  expect(screen.getByText(/Seattle/)).toBeInTheDocument();
  expect(screen.getByTestId('current-temp')).toHaveTextContent('20°C');
});
