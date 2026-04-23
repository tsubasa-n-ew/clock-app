import type { ClockTime } from '../hooks/useClock';
import { vw } from '../App';

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
    fontSize: vw(204.198),
    letterSpacing: vw(-10.21),
    lineHeight: 1,
    fontWeight,
    color: 'inherit',
  };

  const kanjiStyleHM: React.CSSProperties = {
    fontFamily: 'Noto Sans JP, sans-serif',
    fontSize: vw(102.099),
    paddingTop: vw(51.049),
    width: vw(102.099),
    lineHeight: 1,
    fontWeight,
    color: 'inherit',
  };

  const numStyleSec: React.CSSProperties = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: vw(96),
    letterSpacing: vw(-4.8),
    lineHeight: 1,
    fontWeight,
    color: 'inherit',
  };

  const kanjiStyleSec: React.CSSProperties = {
    fontFamily: 'Noto Sans JP, sans-serif',
    fontSize: vw(48),
    paddingTop: vw(24.37),
    width: vw(48.741),
    lineHeight: 1,
    fontWeight,
    color: 'inherit',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: vw(30), whiteSpace: 'nowrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: vw(19.203) }}>
        <span style={numStyleHM}>{pad(time.hours)}</span>
        <span style={kanjiStyleHM}>時</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: vw(19.203) }}>
        <span style={numStyleHM}>{pad(time.minutes)}</span>
        <span style={kanjiStyleHM}>分</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: vw(9.167), paddingTop: vw(73.211) }}>
        <span style={numStyleSec}>{pad(time.seconds)}</span>
        <span style={kanjiStyleSec}>秒</span>
      </div>
    </div>
  );
}
