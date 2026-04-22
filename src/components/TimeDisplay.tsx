import type { ClockTime } from '../hooks/useClock';

interface Props {
  time: ClockTime;
  fontWeight?: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function TimeDisplay({ time, fontWeight = 400 }: Props) {
  const numStyleHM: React.CSSProperties = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '204.198px',
    letterSpacing: '-10.21px',
    lineHeight: 1,
    fontWeight,
    color: 'inherit',
  };

  const kanjiStyleHM: React.CSSProperties = {
    fontFamily: 'Noto Sans JP, sans-serif',
    fontSize: '102.099px',
    paddingTop: '51.049px',
    width: '102.099px',
    lineHeight: 1,
    fontWeight,
    color: 'inherit',
  };

  const numStyleSec: React.CSSProperties = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '96px',
    letterSpacing: '-4.8px',
    lineHeight: 1,
    fontWeight,
    color: 'inherit',
  };

  const kanjiStyleSec: React.CSSProperties = {
    fontFamily: 'Noto Sans JP, sans-serif',
    fontSize: '48px',
    paddingTop: '24.37px',
    width: '48.741px',
    lineHeight: 1,
    fontWeight,
    color: 'inherit',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', whiteSpace: 'nowrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '19.203px', width: '340px' }}>
        <span style={numStyleHM}>{pad(time.hours)}</span>
        <span style={kanjiStyleHM}>時</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '19.203px', width: '340px' }}>
        <span style={numStyleHM}>{pad(time.minutes)}</span>
        <span style={kanjiStyleHM}>分</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '9.167px', width: '160px', paddingTop: '73.211px' }}>
        <span style={numStyleSec}>{pad(time.seconds)}</span>
        <span style={kanjiStyleSec}>秒</span>
      </div>
    </div>
  );
}
