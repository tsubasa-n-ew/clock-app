import { useState, useEffect } from 'react';

export interface ClockTime {
  hours: number;
  minutes: number;
  seconds: number;
  year: number;
  month: number;
  day: number;
  dayOfWeek: string;
}

const DAY_OF_WEEK_JA = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];

function getClockTime(): ClockTime {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    dayOfWeek: DAY_OF_WEEK_JA[now.getDay()],
  };
}

export function useClock(): ClockTime {
  const [time, setTime] = useState<ClockTime>(getClockTime);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getClockTime());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
