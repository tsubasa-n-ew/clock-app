import type { WeatherData } from '../types';
import { vw } from '../App';

interface Props {
  weather: WeatherData;
}

export function WeatherDisplay({ weather }: Props) {
  const spanStyle: React.CSSProperties = {
    fontFamily: 'Roboto, Noto Sans JP, sans-serif',
    fontSize: vw(24),
    color: 'inherit',
    textAlign: 'right',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      <span style={spanStyle}>{weather.locationName}</span>
      <span style={{ ...spanStyle, marginLeft: vw(8) }}>{weather.weatherText}</span>
    </div>
  );
}
