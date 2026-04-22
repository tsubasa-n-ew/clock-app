import type { WeatherData } from '../types';

interface Props {
  weather: WeatherData;
}

export function WeatherDisplay({ weather }: Props) {
  const spanStyle: React.CSSProperties = {
    fontFamily: 'Roboto, Noto Sans JP, sans-serif',
    fontSize: '24px',
    color: 'inherit',
    textAlign: 'right',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={spanStyle}>{weather.locationName}</span>
      <span style={{ ...spanStyle, marginLeft: '8px' }}>{weather.weatherText}</span>
    </div>
  );
}
