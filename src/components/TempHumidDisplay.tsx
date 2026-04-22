import type { WeatherData } from '../types';
import { vw } from '../App';

interface Props {
  weather: WeatherData;
}

export function TempHumidDisplay({ weather }: Props) {
  const tempStr = weather.temperature !== null ? String(Math.round(weather.temperature)) : '--';
  const humidStr = weather.humidity !== null ? String(Math.round(weather.humidity)) : '--';

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Noto Sans JP, sans-serif',
    fontSize: vw(24),
    paddingTop: vw(12),
    color: 'inherit',
  };

  const numberStyle: React.CSSProperties = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: vw(48),
    color: 'inherit',
  };

  const degreeStyle: React.CSSProperties = {
    fontSize: vw(24),
    paddingTop: vw(12),
    width: vw(24),
    color: 'inherit',
  };

  const percentStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: vw(24),
    paddingTop: vw(12),
    width: vw(24),
    color: 'inherit',
  };

  return (
    <div style={{ display: 'flex', gap: vw(32), whiteSpace: 'nowrap', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: vw(8) }}>
        <span style={labelStyle}>気温</span>
        <span style={numberStyle}>{tempStr}</span>
        <span style={degreeStyle}>度</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: vw(8) }}>
        <span style={labelStyle}>湿度</span>
        <span style={numberStyle}>{humidStr}</span>
        <span style={percentStyle}>%</span>
      </div>
    </div>
  );
}
