import { useState, useEffect } from 'react';

const DAY_OF_WEEK_JA = ['日', '月', '火', '水', '木', '金', '土'];

interface DateInfo {
  year: number;
  month: number;
  day: number;
  dayOfWeek: string;
}

function getDateInfo(): DateInfo {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    dayOfWeek: DAY_OF_WEEK_JA[now.getDay()],
  };
}

interface Props {
  fontWeight?: number;
}

export function DateDisplay({ fontWeight = 400 }: Props) {
  const [date, setDate] = useState<DateInfo>(getDateInfo);

  useEffect(() => {
    const id = setInterval(() => {
      setDate(getDateInfo());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const numberStyle: React.CSSProperties = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '48px',
    lineHeight: 1,
    color: 'inherit',
    fontWeight,
  };

  const kanjiStyle: React.CSSProperties = {
    fontFamily: 'Noto Sans JP, sans-serif',
    fontSize: '24px',
    lineHeight: 1,
    paddingTop: '12px',
    width: '24px',
    color: 'inherit',
  };

  const unitStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const dowKanjiStyle: React.CSSProperties = {
    fontFamily: 'Noto Sans JP, sans-serif',
    fontSize: '40px',
    lineHeight: 1,
    fontWeight,
    color: 'inherit',
  };

  const dowLabelStyle: React.CSSProperties = {
    fontFamily: 'Noto Sans JP, sans-serif',
    fontSize: '24px',
    lineHeight: 1,
    paddingTop: '12px',
    color: 'inherit',
  };

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', whiteSpace: 'nowrap', flexShrink: 0 }}>
      <div style={unitStyle}>
        <span style={numberStyle}>{date.year}</span>
        <span style={kanjiStyle}>年</span>
      </div>
      <div style={unitStyle}>
        <span style={numberStyle}>{date.month}</span>
        <span style={kanjiStyle}>月</span>
      </div>
      <div style={unitStyle}>
        <span style={numberStyle}>{date.day}</span>
        <span style={kanjiStyle}>日</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={dowKanjiStyle}>{date.dayOfWeek}</span>
        <span style={dowLabelStyle}>曜日</span>
      </div>
    </div>
  );
}
