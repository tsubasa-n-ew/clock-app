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
const GEAR_VISIBLE_MS = 3000;

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
  const weather = useWeather();
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [gearVisible, setGearVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const gearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        width: '1024px',
        height: '600px',
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
            right: '72px',
            top: '75px',
            transform: 'translateY(-50%)',
          }}
        >
          <WeatherDisplay weather={weather} />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          top: '157px',
          left: 'calc(50% - 9px)',
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
          top: '454px',
          left: 'calc(50% + 2px)',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '130px',
          flexWrap: 'nowrap',
        }}
      >
        <DateDisplay fontWeight={fontWeightValue} />
        {weather.available && <TempHumidDisplay weather={weather} />}
      </div>
      {panelOpen && (
        <SettingsPanel
          settings={settings}
          onClose={() => setPanelOpen(false)}
          onFontWeightChange={handleFontWeightChange}
          onColorModeChange={handleColorModeChange}
        />
      )}
    </div>
  );
}
