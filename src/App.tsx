import { useState, useEffect, useRef, useCallback } from 'react';
import { useClock } from './hooks/useClock';
import { useWeather } from './hooks/useWeather';
import { TimeDisplay } from './components/TimeDisplay';
import { DateDisplay } from './components/DateDisplay';
import { WeatherDisplay } from './components/WeatherDisplay';
import { TempHumidDisplay } from './components/TempHumidDisplay';
import { GearButton } from './components/GearButton';
import { SettingsPanel } from './components/SettingsPanel';
import type { Settings, FontWeight, ColorMode } from './types';

const SETTINGS_KEY = 'clock_settings';
const CITY_KEY = 'clock_city';
const GEAR_VISIBLE_MS = 3000;

// 横方向: 1024px基準 → vw
export function vw(px: number): string {
  return `${(px / 1024) * 100}vw`;
}

// 縦方向: 600px基準 → vh
export function vh(px: number): string {
  return `${(px / 600) * 100}vh`;
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { fontWeight: 'regular', colorMode: 'light' };
    return JSON.parse(raw) as Settings;
  } catch {
    return { fontWeight: 'regular', colorMode: 'light' };
  }
}

function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {}
}

function toFontWeightNumber(fw: FontWeight): number {
  switch (fw) {
    case 'thin': return 100;
    case 'light': return 300;
    case 'regular': return 400;
    case 'medium': return 500;
    case 'bold': return 700;
    default: return 400;
  }
}

export default function App() {
  const time = useClock();
  const [city, setCity] = useState(() => localStorage.getItem(CITY_KEY) ?? '');
  const { data: weather, refresh: refreshWeather } = useWeather(city);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [gearVisible, setGearVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const gearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleCityChange(newCity: string) {
    localStorage.setItem(CITY_KEY, newCity);
    setCity(newCity);
  }

  const handleScreenTap = useCallback(() => {
    if (panelOpen) return;
    setGearVisible(true);
    if (gearTimerRef.current !== null) {
      clearTimeout(gearTimerRef.current);
    }
    gearTimerRef.current = setTimeout(() => {
      setGearVisible(false);
      gearTimerRef.current = null;
    }, GEAR_VISIBLE_MS);
  }, [panelOpen]);

  useEffect(() => {
    return () => {
      if (gearTimerRef.current !== null) {
        clearTimeout(gearTimerRef.current);
      }
    };
  }, []);

  function updateSettings(partial: Partial<Settings>) {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }

  function handleFontWeightChange(fw: FontWeight) {
    updateSettings({ fontWeight: fw });
  }

  function handleColorModeChange(cm: ColorMode) {
    updateSettings({ colorMode: cm });
  }

  const fontWeightValue = toFontWeightNumber(settings.fontWeight);
  const isDark = settings.colorMode === 'dark';
  const bg = isDark ? '#1a1a1a' : 'rgba(255, 255, 255, 0.93)';
  const fg = isDark ? '#e0e0e0' : '#222';

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'default',
        background: bg,
        color: fg,
      }}
      onClick={handleScreenTap}
    >
      {weather.available && (
        <div
          style={{
            position: 'absolute',
            right: vw(72),
            top: vh(75),
            transform: 'translateY(-50%)',
          }}
        >
          <WeatherDisplay weather={weather} />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          top: vh(157),
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <TimeDisplay time={time} fontWeight={fontWeightValue} />
      </div>
      <GearButton
        visible={gearVisible}
        onClick={() => {
          setPanelOpen(true);
          setGearVisible(false);
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: vh(454),
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: vw(130),
          flexWrap: 'nowrap',
        }}
      >
        <DateDisplay fontWeight={fontWeightValue} />
        {weather.available && <TempHumidDisplay weather={weather} />}
      </div>
      {panelOpen && (
        <SettingsPanel
          settings={settings}
          city={city}
          onClose={() => setPanelOpen(false)}
          onFontWeightChange={handleFontWeightChange}
          onColorModeChange={handleColorModeChange}
          onCityChange={handleCityChange}
          onRefreshWeather={refreshWeather}
        />
      )}
    </div>
  );
}
