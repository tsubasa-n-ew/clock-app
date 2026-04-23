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
const LOCATION_KEY = 'clock_location_enabled';
const GEAR_VISIBLE_MS = 3000;

// 1024px = 100vw 基準の変換ヘルパー
export function vw(px: number): string {
  return `${(px / 1024) * 100}vw`;
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
  } catch {
    // ignore
  }
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
  const [locationEnabled, setLocationEnabled] = useState(() => localStorage.getItem(LOCATION_KEY) === 'true');
  const weather = useWeather(locationEnabled);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [gearVisible, setGearVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const gearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleLocationToggle(enabled: boolean) {
    localStorage.setItem(LOCATION_KEY, String(enabled));
    setLocationEnabled(enabled);
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

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: `${(600 / 1024) * 100}vw`,
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'default',
        background: isDark ? '#1a1a1a' : 'rgba(255, 255, 255, 0.93)',
        color: isDark ? '#e0e0e0' : '#222',
      }}
      onClick={handleScreenTap}
    >
      {weather.available && (
        <div
          style={{
            position: 'absolute',
            right: vw(72),
            top: vw(75),
            transform: 'translateY(-50%)',
          }}
        >
          <WeatherDisplay weather={weather} />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          top: vw(157),
          left: 'calc(50% - 0.879vw)',
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
          top: vw(454),
          left: 'calc(50% + 0.195vw)',
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
          locationEnabled={locationEnabled}
          onClose={() => setPanelOpen(false)}
          onFontWeightChange={handleFontWeightChange}
          onColorModeChange={handleColorModeChange}
          onLocationToggle={handleLocationToggle}
        />
      )}
    </div>
  );
}
