import type { WeatherData } from '../types';

interface Props {
  weather: WeatherData;
}

export function TempHumidDisplay({ weather }: Props) {
  const tempStr = weather.temperature !== null ? String(Math.round(weather.temperature)) : '--';
  const humidStr = weather.humidity !== null ? String(Math.round(weather.humidity)) : '--';

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Noto Sans JP, sans-serif',
    fontSize: '24px',
    paddingTop: '12px',
    color: 'inherit',
  };

  const numberStyle: React.CSSProperties = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '48px',
    color: 'inherit',
  };

  const degreeStyle: React.CSSProperties = {
    fontSize: '24px',
    paddingTop: '12px',
    width: '24px',
    color: 'inherit',
  };

  const percentStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '24px',
    paddingTop: '12px',
    width: '24px',
    color: 'inherit',
  };

  return (
    <div style={{ display: 'flex', gap: '32px', whiteSpace: 'nowrap', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={labelStyle}>気温</span>
        <span style={numberStyle}>{tempStr}</span>
        <span style={degreeStyle}>度</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={labelStyle}>湿度</span>
        <span style={numberStyle}>{humidStr}</span>
        <span style={percentStyle}>%</span>
      </div>
    </div>
  );
}
